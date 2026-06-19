import 'server-only';

import { cookies } from 'next/headers';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import type {
  AdminArtist,
  AdminAttendance,
  AdminInjury,
  AdminPost,
  AdminUser,
} from '@/lib/admin-data';
import type { UserRole } from '@/lib/auth/types';

function queryError(resource: string, error: { message: string }) {
  return new Error(`Unable to load ${resource}: ${error.message}`, {
    cause: error,
  });
}

function one<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? (relation[0] ?? null) : relation;
}

async function getInstructorContext() {
  const supabase = createClient(await cookies());
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('You must be signed in as an instructor.');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, roles(name)')
    .eq('id', user.id)
    .single();

  const relation = profile?.roles as unknown as
    | { name: UserRole }
    | { name: UserRole }[]
    | null;
  const role = Array.isArray(relation) ? relation[0]?.name : relation?.name;

  if (profileError || role !== 'Instructor') {
    throw new Error('You must be signed in as an instructor.');
  }

  return {
    supabase,
    user,
    fullName: profile.full_name,
  };
}

export async function getInstructorArtists(): Promise<AdminArtist[]> {
  const { user } = await getInstructorContext();

  const { data, error } = await createAdminClient()
    .from('artist_records')
    .select('id, user_id, instructor_id, stage_name, specialty, join_date')
    .eq('instructor_id', user.id)
    .order('join_date', { ascending: false });

  if (error) throw queryError('artists', error);

  const userIds = Array.from(new Set((data ?? []).map((artist) => artist.user_id)));
  const { data: profiles, error: profilesError } = userIds.length
    ? await createAdminClient()
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds)
    : { data: [], error: null };

  if (profilesError) throw queryError('artist profiles', profilesError);

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name]),
  );

  return (data ?? []).map((artist) => ({
    id: artist.id,
    user_id: artist.user_id,
    instructor_id: artist.instructor_id,
    full_name: profileMap.get(artist.user_id) ?? 'Unknown',
    instructor_name: null,
    stage_name: artist.stage_name,
    specialty: artist.specialty,
    join_date: artist.join_date,
  }));
}

export async function getInstructorArtistUsers(): Promise<AdminUser[]> {
  await getInstructorContext();

  const { data, error } = await createAdminClient()
    .from('profiles')
    .select('id, email, full_name, created_at, roles(name)')
    .order('full_name', { ascending: true });

  if (error) throw queryError('artist users', error);

  return (data ?? [])
    .map((profile) => ({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      role_name:
        ((one(profile.roles)?.name as UserRole | undefined) ?? 'Unknown') as
          | UserRole
          | 'Unknown',
      created_at: profile.created_at,
    }))
    .filter((user) => user.role_name === 'Member');
}

export async function getInstructorAttendance(
  limit?: number,
): Promise<AdminAttendance[]> {
  await getInstructorContext();
  const artists = await getInstructorArtists();
  const artistIds = artists.map((artist) => artist.id);

  if (artistIds.length === 0) return [];

  let query = createAdminClient()
    .from('attendance')
    .select('id, artist_record_id, session_date, status, notes')
    .in('artist_record_id', artistIds)
    .order('session_date', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw queryError('attendance', error);

  const artistMap = new Map(artists.map((artist) => [artist.id, artist.full_name]));

  return (data ?? []).map((record) => ({
    id: record.id,
    artist_record_id: record.artist_record_id,
    artist_name: artistMap.get(record.artist_record_id) ?? 'Unknown',
    session_date: record.session_date,
    status: record.status,
    notes: record.notes,
  }));
}

export async function getInstructorInjuries(
  limit?: number,
): Promise<AdminInjury[]> {
  const artists = await getInstructorArtists();
  const artistIds = artists.map((artist) => artist.id);

  if (artistIds.length === 0) return [];

  let query = createAdminClient()
    .from('injuries')
    .select('id, artist_record_id, incident_date, severity, description, status')
    .in('artist_record_id', artistIds)
    .order('incident_date', { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw queryError('injuries', error);

  const artistMap = new Map(artists.map((artist) => [artist.id, artist.full_name]));

  return (data ?? []).map((injury) => ({
    id: injury.id,
    artist_record_id: injury.artist_record_id,
    artist_name: artistMap.get(injury.artist_record_id) ?? 'Unknown',
    incident_date: injury.incident_date,
    severity: injury.severity,
    description: injury.description,
    status: injury.status,
  }));
}

export async function getInstructorPosts(): Promise<AdminPost[]> {
  const { supabase, user, fullName } = await getInstructorContext();

  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id, title, body, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw queryError('posts', error);

  return (data ?? []).map((post) => ({
    id: post.id,
    user_id: post.user_id,
    author_name: fullName,
    title: post.title,
    body: post.body,
    created_at: post.created_at,
  }));
}

export async function getAllInstructorPosts(): Promise<AdminPost[]> {
  await getInstructorContext();

  const { data, error } = await createAdminClient()
    .from('posts')
    .select('id, user_id, title, body, created_at, profiles(full_name)')
    .order('created_at', { ascending: false });

  if (error) throw queryError('all posts', error);

  return (data ?? []).map((post) => ({
    id: post.id,
    user_id: post.user_id,
    author_name: one(post.profiles)?.full_name ?? 'Unknown',
    title: post.title,
    body: post.body,
    created_at: post.created_at,
  }));
}

async function getCount(
  table: 'artist_records' | 'posts',
  userId: string,
) {
  let query = createAdminClient()
    .from(table)
    .select('*', { count: 'exact', head: true });

  if (table === 'posts') {
    query = query.eq('user_id', userId);
  } else {
    query = query.eq('instructor_id', userId);
  }

  const { count, error } = await query;
  if (error) throw queryError(`${table} count`, error);
  return count ?? 0;
}

export async function getInstructorDashboardData() {
  const context = await getInstructorContext();
  const { user } = context;
  const artists = await getInstructorArtists();
  const artistIds = artists.map((artist) => artist.id);

  const [totalArtists, totalSessions, totalPosts, recentAttendance] =
    await Promise.all([
      getCount('artist_records', user.id),
      artistIds.length
        ? createAdminClient()
            .from('attendance')
            .select('*', { count: 'exact', head: true })
            .in('artist_record_id', artistIds)
            .then(({ count, error }) => {
              if (error) throw queryError('attendance count', error);
              return count ?? 0;
            })
        : Promise.resolve(0),
      getCount('posts', user.id),
      getInstructorAttendance(5),
    ]);

  const presentCount = recentAttendance.filter(
    (record) => record.status === 'Present',
  ).length;
  const attendanceRate =
    recentAttendance.length === 0
      ? 100
      : Math.round((presentCount / recentAttendance.length) * 100);

  return {
    totalArtists,
    totalSessions,
    totalPosts,
    attendanceRate,
    recentAttendance,
  };
}
