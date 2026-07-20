import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { BabyEvent, ExtractedEvent } from '@/types/events';

// Credenciais do projeto (app de uso pessoal — a anon key é pública por
// design e o acesso real é controlado pela RLS no Supabase).
// Um .env com EXPO_PUBLIC_SUPABASE_* sobrescreve estes padrões.
const DEFAULT_URL = 'https://dlnmjjoqygrvtnceljzz.supabase.co';
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsbm1qam9xeWdydnRuY2Vsanp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0OTYzNzQsImV4cCI6MjEwMDA3MjM3NH0.MPMzTZgSUwOD7hPWp9vA4UkvE4Da7Puk3atzC1giNH8';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL ?? DEFAULT_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? DEFAULT_ANON_KEY;

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
