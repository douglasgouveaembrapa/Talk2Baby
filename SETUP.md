# Guia de configuração — Supabase e IA

Passo a passo para colocar o Talk2Baby funcionando de ponta a ponta.

## Parte 1 — Supabase (banco de dados)

1. **Crie a conta e o projeto**
   - Acesse [supabase.com](https://supabase.com) → *Start your project* → login com GitHub.
   - *New project* → escolha organização, nome `talk2baby`, uma senha forte de banco (guarde-a) e a região **South America (São Paulo)** para menor latência.
   - Aguarde ~2 minutos até o projeto provisionar.

2. **Crie a tabela**
   - No painel do projeto, abra **SQL Editor** → *New query*.
   - Cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) → **Run**.
   - Confira em **Table Editor**: a tabela `baby_events` deve aparecer.

3. **Copie as credenciais**
   - **Project Settings → API**:
     - *Project URL* → vai em `EXPO_PUBLIC_SUPABASE_URL`
     - *anon public key* → vai em `EXPO_PUBLIC_SUPABASE_ANON_KEY`

4. **Configure o app**
   ```bash
   cp .env.example .env
   # edite o .env com URL e anon key
   ```

5. **Teste**
   - `npx expo start` → abra no Expo Go → grave um evento por voz.
   - Volte ao **Table Editor** do Supabase e confirme que a linha apareceu em `baby_events`.

> ⚠️ A política RLS atual (`anon full access`) é só para desenvolvimento.
> Antes de publicar: ative **Authentication** (e-mail ou Google), adicione uma
> coluna `user_id uuid default auth.uid()` e troque a política por
> `using (auth.uid() = user_id)`.

## Parte 2 — IA (transcrição + extração)

O pipeline tem duas etapas independentes:

| Etapa | O que faz | Quem faz |
|-------|-----------|----------|
| Speech-to-Text | áudio `.m4a` → texto pt-BR | **OpenAI Whisper** (obrigatório — a Anthropic não processa áudio) |
| Extração | texto → JSON (categoria, duração, lado…) | **GPT-4o-mini** *ou* **Claude Haiku** (você escolhe) |

### Opção A — Tudo OpenAI (mais simples, 1 chave só)

1. Acesse [platform.openai.com](https://platform.openai.com) → crie a conta.
2. **Settings → Billing** → adicione crédito (US$ 5 é suficiente por meses: Whisper custa ~US$ 0,006/min e o gpt-4o-mini centavos por milhar de registros).
3. **API keys** → *Create new secret key* → copie (ela só aparece uma vez).
4. No `.env`:
   ```
   EXPO_PUBLIC_AI_PROVIDER=openai
   EXPO_PUBLIC_OPENAI_API_KEY=sk-...
   ```

### Opção B — Whisper (OpenAI) + Claude (Anthropic) na extração

1. Faça os passos 1–3 da Opção A (o Whisper continua necessário).
2. Acesse [console.anthropic.com](https://console.anthropic.com) → crie a conta → **Billing** → adicione crédito.
3. **API Keys** → *Create Key* → copie.
4. No `.env`:
   ```
   EXPO_PUBLIC_AI_PROVIDER=anthropic
   EXPO_PUBLIC_OPENAI_API_KEY=sk-...        # usada só pelo Whisper
   EXPO_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...
   ```

### Teste do pipeline

Com o `.env` preenchido, reinicie o Metro (`npx expo start -c`), grave
"mamada de dez minutos no peito esquerdo" e verifique se o card de
confirmação mostra **Mamada · 10 min · peito esquerdo**.

## Parte 3 — Antes de publicar (segurança)

Variáveis `EXPO_PUBLIC_*` são embutidas no APK — qualquer pessoa pode
extraí-las. Antes de distribuir o app:

1. Crie uma **Supabase Edge Function** que receba o áudio/texto e chame
   OpenAI/Anthropic no servidor:
   ```bash
   npx supabase functions new process-voice
   npx supabase secrets set OPENAI_API_KEY=sk-... ANTHROPIC_API_KEY=sk-ant-...
   npx supabase functions deploy process-voice
   ```
2. Mova a lógica de `src/services/ai.ts` para dentro da função (Deno) e, no
   app, troque as chamadas diretas por
   `supabase.functions.invoke('process-voice', { body: ... })`.
3. Remova as chaves `EXPO_PUBLIC_OPENAI_API_KEY`/`ANTHROPIC` do `.env`.
4. Ative RLS por usuário (ver Parte 1).

## Custos estimados (uso típico: ~20 registros/dia)

- Whisper: ~10s de áudio por registro → **< US$ 0,01/dia**
- GPT-4o-mini ou Claude Haiku: ~500 tokens por registro → **centavos/mês**
- Supabase: plano gratuito cobre com folga (500 MB de banco)
