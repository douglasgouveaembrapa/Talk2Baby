/**
 * Design system — Talk2Baby
 *
 * Paleta baseada no perfil "Parenting & Baby Tracker" da skill UI/UX Pro Max
 * (soft pink + trust blue), com dark mode derivado em luminância baixa para
 * uso às 3h da manhã sem acordar o bebê — seguindo os anti-patterns da skill:
 * nada de neon brilhante, nada de excesso de movimento.
 */

export interface Palette {
  /** Fundo principal da tela */
  background: string;
  /** Camada elevada (cards, sheets) */
  surface: string;
  /** Camada elevada nível 2 */
  surfaceHigh: string;
  /** Texto principal */
  text: string;
  /** Texto secundário / hints */
  textMuted: string;
  /** Cor de marca — rosa acolhedor (skill: #EC4899) */
  primary: string;
  /** Variante suave do primary para fundos/glow */
  primarySoft: string;
  /** Azul confiança — ações secundárias (skill: #0284C7) */
  accent: string;
  /** Gradiente do botão de voz */
  micGradient: [string, string];
  /** Glow pulsante ao redor do botão */
  micGlow: string;
  /** Coral suave do estado gravando */
  recording: string;
  /** Verde suave de confirmação */
  success: string;
  /** Âmbar suave de erro/atenção */
  danger: string;
  /** Bordas e divisores sutis */
  border: string;
  /** Cores por categoria de evento */
  category: {
    mamada: string;
    fralda: string;
    sono: string;
    remedio: string;
    outro: string;
  };
}

export const light: Palette = {
  background: '#FDF2F8',
  surface: '#FFFFFF',
  surfaceHigh: '#FDF4F8',
  text: '#0F172A',
  textMuted: '#64748B',
  primary: '#EC4899',
  primarySoft: '#FCE9F2',
  accent: '#0284C7',
  micGradient: ['#F472B6', '#DB2777'],
  micGlow: '#EC4899',
  recording: '#E05A4E',
  success: '#059669',
  danger: '#D97706',
  border: '#FCE9F2',
  category: {
    mamada: '#EC4899',
    fralda: '#D97706',
    sono: '#0284C7',
    remedio: '#059669',
    outro: '#64748B',
  },
};

export const dark: Palette = {
  background: '#131016',
  surface: '#1C1720',
  surfaceHigh: '#251E2B',
  text: '#EAE3EA',
  textMuted: '#8A8093',
  primary: '#C9679C',
  primarySoft: '#2C2030',
  accent: '#5E97BE',
  micGradient: ['#9C4E77', '#712F55'],
  micGlow: '#B05C8C',
  recording: '#B85A50',
  success: '#4E8A70',
  danger: '#A97B3F',
  border: '#2A2430',
  category: {
    mamada: '#C9679C',
    fralda: '#A97B3F',
    sono: '#5E97BE',
    remedio: '#4E8A70',
    outro: '#7A8290',
  },
};
