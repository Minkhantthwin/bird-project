-- ═══════════════════════════════════════════════════════════
-- attanDANCE — Complete Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- Or via CLI after login: npx supabase db push
-- ═══════════════════════════════════════════════════════════

-- 1. Roles
CREATE TABLE IF NOT EXISTS public.roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles (name);

-- 2. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id    UUID NOT NULL REFERENCES public.roles(id),
  email      TEXT UNIQUE NOT NULL,
  full_name  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON public.profiles (role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email   ON public.profiles (email);

-- 3. Artist Records
CREATE TABLE IF NOT EXISTS public.artist_records (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stage_name  TEXT,
  specialty   TEXT,
  join_date   DATE NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_artist_records_user_id ON public.artist_records (user_id);
CREATE INDEX IF NOT EXISTS idx_artist_records_instructor_id ON public.artist_records (instructor_id);

-- 4. Attendance
CREATE TABLE IF NOT EXISTS public.attendance (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_record_id  UUID NOT NULL REFERENCES public.artist_records(id) ON DELETE CASCADE,
  session_date      TIMESTAMPTZ NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_attendance_artist_record_id ON public.attendance (artist_record_id);
CREATE INDEX IF NOT EXISTS idx_attendance_session_date     ON public.attendance (session_date);

-- 5. Injuries
CREATE TABLE IF NOT EXISTS public.injuries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_record_id  UUID NOT NULL REFERENCES public.artist_records(id) ON DELETE CASCADE,
  incident_date     DATE NOT NULL,
  severity          TEXT NOT NULL CHECK (severity IN ('Minor', 'Moderate', 'Severe')),
  description       TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('Recovering', 'Cleared', 'Under Treatment')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_injuries_artist_record_id ON public.injuries (artist_record_id);
CREATE INDEX IF NOT EXISTS idx_injuries_status           ON public.injuries (status);

-- 6. Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_posts_user_id    ON public.posts (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts (created_at);

-- 7. Comments
CREATE TABLE IF NOT EXISTS public.comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments (post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments (user_id);

-- 8. Reactions
CREATE TABLE IF NOT EXISTS public.reactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id       UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('Like', 'Celebrate', 'Fire', 'Love', 'Insightful')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reactions_post_id ON public.reactions (post_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON public.reactions (user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reactions_unique_user_post ON public.reactions (user_id, post_id);

-- Seed: default roles
INSERT INTO public.roles (name, description)
VALUES
  ('Admin',      'Full access to all club management features and settings.'),
  ('Instructor', 'Can manage classes, attendance, and student progress.'),
  ('Member',     'Standard club member with access to social features.')
ON CONFLICT (name) DO NOTHING;
