-- Allow authenticated users to change only their own reaction.
-- SELECT already exists and is required for PostgreSQL RLS updates.

GRANT UPDATE ON public.reactions TO authenticated;

CREATE POLICY "reactions_update_own" ON public.reactions
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
