-- Run in Supabase SQL editor
create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  amount_cents integer not null check (amount_cents > 0),
  name text,
  message text,
  created_at timestamptz not null default now()
);

create index if not exists donations_created_at_idx on public.donations (created_at desc);

-- Locked down: only the server (service role) reads/writes.
alter table public.donations enable row level security;

create or replace view public.donation_total as
  select coalesce(sum(amount_cents), 0)::bigint as total_cents
  from public.donations;
