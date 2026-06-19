-- Migration: Add instructor ownership to artist records and scope RLS

ALTER TABLE public.artist_records
  ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_artist_records_instructor_id
  ON public.artist_records (instructor_id);

DROP POLICY IF EXISTS "artist_records_read_auth" ON public.artist_records;
DROP POLICY IF EXISTS "artist_records_insert_own" ON public.artist_records;
DROP POLICY IF EXISTS "attendance_read_auth" ON public.attendance;
DROP POLICY IF EXISTS "attendance_manage_instructor_admin" ON public.attendance;
DROP POLICY IF EXISTS "injuries_read_auth" ON public.injuries;
DROP POLICY IF EXISTS "injuries_manage_instructor_admin" ON public.injuries;

CREATE POLICY "artist_records_read_admin" ON public.artist_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  );

CREATE POLICY "artist_records_read_instructor_assigned" ON public.artist_records
  FOR SELECT TO authenticated
  USING (
    instructor_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Instructor'
    )
  );

CREATE POLICY "artist_records_read_member_own" ON public.artist_records
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "artist_records_manage_admin" ON public.artist_records
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  );

CREATE POLICY "artist_records_manage_instructor_assigned" ON public.artist_records
  FOR ALL TO authenticated
  USING (
    instructor_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Instructor'
    )
  )
  WITH CHECK (
    instructor_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Instructor'
    )
  );

CREATE POLICY "attendance_read_admin" ON public.attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  );

CREATE POLICY "attendance_read_instructor_assigned" ON public.attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      JOIN public.roles r ON r.id = p.role_id
      WHERE ar.id = attendance.artist_record_id
        AND ar.instructor_id = (SELECT auth.uid())
        AND r.name = 'Instructor'
    )
  );

CREATE POLICY "attendance_read_member_own" ON public.attendance
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      WHERE ar.id = attendance.artist_record_id
        AND ar.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "attendance_manage_admin" ON public.attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  );

CREATE POLICY "attendance_manage_instructor_assigned" ON public.attendance
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      JOIN public.roles r ON r.id = p.role_id
      WHERE ar.id = attendance.artist_record_id
        AND ar.instructor_id = (SELECT auth.uid())
        AND r.name = 'Instructor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      JOIN public.roles r ON r.id = p.role_id
      WHERE ar.id = attendance.artist_record_id
        AND ar.instructor_id = (SELECT auth.uid())
        AND r.name = 'Instructor'
    )
  );

CREATE POLICY "injuries_read_admin" ON public.injuries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  );

CREATE POLICY "injuries_read_instructor_assigned" ON public.injuries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      JOIN public.roles r ON r.id = p.role_id
      WHERE ar.id = injuries.artist_record_id
        AND ar.instructor_id = (SELECT auth.uid())
        AND r.name = 'Instructor'
    )
  );

CREATE POLICY "injuries_read_member_own" ON public.injuries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      WHERE ar.id = injuries.artist_record_id
        AND ar.user_id = (SELECT auth.uid())
    )
  );

CREATE POLICY "injuries_manage_admin" ON public.injuries
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      JOIN public.roles r ON r.id = p.role_id
      WHERE p.id = (SELECT auth.uid()) AND r.name = 'Admin'
    )
  );

CREATE POLICY "injuries_manage_instructor_assigned" ON public.injuries
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      JOIN public.roles r ON r.id = p.role_id
      WHERE ar.id = injuries.artist_record_id
        AND ar.instructor_id = (SELECT auth.uid())
        AND r.name = 'Instructor'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.artist_records ar
      JOIN public.profiles p ON p.id = (SELECT auth.uid())
      JOIN public.roles r ON r.id = p.role_id
      WHERE ar.id = injuries.artist_record_id
        AND ar.instructor_id = (SELECT auth.uid())
        AND r.name = 'Instructor'
    )
  );
