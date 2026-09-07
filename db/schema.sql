-- M2H schema. Safe to run repeatedly.

create table if not exists users (
  id          uuid primary key default gen_random_uuid(),
  google_sub  text not null unique,
  email       text not null,
  name        text,
  picture     text,
  created_at  timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references users (id) on delete cascade,
  name        text not null,
  size        integer not null,
  markdown    text not null,
  stats       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists documents_user_created_idx
  on documents (user_id, created_at desc);
