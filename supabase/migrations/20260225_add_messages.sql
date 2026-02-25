-- Create messages table for per-niche WhatsApp templates
-- Safe migration: does not drop or reset existing data

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  niche text not null,
  text text not null default '',
  createdAt timestamptz not null default now(),
  updatedAt timestamptz not null default now()
);

-- Ensure one row per niche
create unique index if not exists messages_niche_unique on public.messages (niche);

-- Row Level Security off by default for anon REST use; adjust to your security model
alter table public.messages enable row level security;

-- Allow anonymous read/write only if that's your current model (matches anon key usage)
-- Replace with stricter policies as needed
drop policy if exists messages_read_anon on public.messages;
create policy messages_read_anon
  on public.messages
  for select
  to anon
  using (true);

drop policy if exists messages_insert_anon on public.messages;
create policy messages_insert_anon
  on public.messages
  for insert
  to anon
  with check (true);

drop policy if exists messages_update_anon on public.messages;
create policy messages_update_anon
  on public.messages
  for update
  to anon
  using (true)
  with check (true);
