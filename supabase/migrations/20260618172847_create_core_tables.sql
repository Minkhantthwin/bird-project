-- Migration: Core Tables (roles, profiles, artist_records)
-- Follows the attanDANCE ERD schema, adapted for Supabase best practices.
-- auth.users is managed by Supabase Auth — we create public.profiles to extend it.

-- ══════════════════════════════════════════
-- 1. Roles
-- ══════════════════════════════════════════
CREATE TABLE public.roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roles_name ON public.roles (name);

-- ══════════════════════════════════════════
-- 2. Profiles (extends auth.users)
-- ══════════════════════════════════════════
CREATE TABLE public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id    UUID NOT NULL REFERENCES public.roles(id),
  email      TEXT UNIQUE NOT NULL,
  full_name  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_profiles_role_id ON public.profiles (role_id);
CREATE INDEX idx_profiles_email   ON public.profiles (email);

-- ══════════════════════════════════════════
-- 3. Artist Records
-- ══════════════════════════════════════════
CREATE TABLE public.artist_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  stage_name  TEXT,
  specialty   TEXT,
  join_date   DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_artist_records_user_id ON public.artist_records (user_id);

-- ══════════════════════════════════════════
-- Seed: default roles
-- ══════════════════════════════════════════
INSERT INTO public.roles (name, description)
VALUES
  ('Admin',      'Full access to all club management features and settings.'),
  ('Instructor', 'Can manage classes, attendance, and student progress.'),
  ('Member',     'Standard club member with access to social features.');
