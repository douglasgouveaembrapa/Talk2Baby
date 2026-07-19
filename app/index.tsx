import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EventCard } from '@/components/EventCard';
import { MicButton } from '@/components/MicButton';
import { SoundWave } from '@/components/SoundWave';
import { useRecorder } from '@/hooks/useRecorder';
import { extractEvent, transcribeAudio } from '@/services/ai';
import { saveEvent } from '@/services/supabase';
import { useTheme } from '@/theme';
import { ExtractedEvent } from '@/types/events';

type Status = 'idle' | 'recording' | 'processing' | 'success' | 'error';

const STATUS_HINT: Record<Status, string> = {
  idle: 'Toque e fale',
  recording: 'Ouvindo… toque para concluir',
  processing: 'Entendendo…',
  success: 'Registrado com carinho',
  error: 'Não entendi. Tenta de novo?',
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function Home() {
  const { colors, type } = useTheme();
  const recorder = useRecorder();

  const [status, setStatus] = useState<Status>('idle');
  const [lastEvent, setLastEvent] = useState<{
    event: ExtractedEvent;
    rawText: string;
  } | null>(null);

  // Volta ao estado neutro alguns segundos após sucesso/erro
  useEffect(() => {
    if (status !== 'success' && status !== 'error') return;
    const t = setTimeout(() => {
      setStatus('idle');
      setLastEvent(null);
    }, 5000);
    return () => clearTimeout(t);
  }, [status]);

  const handleMicPress = useCallback(async () => {
    if (status === 'recording') {
      setStatus('processing');
      try {
        const uri = await recorder.stop();
        const text = await transcribeAudio(uri);
        const { minutes_ago, ...event } = await extractEvent(text);
        const occurredAt = minutes_ago
          ? new Date(Date.now() - minutes_ago * 60_000).toISOString()
          : undefined;
        await saveEvent({ ...event, raw_text: text, occurred_at: occurredAt });
        setLastEvent({ event, rawText: text });
        setStatus('success');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        setStatus('error');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    try {
      setLastEvent(null);
      await recorder.start();
      setStatus('recording');
    } catch {
      setStatus('error');
    }
  }, [status, recorder]);

  return (
    <SafeAreaView
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      {/* Cabeçalho — só o essencial */}
      <View style={styles.header}>
        <Text style={[type.overline, { color: colors.textMuted }]}>
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </Text>
        <Text style={[type.display, { color: colors.text }]}>{greeting()}</Text>
      </View>

      {/* Centro — o botão É a interface */}
      <View style={styles.center}>
        <View style={styles.waveSlot}>
          <SoundWave active={status === 'recording'} />
        </View>

        <MicButton
          recording={status === 'recording'}
          processing={status === 'processing'}
          onPress={handleMicPress}
        />

        <Animated.Text
          key={status}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(150)}
          style={[
            type.body,
            styles.hint,
            {
              color:
                status === 'error' ? colors.danger : colors.textMuted,
            },
          ]}
        >
          {STATUS_HINT[status]}
        </Animated.Text>

        <View style={styles.cardSlot}>
          {lastEvent && (
            <EventCard event={lastEvent.event} rawText={lastEvent.rawText} />
          )}
        </View>
      </View>

      {/* Rodapé — acesso discreto às telas secundárias */}
      <View style={styles.footer}>
        <FooterLink href="/history" icon="time-outline" label="Histórico" />
        <FooterLink href="/report" icon="stats-chart-outline" label="Relatório" />
      </View>
    </SafeAreaView>
  );
}

function FooterLink({
  href,
  icon,
  label,
}: {
  href: '/history' | '/report';
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const { colors, type } = useTheme();
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="link"
        style={({ pressed }) => [
          styles.footerLink,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Ionicons name={icon} size={18} color={colors.textMuted} />
        <Text style={[type.label, { color: colors.textMuted }]}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    gap: 6,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveSlot: {
    height: 40,
    justifyContent: 'center',
  },
  hint: {
    marginTop: 4,
    textAlign: 'center',
  },
  cardSlot: {
    minHeight: 96,
    width: '100%',
    marginTop: 24,
    justifyContent: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  footerLink: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
