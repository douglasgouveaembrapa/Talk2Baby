import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

/**
 * Histórico editável (timeline) — próxima etapa.
 * Vai listar listRecentEvents() com edição inline por registro.
 */
export default function History() {
  const { colors, type } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
        <Text style={[type.title, { color: colors.text }]}>Histórico</Text>
      </View>
      <View style={styles.empty}>
        <Text style={[type.body, { color: colors.textMuted }]}>
          Timeline editável — em construção
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
