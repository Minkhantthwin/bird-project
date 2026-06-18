-- Migration: RLS Policies + Auto-Profile Trigger
-- Enables Row Level Security on all public tables and creates a trigger
-- to automatically create a profiles row when a new auth user is created.

-- ══════════════════════════════════════════
-- Enable RLS on all tables
-- ══════════════════════════════════════════
ALTER TABLE public.roles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injuries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions       ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════
-- Roles: everyone can read
-- ══════════════════════════════════════════
CREATE POLICY "roles_read_all" ON public.roles
  FOR SELECT TO authenticated, anon
  USING (true);

-- ══════════════════════════════════════════
-- Profiles: read own, admins read all
-- ══════════════════════════════════════════
CREATE POLICY "profiles_read_own" ON public.profiles
  FOR SELECT TO authenticated
  USING ( (SELECT auth.uid()) = id );

CREATE POLICY "profiles_read_admin" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  );

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK ( (SELECT auth.uid()) = id );

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING ( (SELECT auth.uid()) = id )
  WITH CHECK ( (SELECT auth.uid()) = id );

-- ══════════════════════════════════════════
-- Artist Records: read all authenticated
-- ══════════════════════════════════════════
CREATE POLICY "artist_records_read_auth" ON public.artist_records
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "artist_records_insert_own" ON public.artist_records
  FOR INSERT TO authenticated
  WITH CHECK ( (SELECT auth.uid()) = user_id );

-- ══════════════════════════════════════════
-- Attendance: read all, instructors+admin manage
-- ══════════════════════════════════════════
CREATE POLICY "attendance_read_auth" ON public.attendance
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "attendance_manage_instructor_admin" ON public.attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name IN ('Admin', 'Instructor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name IN ('Admin', 'Instructor')
    )
  );

-- ══════════════════════════════════════════
-- Injuries: read all, instructors+admin manage
-- ══════════════════════════════════════════
CREATE POLICY "injuries_read_auth" ON public.injuries
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "injuries_manage_instructor_admin" ON public.injuries
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name IN ('Admin', 'Instructor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name IN ('Admin', 'Instructor')
    )
  );

-- ══════════════════════════════════════════
-- Posts: anyone authenticated can read
-- ══════════════════════════════════════════
CREATE POLICY "posts_read_auth" ON public.posts
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "posts_insert_auth" ON public.posts
  FOR INSERT TO authenticated
  WITH CHECK ( (SELECT auth.uid()) = user_id );

CREATE POLICY "posts_update_own" ON public.posts
  FOR UPDATE TO authenticated
  USING ( (SELECT auth.uid()) = user_id )
  WITH CHECK ( (SELECT auth.uid()) = user_id );

CREATE POLICY "posts_delete_own" ON public.posts
  FOR DELETE TO authenticated
  USING ( (SELECT auth.uid()) = user_id );

-- ══════════════════════════════════════════
-- Comments: anyone authenticated can read/create
-- ══════════════════════════════════════════
CREATE POLICY "comments_read_auth" ON public.comments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "comments_insert_auth" ON public.comments
  FOR INSERT TO authenticated
  WITH CHECK ( (SELECT auth.uid()) = user_id );

CREATE POLICY "comments_delete_own" ON public.comments
  FOR DELETE TO authenticated
  USING ( (SELECT auth.uid()) = user_id );

-- ══════════════════════════════════════════
-- Reactions: anyone authenticated can read/create/delete own
-- ══════════════════════════════════════════
CREATE POLICY "reactions_read_auth" ON public.reactions
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "reactions_insert_auth" ON public.reactions
  FOR INSERT TO authenticated
  WITH CHECK ( (SELECT auth.uid()) = user_id );

CREATE POLICY "reactions_delete_own" ON public.reactions
  FOR DELETE TO authenticated
  USING ( (SELECT auth.uid()) = user_id );

-- ══════════════════════════════════════════
-- Auto-Profile Trigger: creates a profiles row on auth.users insert
-- ══════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql
AS $$
DECLARE
  default_role_id UUID;
BEGIN
  -- Get the Member role ID (default for new users)
  SELECT id INTO default_role_id FROM public.roles WHERE name = 'Member';

  -- Insert profile row
  INSERT INTO public.profiles (id, role_id, email, full_name)
  VALUES (
    NEW.id,
    default_role_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
