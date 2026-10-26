-- Ejecutar una vez en Supabase → SQL Editor.
-- Cada usuario autenticado solo puede consultar y guardar sus propias muestras.
create table if not exists public.metric_samples (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  metric text not null check (metric in ('heart_rate', 'rr_interval', 'battery')),
  value double precision not null,
  unit text not null,
  recorded_at timestamptz not null default now(),
  source text not null default 'bluefy-whoop4'
);

create index if not exists metric_samples_owner_time_idx
  on public.metric_samples (user_id, recorded_at desc);

alter table public.metric_samples enable row level security;

drop policy if exists "read own metric samples" on public.metric_samples;
create policy "read own metric samples" on public.metric_samples
  for select to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "insert own metric samples" on public.metric_samples;
create policy "insert own metric samples" on public.metric_samples
  for insert to authenticated with check ((select auth.uid()) = user_id);

grant select, insert on public.metric_samples to authenticated;
grant usage, select on sequence public.metric_samples_id_seq to authenticated;
