# Talk2Baby 🍼

App Android (React Native + Expo) para registrar a rotina do bebê **por voz**, sem formulários e sem menus. Aperte o botão, fale ("mamada de 10 minutos no peito esquerdo") e a IA estrutura e salva o registro.

## Como funciona

```
🎤 Gravação (expo-audio)
   → 📝 Transcrição (OpenAI Whisper, pt-BR)
   → 🤖 Extração de entidades (GPT-4o-mini ou Claude Haiku → JSON)
   → 💾 Persistência (Supabase / tabela baby_events)
```

Categorias automáticas: **Mamada · Fralda · Sono · Remédio · Outros** — com duração, lado do peito, conteúdo da fralda, observações e horário retroativo ("meia hora atrás").

## Estrutura de pastas

```
Talk2Baby/
├── app/                      # Rotas (expo-router, file-based)
│   ├── _layout.tsx           # Stack raiz, StatusBar, tema
│   ├── index.tsx             # ⭐ Home — botão de voz
│   ├── history.tsx           # Timeline editável (próxima etapa)
│   └── report.tsx            # Relatório p/ pediatra (próxima etapa)
├── src/
│   ├── components/
│   │   ├── MicButton.tsx     # Botão central: glow, respiração, anéis pulsantes
│   │   ├── SoundWave.tsx     # Ondas sonoras animadas durante a escuta
│   │   └── EventCard.tsx     # Card de confirmação do evento extraído
│   ├── hooks/
│   │   └── useRecorder.ts    # Gravação de áudio + permissões
│   ├── services/
│   │   ├── supabase.ts       # Cliente + CRUD de eventos
│   │   └── ai.ts             # Whisper (STT) + prompt de extração (LLM)
│   ├── theme/
│   │   ├── colors.ts         # Paleta light/dark (dark real p/ madrugada)
│   │   ├── typography.ts     # Escala tipográfica
│   │   └── index.ts          # useTheme()
│   └── types/
│       └── events.ts         # Tipos + metadados das categorias
├── supabase/
│   └── schema.sql            # Tabela baby_events + RLS
├── .env.example              # Variáveis de ambiente
└── app.json                  # Config Expo (permissão de microfone, dark mode)
```

## Setup

```bash
npm install
cp .env.example .env          # preencha Supabase + OpenAI/Anthropic
# Rode supabase/schema.sql no SQL Editor do seu projeto Supabase
npx expo start                # abra no Expo Go (Android)
```

## Decisões de design

- **Dark mode de baixa luminância**: fundo `#0F0E13`, texto sem branco puro, acentos dessaturados — pensado para uso às 3h sem acordar o bebê. Segue o modo do sistema automaticamente.
- **Zero fricção**: a Home tem um único alvo de toque gigante (148px). Histórico e relatório ficam em links discretos no rodapé.
- **Feedback em camadas**: háptica ao tocar, anéis pulsantes + ondas durante a escuta, card de confirmação com spring ao salvar.
- **Transcrição preservada** (`raw_text`): se a IA errar, o usuário edita no histórico vendo o que foi dito originalmente.

## ⚠️ Segurança (antes de publicar)

As chamadas de IA estão no client (`EXPO_PUBLIC_*`) para agilizar o desenvolvimento. Antes de qualquer build de produção, mova `src/services/ai.ts` para uma **Supabase Edge Function** e restrinja a RLS por usuário autenticado (`auth.uid()`).
