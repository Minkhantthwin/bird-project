-- Migration: Grant Data API access to public tables
-- Ensures the anon and authenticated roles can access tables via the REST API.
-- RLS policies control which rows each role can see.

GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT SELECT ON public.roles           TO anon, authenticated;
GRANT SELECT ON public.profiles        TO authenticated;
GRANT INSERT ON public.profiles        TO authenticated;
GRANT UPDATE ON public.profiles        TO authenticated;
GRANT SELECT ON public.artist_records  TO authenticated;
GRANT INSERT ON public.artist_records  TO authenticated;
GRANT SELECT ON public.attendance      TO authenticated;
GRANT INSERT ON public.attendance      TO authenticated;
GRANT UPDATE ON public.attendance      TO authenticated;
GRANT SELECT ON public.injuries        TO authenticated;
GRANT INSERT ON public.injuries        TO authenticated;
GRANT UPDATE ON public.injuries        TO authenticated;
GRANT SELECT ON public.posts           TO authenticated;
GRANT INSERT ON public.posts           TO authenticated;
GRANT UPDATE ON public.posts           TO authenticated;
GRANT DELETE ON public.posts           TO authenticated;
GRANT SELECT ON public.comments        TO authenticated;
GRANT INSERT ON public.comments        TO authenticated;
GRANT DELETE ON public.comments        TO authenticated;
GRANT SELECT ON public.reactions       TO authenticated;
GRANT INSERT ON public.reactions       TO authenticated;
GRANT DELETE ON public.reactions       TO authenticated;
