create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  message text not null,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.invite_links (
  token text primary key,
  label text not null,
  created_at timestamptz not null default now(),
  used_at timestamptz
);

alter table public.testimonials enable row level security;
alter table public.invite_links enable row level security;
