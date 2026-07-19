import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme';

const BUTTON_SIZE = 148;

interface Props {
  /** true enquanto o app está ouvindo */
  recording: boolean;
  /** true enquanto transcreve/extrai (botão fica desabilitado) */
  processing: boolean;
  onPress: () => void;
}

/**
 * Botão de voz — peça central do app.
 *
 * Estados visuais:
 * - idle: respiração lenta (scale sutil) + glow suave, convidando ao toque
 * - recording: dois anéis concêntricos pulsando para fora + tom avermelhado
 * - processing: encolhe levemente e reduz opacidade
 */
export function MicButton({ recording, processing, onPress }: Props) {
  const { colors } = useTheme();

  const breath = useSharedValue(0); // respiração em idle
  const pulse = useSharedValue(0); // anéis em recording
  const pressed = useSharedValue(0); // feedback de toque
  const mode = useSharedValue(0); // 0 = idle, 1 = recording

  useEffect(() => {
    mode.value = withTiming(recording ? 1 : 0, { duration: 400 });
    if (recording) {
      breath.value = withTiming(0, { duration: 200 });
      pulse.value = 0;
      pulse.value = withRepeat(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
        -1,
      );
    } else {
      pulse.value = withTiming(0, { duration: 300 });
      breath.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      );
    }
  }, [recording, breath, pulse, mode]);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale:
          1 +
          breath.value * 0.03 + // respiração idle
          pressed.value * -0.06 + // afunda ao pressionar
          (processing ? -0.08 : 0),
      },
    ],
    opacity: withTiming(processing ? 0.55 : 1, { duration: 250 }),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + breath.value * 0.25,
    transform: [{ scale: 1.15 + breath.value * 0.1 }],
    backgroundColor: interpolateColor(
      mode.value,
      [0, 1],
      [colors.micGlow, colors.recording],
    ),
  }));

  // Dois anéis defasados que expandem e somem enquanto grava
  const ring1 = useAnimatedStyle(() => {
    const t = pulse.value;
    return {
      opacity: mode.value * (1 - t) * 0.4,
      transform: [{ scale: 1 + t * 0.9 }],
      borderColor: colors.recording,
    };
  });
  const ring2 = useAnimatedStyle(() => {
    const t = (pulse.value + 0.5) % 1;
    return {
      opacity: mode.value * (1 - t) * 0.4,
      transform: [{ scale: 1 + t * 0.9 }],
      borderColor: colors.recording,
    };
  });

  const handlePress = () => {
    if (processing) return;
    Haptics.impactAsync(
      recording
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Heavy,
    );
    onPress();
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ring, ring1]} />
      <Animated.View style={[styles.ring, ring2]} />
      <Animated.View style={[styles.glow, glowStyle]} />
      <Animated.View style={buttonStyle}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            recording ? 'Parar gravação' : 'Falar para registrar'
          }
          onPressIn={() => (pressed.value = withSpring(1, { damping: 15 }))}
          onPressOut={() => (pressed.value = withSpring(0, { damping: 15 }))}
          onPress={handlePress}
          disabled={processing}
        >
          <LinearGradient
            colors={recording ? [colors.recording, '#A84E47'] : colors.micGradient}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={styles.button}
          >
            <Ionicons
              name={recording ? 'stop' : 'mic'}
              size={52}
              color="rgba(255,255,255,0.95)"
            />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: BUTTON_SIZE * 2,
    height: BUTTON_SIZE * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    // No Android o "glow" vem do próprio bg translúcido + escala animada
    opacity: 0.4,
  },
  ring: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
  },
});
