/**
 * Design system — Talk2Baby
 *
 * Paleta pensada para pais com sono: tons quentes e dessaturados no claro,
 * e um dark mode de luminância realmente baixa (uso às 3h da manhã sem
 * acordar o bebê — nada de branco puro nem azuis frios estourados).
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
  /** Cor de marca — lilás acolhedor */
  primary: string;
  /** Variante suave do primary para fundos/glow */
  primarySoft: string;
  /** Gradiente do botão de voz */
  micGradient: [string, string];
  /** Glow pulsante ao redor do botão */
  micGlow: string;
  /** Vermelho suave do estado gravando */
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
  background: '#FAF7F4',
  surface: '#FFFFFF',
  surfaceHigh: '#F3EEF9',
  text: '#2B2733',
  textMuted: '#8A8494',
  primary: '#8B7BD8',
  primarySoft: '#EDE8FA',
  micGradient: ['#A392E8', '#7C6BD0'],
  micGlow: '#8B7BD8',
  recording: '#E8837B',
  success: '#7BBFA0',
  danger: '#D9A05B',
  border: '#ECE7E2',
  category: {
    mamada: '#E8A0B4',
    fralda: '#E9C46A',
    sono: '#8B7BD8',
    remedio: '#7BBFA0',
    outro: '#9AA5B1',
  },
};

export const dark: Palette = {
  background: '#0F0E13',
  surface: '#17151E',
  surfaceHigh: '#1F1C2A',
  text: '#E6E1EC',
  textMuted: '#7D7789',
  primary: '#9D8CE0',
  primarySoft: '#241F33',
  micGradient: ['#6E5DBE', '#4D3F96'],
  micGlow: '#7C6BD0',
  recording: '#C96A62',
  success: '#5E9C80',
  danger: '#B98847',
  border: '#26232F',
  category: {
    mamada: '#C4798E',
    fralda: '#C0993F',
    sono: '#9D8CE0',
    remedio: '#5E9C80',
    outro: '#6E7885',
  },
};
