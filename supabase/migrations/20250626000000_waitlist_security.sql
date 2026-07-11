-- Rate-limit event log (service role only; RLS deny-all)
create table public.waitlist_rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  created_at timestamptz not null default now()
);

create index waitlist_rate_limit_events_bucket_created_at_idx
  on public.waitlist_rate_limit_events (bucket, created_at desc);

alter table public.waitlist_rate_limit_events enable row level security;

create policy "No public access"
  on public.waitlist_rate_limit_events
  for all
  using (false);

-- Opt-out tracking for launch update emails
alter table public.waitlist_signups
  add column if not exists unsubscribed_at timestamptz;
