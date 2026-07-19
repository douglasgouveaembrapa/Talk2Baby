import { ExtractedEvent } from '@/types/events';

/**
 * Pipeline de IA: áudio → texto (Whisper) → JSON estruturado (LLM).
 *
 * ATENÇÃO (produção): estas chamadas devem morar numa Supabase Edge Function
 * para que a chave da API nunca seja embarcada no app. Aqui ficam no client
 * para agilizar o desenvolvimento.
 */

const OPENAI_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';
const ANTHROPIC_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';
const PROVIDER = process.env.EXPO_PUBLIC_AI_PROVIDER ?? 'openai';

const EXTRACTION_PROMPT = `Você extrai eventos da rotina de um bebê a partir de falas curtas de pais brasileiros.
Responda SOMENTE com um JSON válido, sem markdown, no formato:
{
  "category": "mamada" | "fralda" | "sono" | "remedio" | "outro",
  "duration_min": number | null,
  "side": "esquerdo" | "direito" | "ambos" | null,
  "diaper_content": ["xixi" | "coco"] | null,
  "notes": string | null,
  "minutes_ago": number | null
}
Regras:
- "minutes_ago": se a fala indicar que o evento já aconteceu ("há meia hora", "acordou às..."), estime quantos minutos atrás; senão null.
- "notes": detalhes relevantes não cobertos pelos outros campos (ex.: nome do remédio, "regurgitou um pouco"). null se não houver.
- Campos que não se aplicam à categoria devem ser null.
Exemplos:
"Mamada de 10 minutos no peito esquerdo" -> {"category":"mamada","duration_min":10,"side":"esquerdo","diaper_content":null,"notes":null,"minutes_ago":null}
"Troca de fralda com bastante cocô e xixi" -> {"category":"fralda","duration_min":null,"side":null,"diaper_content":["coco","xixi"],"notes":"bastante cocô","minutes_ago":null}
"Dei 3ml de paracetamol meia hora atrás" -> {"category":"remedio","duration_min":null,"side":null,"diaper_content":null,"notes":"paracetamol 3ml","minutes_ago":30}`;

/** Transcreve o áudio gravado usando o Whisper (OpenAI). */
export async function transcribeAudio(uri: string): Promise<string> {
  const form = new FormData();
  form.append('file', {
    uri,
    name: 'audio.m4a',
    type: 'audio/m4a',
    // FormData do React Native aceita objetos {uri, name, type}
  } as unknown as Blob);
  form.append('model', 'whisper-1');
  form.append('language', 'pt');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_KEY}` },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Falha na transcrição (${res.status})`);
  }
  const json = await res.json();
  return (json.text as string).trim();
}

/** Extrai o evento estruturado do texto transcrito. */
export async function extractEvent(
  text: string,
): Promise<ExtractedEvent & { minutes_ago: number | null }> {
  const raw =
    PROVIDER === 'anthropic'
      ? await extractWithAnthropic(text)
      : await extractWithOpenAI(text);

  const parsed = JSON.parse(raw);
  return {
    category: parsed.category ?? 'outro',
    duration_min: parsed.duration_min ?? null,
    side: parsed.side ?? null,
    diaper_content: parsed.diaper_content ?? null,
    notes: parsed.notes ?? null,
    minutes_ago: parsed.minutes_ago ?? null,
  };
}

async function extractWithOpenAI(text: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: EXTRACTION_PROMPT },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Falha na extração (${res.status})`);
  const json = await res.json();
  return json.choices[0].message.content;
}

async function extractWithAnthropic(text: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: EXTRACTION_PROMPT,
      messages: [{ role: 'user', content: text }],
    }),
  });
  if (!res.ok) throw new Error(`Falha na extração (${res.status})`);
  const json = await res.json();
  return json.content[0].text;
}
