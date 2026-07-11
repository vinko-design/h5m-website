create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  consent_given boolean not null default false,
  source text default 'homepage',
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint waitlist_signups_email_unique unique (email)
);

alter table public.waitlist_signups enable row level security;

create policy "No public access"
  on public.waitlist_signups
  for all
  using (false);
