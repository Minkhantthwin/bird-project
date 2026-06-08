/**
 * Type definitions for the attanDANCE data model.
 * Mirrors the ERD schema defined in docs/attanDANCE_ERD_Schema.md.
 */

// ── Roles ──────────────────────────────────────────────
export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

// ── Users ──────────────────────────────────────────────
export interface User {
  id: string;
  role_id: string;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
}

// ── Artists Records ────────────────────────────────────
export interface ArtistRecord {
  id: string;
  user_id: string;
  stage_name: string | null;
  specialty: string | null;
  join_date: string;
  created_at: string;
}

// ── Attendance ─────────────────────────────────────────
export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface Attendance {
  id: string;
  artist_record_id: string;
  session_date: string;
  status: AttendanceStatus;
  notes: string | null;
}

// ── Injuries ───────────────────────────────────────────
export type InjurySeverity = 'Minor' | 'Moderate' | 'Severe';
export type InjuryStatus = 'Recovering' | 'Cleared' | 'Under Treatment';

export interface Injury {
  id: string;
  artist_record_id: string;
  incident_date: string;
  severity: InjurySeverity;
  description: string;
  status: InjuryStatus;
}

// ── Posts ──────────────────────────────────────────────
export interface Post {
  id: string;
  user_id: string;
  title: string;
  body: string;
  created_at: string;
}

// ── Comments ───────────────────────────────────────────
export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

// ── Reactions ──────────────────────────────────────────
export type ReactionType = 'Like' | 'Celebrate' | 'Fire' | 'Love' | 'Insightful';

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}
