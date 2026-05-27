-- ================================================================
-- FindIt — Lost & Found Reporting System
-- Supabase Schema (PostgreSQL)
-- Run this entire file in your Supabase SQL Editor
-- ================================================================

-- ── USERS TABLE ──────────────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  username    text not null,
  rollno      text not null unique,
  email       text not null unique,
  password    text not null,
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz default now()
);

-- ── ITEMS TABLE ───────────────────────────────────────────────────
create table if not exists public.items (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.users(id) on delete cascade,
  itemname         text not null,
  itemdescription  text not null,
  concerntype      text check (concerntype in ('lost', 'found')),
  category         text default 'Other',
  location         text default '',
  status           text default 'pending'
                   check (status in ('pending','approved','matched','rejected','returned')),
  images           text[] default '{}',
  created_at       timestamptz default now()
);

-- ── CLAIMANTS TABLE ───────────────────────────────────────────────
create table if not exists public.claimants (
  id            uuid primary key default gen_random_uuid(),
  claimantname  text not null,
  mobilenumber  text not null,
  hostelname    text not null,
  proofofclaim  text not null,
  itemdetails   text,
  created_at    timestamptz default now()
);

-- ── HELPERS TABLE ─────────────────────────────────────────────────
create table if not exists public.helpers (
  id            uuid primary key default gen_random_uuid(),
  helpername    text not null,
  mobilenumber  text not null,
  hostelname    text not null,
  itemdetails   text,
  created_at    timestamptz default now()
);

-- ================================================================
-- ROW LEVEL SECURITY
-- We use the service role key on the backend, so RLS is optional.
-- Disable it so the Express server can read/write freely.
-- ================================================================
alter table public.users     disable row level security;
alter table public.items     disable row level security;
alter table public.claimants disable row level security;
alter table public.helpers   disable row level security;

-- ================================================================
-- DONE! 
-- To make a user admin, run:
-- update public.users set role = 'admin' where email = 'your@email.com';
-- ================================================================
