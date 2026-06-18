-- Migration: Tracking Tables (attendance, injuries)

-- ══════════════════════════════════════════
-- 1. Attendance
-- ══════════════════════════════════════════
CREATE TABLE public.attendance (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_record_id  UUID NOT NULL REFERENCES public.artist_records(id) ON DELETE CASCADE,
  session_date      TIMESTAMPTZ NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendance_artist_record_id ON public.attendance (artist_record_id);
CREATE INDEX idx_attendance_session_date     ON public.attendance (session_date);

-- ══════════════════════════════════════════
-- 2. Injuries
-- ══════════════════════════════════════════
CREATE TABLE public.injuries (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_record_id  UUID NOT NULL REFERENCES public.artist_records(id) ON DELETE CASCADE,
  incident_date     DATE NOT NULL,
  severity          TEXT NOT NULL CHECK (severity IN ('Minor', 'Moderate', 'Severe')),
  description       TEXT NOT NULL,
  status            TEXT NOT NULL CHECK (status IN ('Recovering', 'Cleared', 'Under Treatment')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_injuries_artist_record_id ON public.injuries (artist_record_id);
CREATE INDEX idx_injuries_status           ON public.injuries (status);
