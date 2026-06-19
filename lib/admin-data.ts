import 'server-only';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import type {
  AttendanceStatus,
  InjurySeverity,
  InjuryStatus,
} from '@/lib/types';
import type { UserRole } from '@/lib/auth/types';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role_name: UserRole | 'Unknown';
  created_at: string;
}

export interface AdminArtist {
  id: string;
  full_name: string;
  stage_name: string | null;
  specialty: string | null;
  join_date: string;
}

export interface AdminAttendance {
  id: string;
  artist_name: string;
  session_date: string;
  status: AttendanceStatus;
  notes: string | null;
}

export interface AdminInjury {
  id: string;
  artist_name: string;
  incident_date: string;
  severity: InjurySeverity;
  description: string;
  status: InjuryStatus;
}

export interface AdminPost {
  id: string;
  author_name: string;
  title: string;
  body: string;
  created_at: string;
}

function queryError(resource: string, error: { message: string; code?: string }) {
  return new Error(`Unable to load ${resource}: ${error.message}`, {
    cause: error,
  });
}

function one<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? (relation[0] ?? null) : relation;
}

async function getAdminClient() {
  return createClient(await cookies());
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at, roles(name)')
    .order('created_at', { ascending: false });

  if (error) throw queryError('users', error);

  return (data ?? []).map((profile) => ({
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role_name:
      (one(profile.roles)?.name as UserRole | undefined) ?? 'Unknown',
    created_at: profile.created_at,
  }));
}

export async function getAdminArtists(): Promise<AdminArtist[]> {
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('artist_records')
    .select('id, stage_name, specialty, join_date, profiles(full_name)')
    .order('join_date', { ascending: false });

  if (error) throw queryError('artist records', error);

  return (data ?? []).map((artist) => ({
    id: artist.id,
    full_name: one(artist.profiles)?.full_name ?? 'Unknown',
    stage_name: artist.stage_name,
    specialty: artist.specialty,
    join_date: artist.join_date,
  }));
}

export async function getAdminAttendance(
  limit?: number,
): Promise<AdminAttendance[]> {
  const supabase = await getAdminClient();
  let query = supabase
    .from('attendance')
    .select(
      'id, session_date, status, notes, artist_records(profiles(full_name))',
    )
    .order('session_date', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw queryError('attendance', error);

  return (data ?? []).map((record) => ({
    id: record.id,
    artist_name:
      one(one(record.artist_records)?.profiles)?.full_name ?? 'Unknown',
    session_date: record.session_date,
    status: record.status as AttendanceStatus,
    notes: record.notes,
  }));
}

export async function getAdminInjuries(
  limit?: number,
): Promise<AdminInjury[]> {
  const supabase = await getAdminClient();
  let query = supabase
    .from('injuries')
    .select(
      'id, incident_date, severity, description, status, artist_records(profiles(full_name))',
    )
    .order('incident_date', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw queryError('injuries', error);

  return (data ?? []).map((injury) => ({
    id: injury.id,
    artist_name:
      one(one(injury.artist_records)?.profiles)?.full_name ?? 'Unknown',
    incident_date: injury.incident_date,
    severity: injury.severity as InjurySeverity,
    description: injury.description,
    status: injury.status as InjuryStatus,
  }));
}

export async function getAdminPosts(): Promise<AdminPost[]> {
  const supabase = await getAdminClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, body, created_at, profiles(full_name)')
    .order('created_at', { ascending: false });

  if (error) throw queryError('posts', error);

  return (data ?? []).map((post) => ({
    id: post.id,
    author_name: one(post.profiles)?.full_name ?? 'Unknown',
    title: post.title,
    body: post.body,
    created_at: post.created_at,
  }));
}

async function getCount(
  table: 'profiles' | 'artist_records' | 'posts' | 'injuries',
  activeInjuriesOnly = false,
) {
  const supabase = await getAdminClient();
  let query = supabase.from(table).select('*', { count: 'exact', head: true });

  if (activeInjuriesOnly) {
    query = query.in('status', ['Recovering', 'Under Treatment']);
  }

  const { count, error } = await query;
  if (error) throw queryError(`${table} count`, error);
  return count ?? 0;
}

export async function getAdminDashboardData() {
  const [
    totalUsers,
    totalArtists,
    totalPosts,
    activeInjuries,
    recentAttendance,
    recentInjuries,
  ] = await Promise.all([
    getCount('profiles'),
    getCount('artist_records'),
    getCount('posts'),
    getCount('injuries', true),
    getAdminAttendance(5),
    getAdminInjuries(5),
  ]);

  return {
    totalUsers,
    totalArtists,
    totalPosts,
    activeInjuries,
    recentAttendance,
    recentInjuries,
  };
}
