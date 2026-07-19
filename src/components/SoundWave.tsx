import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

const BAR_COUNT = 7;
const MAX_HEIGHT = 34;
const MIN_HEIGHT = 6;

/** Uma barra da onda, oscilando com duração própria para parecer orgânica. */
function Bar({ index, active, color }: { index: number; active: boolean; color: string }) {
  const h = useSharedValue(MIN_HEIGHT);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (active && reducedMotion) {
      // Sem oscilação: barras estáticas em meia altura sinalizam a escuta
      h.value = withTiming(MAX_HEIGHT / 2, { duration: 200 });
      return;
    }
    if (active) {
      // Durações dessincronizadas por barra criam o efeito de voz real
      const duration = 260 + ((index * 97) % 180);
      const peak =
        MIN_HEIGHT + (MAX_HEIGHT - MIN_HEIGHT) * (0.55 + 0.45 * Math.sin(index * 1.7));
      h.value = withRepeat(
        withSequence(
          withTiming(peak, { duration, easing: Easing.inOut(Easing.quad) }),
          withTiming(MIN_HEIGHT + 4, { duration, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
      );
    } else {
      h.value = withTiming(MIN_HEIGHT, { duration: 250 });
    }
  }, [active, index, reducedMotion, h]);

  const style = useAnimatedStyle(() => ({ height: h.value }));

  return <Animated.View style={[styles.bar, { backgroundColor: color }, style]} />;
}

/** Ondas sonoras exibidas enquanto o app escuta o usuário. */
export function SoundWave({ active }: { active: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row} accessibilityElementsHidden>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <Bar key={i} index={i} active={active} color={colors.recording} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: MAX_HEIGHT,
  },
  bar: {
    width: 4,
    borderRadius: 2,
  },
});
