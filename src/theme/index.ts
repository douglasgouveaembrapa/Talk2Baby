import { useColorScheme } from 'react-native';
import { dark, light, Palette } from './colors';
import { type } from './typography';

export interface Theme {
  colors: Palette;
  type: typeof type;
  isDark: boolean;
}

/** Tema reativo ao modo do sistema (dark mode automático, essencial de madrugada). */
export function useTheme(): Theme {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  return { colors: isDark ? dark : light, type, isDark };
}

export { dark, light } from './colors';
export { type } from './typography';
