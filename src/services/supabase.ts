import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { BabyEvent, ExtractedEvent } from '@/types/events';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function saveEvent(
  event: ExtractedEvent & { raw_text: string; occurred_at?: string },
): Promise<BabyEvent> {
  const { data, error } = await supabase
    .from('baby_events')
    .insert({
      category: event.category,
      duration_min: event.duration_min,
      side: event.side,
      diaper_content: event.diaper_content,
      notes: event.notes,
      raw_text: event.raw_text,
      occurred_at: event.occurred_at ?? new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as BabyEvent;
}

export async function listRecentEvents(limit = 50): Promise<BabyEvent[]> {
  const { data, error } = await supabase
    .from('baby_events')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as BabyEvent[];
}

export async function updateEvent(
  id: string,
  patch: Partial<ExtractedEvent & { occurred_at: string }>,
): Promise<void> {
  const { error } = await supabase.from('baby_events').update(patch).eq('id', id);
  if (error) throw error;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from('baby_events').delete().eq('id', id);
  if (error) throw error;
}
