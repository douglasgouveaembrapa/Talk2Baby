import { TextStyle } from 'react-native';

/**
 * Escala tipográfica única do app. Fonte do sistema com pesos e
 * letter-spacing calibrados — evita dependência de assets de fonte
 * e mantém render nativo em Android/iOS.
 */
export const type = {
  display: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 38,
  } as TextStyle,
  title: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.3,
    lineHeight: 28,
  } as TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 23,
  } as TextStyle,
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
    lineHeight: 18,
  } as TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.1,
    lineHeight: 17,
  } as TextStyle,
  overline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    lineHeight: 14,
  } as TextStyle,
};
