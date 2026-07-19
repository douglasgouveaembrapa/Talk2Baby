-- Talk2Baby — schema do Supabase
-- Execute no SQL Editor do seu projeto.

create table if not exists public.baby_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Momento em que o evento aconteceu (pode ser retroativo: "há meia hora")
  occurred_at timestamptz not null default now(),
  category text not null check (category in ('mamada', 'fralda', 'sono', 'remedio', 'outro')),
  duration_min integer check (duration_min > 0),
  side text check (side in ('esquerdo', 'direito', 'ambos')),
  diaper_content text[] check (diaper_content <@ array['xixi', 'coco']),
  notes text,
  -- Transcrição original, preservada para auditoria/edição
  raw_text text not null
);

create index if not exists baby_events_occurred_at_idx
  on public.baby_events (occurred_at desc);

-- RLS: por enquanto app single-user; ao adicionar auth, trocar por
-- políticas baseadas em auth.uid() e coluna user_id.
alter table public.baby_events enable row level security;

create policy "anon full access (dev)"
  on public.baby_events for all
  using (true)
  with check (true);
