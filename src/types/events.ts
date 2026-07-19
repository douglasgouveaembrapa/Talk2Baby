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

import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

/**
 * Ícones vetoriais por categoria (checklist da skill UI/UX Pro Max:
 * nunca usar emoji como ícone).
 */
export const CATEGORY_META: Record<
  EventCategory,
  { label: string; icon: IconName }
> = {
  mamada: { label: 'Mamada', icon: 'baby-bottle-outline' },
  fralda: { label: 'Fralda', icon: 'human-baby-changing-table' },
  sono: { label: 'Sono', icon: 'sleep' },
  remedio: { label: 'Remédio', icon: 'pill' },
  outro: { label: 'Outros', icon: 'note-text-outline' },
};
