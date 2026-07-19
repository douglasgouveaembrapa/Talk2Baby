import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useTheme } from '@/theme';
import { CATEGORY_META, ExtractedEvent } from '@/types/events';

interface Props {
  event: ExtractedEvent;
  rawText: string;
}

/** Resumo humano do evento ("10 min · peito esquerdo"). */
function summarize(event: ExtractedEvent): string {
  const parts: string[] = [];
  if (event.duration_min) parts.push(`${event.duration_min} min`);
  if (event.side) parts.push(`peito ${event.side}`);
  if (event.diaper_content?.length) parts.push(event.diaper_content.join(' + '));
  if (event.notes) parts.push(event.notes);
  return parts.join(' · ') || 'Registrado';
}

/** Card de confirmação exibido após a IA estruturar a fala. */
export function EventCard({ event, rawText }: Props) {
  const { colors, type } = useTheme();
  const meta = CATEGORY_META[event.category];

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutDown.duration(200)}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.badge,
          { backgroundColor: colors.category[event.category] + '26' },
        ]}
      >
        <MaterialCommunityIcons
          name={meta.icon}
          size={26}
          color={colors.category[event.category]}
        />
      </View>
      <View style={styles.info}>
        <Text style={[type.label, { color: colors.text }]}>{meta.label}</Text>
        <Text style={[type.caption, { color: colors.textMuted }]} numberOfLines={2}>
          {summarize(event)}
        </Text>
        <Text
          style={[type.caption, styles.quote, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          “{rawText}”
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  quote: { fontStyle: 'italic', marginTop: 2 },
});
