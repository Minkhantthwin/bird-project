-- Avoid querying public.profiles from a policy on public.profiles. PostgreSQL
-- otherwise recursively evaluates the same policy and rejects every profile
-- lookup with error 42P17.
CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;

CREATE OR REPLACE FUNCTION private.is_current_user_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT (SELECT auth.uid()) IS NOT NULL
    AND EXISTS (
      SELECT 1
      FROM public.profiles AS profile
      JOIN public.roles AS role ON role.id = profile.role_id
      WHERE profile.id = (SELECT auth.uid())
        AND role.name = 'Admin'
    );
$$;

REVOKE ALL ON FUNCTION private.is_current_user_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_current_user_admin() TO authenticated;

-- Trigger functions do not need to be callable through the Data API.
REVOKE EXECUTE ON FUNCTION public.handle_new_user()
  FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_authorized" ON public.profiles;

-- One policy avoids both recursive evaluation and the overhead of multiple
-- permissive SELECT policies for the same role/action.
CREATE POLICY "profiles_read_authorized" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    (SELECT auth.uid()) = id
    OR (SELECT private.is_current_user_admin())
  );
