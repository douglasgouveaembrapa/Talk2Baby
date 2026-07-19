import { TextStyle } from 'react-native';

/**
 * Escala tipográfica — pairing "Wellness Calm" da skill UI/UX Pro Max:
 * Lora (serif orgânica) para títulos + Raleway (sans elegante) para corpo.
 * Cada peso usa o arquivo de fonte específico (custom fonts no Android
 * ignoram fontWeight — o peso vem do próprio arquivo).
 */
export const fonts = {
  heading: 'Lora_600SemiBold',
  headingBold: 'Lora_700Bold',
  body: 'Raleway_400Regular',
  bodyMedium: 'Raleway_500Medium',
  bodySemiBold: 'Raleway_600SemiBold',
};

export const type = {
  display: {
    fontFamily: fonts.headingBold,
    fontSize: 32,
    letterSpacing: -0.5,
    lineHeight: 40,
  } as TextStyle,
  title: {
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: -0.3,
    lineHeight: 28,
  } as TextStyle,
  body: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 23,
  } as TextStyle,
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    letterSpacing: 0.2,
    lineHeight: 18,
  } as TextStyle,
  caption: {
    fontFamily: fonts.body,
    fontSize: 13,
    letterSpacing: 0.1,
    lineHeight: 17,
  } as TextStyle,
  overline: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    lineHeight: 14,
  } as TextStyle,
};
