/** Categorias base de eventos da rotina do bebê. */
export type EventCategory = 'mamada' | 'fralda' | 'sono' | 'remedio' | 'outro';

export type BreastSide = 'esquerdo' | 'direito' | 'ambos';
export type DiaperContent = 'xixi' | 'coco';

/** Evento estruturado extraído da fala pela LLM. */
export interface ExtractedEvent {
  category: EventCategory;
  /** Duração em minutos (mamada, sono) */
  duration_min: number | null;
  /** Lado do peito (mamada) */
  side: BreastSide | null;
  /** Conteúdo da fralda */
  diaper_content: DiaperContent[] | null;
  /** Nome/dose do remédio ou qualquer detalhe extra */
  notes: string | null;
}

/** Registro persistido no Supabase. */
export interface BabyEvent extends ExtractedEvent {
  id: string;
  /** Momento do evento (ISO). A LLM pode ajustar se o usuário disser "há 1 hora". */
  occurred_at: string;
  /** Transcrição original — fonte da verdade para correções manuais. */
  raw_text: string;
  created_at: string;
}

export const CATEGORY_META: Record<
  EventCategory,
  { label: string; emoji: string }
> = {
  mamada: { label: 'Mamada', emoji: '🍼' },
  fralda: { label: 'Fralda', emoji: '🧷' },
  sono: { label: 'Sono', emoji: '🌙' },
  remedio: { label: 'Remédio', emoji: '💊' },
  outro: { label: 'Outros', emoji: '📝' },
};
