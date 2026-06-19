/**
 * Data Service — provides data access that automatically switches between
 * dummy/mock data and real API / database calls based on DUMMY_DATA_ENABLED.
 *
 * Every public function:
 *  1. Checks `isDummyDataEnabled())`
 *  2. If true  → returns dummy data (or simulated async result)
 *  3. If false → calls real API / DB
 *
 *  Usage:
 *    import { getPosts } from '@/lib/data-service';
 *    const posts = await getPosts();
 */

import { cookies } from 'next/headers';
import { isDummyDataEnabled } from '@/lib/env';
import { dummyData } from '@/lib/dummy-data';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import type {
  Role,
  User,
  ArtistRecord,
  Attendance,
  Injury,
  Post,
  Comment,
  Reaction,
  ReactionType,
} from '@/lib/types';

// ── Helpers ─────────────────────────────────────────────
function simDelay<T>(data: T, ms = 60): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

function one<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? (relation[0] ?? null) : relation;
}

function queryError(resource: string, error: { message: string }) {
  return new Error(`Unable to load ${resource}: ${error.message}`, {
    cause: error,
  });
}

// ═════════════════════════════════════════════════════════
// Roles
// ═════════════════════════════════════════════════════════
export async function getRoles(): Promise<Role[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.roles]);
  // TODO: fetch from real API / DB
  throw new Error('Real data source not implemented yet.');
}

// ═════════════════════════════════════════════════════════
// Users
// ═════════════════════════════════════════════════════════
export async function getUsers(): Promise<User[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.users]);
  throw new Error('Real data source not implemented yet.');
}

export async function getUserById(id: string): Promise<User | undefined> {
  if (isDummyDataEnabled())
    return simDelay(dummyData.users.find((u) => u.id === id));

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('profiles')
    .select('id, email, full_name, created_at, roles(name)')
    .eq('id', id)
    .single();

  if (error) throw queryError('user', error);
  if (!data) return undefined;

  return {
    id: data.id,
    role_id: '',
    email: data.email,
    password_hash: '',
    full_name: data.full_name,
    created_at: data.created_at,
  };
}

// ═════════════════════════════════════════════════════════
// Artist Records
// ═════════════════════════════════════════════════════════
export async function getArtistRecords(): Promise<ArtistRecord[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.artistRecords]);
  throw new Error('Real data source not implemented yet.');
}

export async function getArtistRecordById(
  id: string,
): Promise<ArtistRecord | undefined> {
  if (isDummyDataEnabled())
    return simDelay(dummyData.artistRecords.find((a) => a.id === id));
  throw new Error('Real data source not implemented yet.');
}

export async function getArtistRecordByUserId(
  userId: string,
): Promise<ArtistRecord | undefined> {
  if (isDummyDataEnabled())
    return simDelay(dummyData.artistRecords.find((a) => a.user_id === userId));

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('artist_records')
    .select('id, user_id, stage_name, specialty, join_date, created_at')
    .eq('user_id', userId)
    .single();

  if (error) {
    // PGRST116 = no rows — user may not be an artist
    if (error.code === 'PGRST116') return undefined;
    throw queryError('artist record', error);
  }

  return {
    id: data.id,
    user_id: data.user_id,
    stage_name: data.stage_name,
    specialty: data.specialty,
    join_date: data.join_date,
    created_at: data.created_at,
  };
}

// ═════════════════════════════════════════════════════════
// Attendance
// ═════════════════════════════════════════════════════════
export async function getAttendanceRecords(): Promise<Attendance[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.attendanceRecords]);

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('attendance')
    .select('id, artist_record_id, session_date, status, notes')
    .order('session_date', { ascending: false });

  if (error) throw queryError('attendance', error);
  return (data ?? []) as Attendance[];
}

export async function getAttendanceByArtistId(
  artistRecordId: string,
): Promise<Attendance[]> {
  if (isDummyDataEnabled())
    return simDelay(
      dummyData.attendanceRecords.filter(
        (a) => a.artist_record_id === artistRecordId,
      ),
    );

  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('attendance')
    .select('id, artist_record_id, session_date, status, notes')
    .eq('artist_record_id', artistRecordId)
    .order('session_date', { ascending: false });

  if (error) throw queryError('attendance by artist', error);
  return (data ?? []) as Attendance[];
}

// ═════════════════════════════════════════════════════════
// Injuries
// ═════════════════════════════════════════════════════════
export async function getInjuries(): Promise<Injury[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.injuries]);
  throw new Error('Real data source not implemented yet.');
}

export async function getInjuriesByArtistId(
  artistRecordId: string,
): Promise<Injury[]> {
  if (isDummyDataEnabled())
    return simDelay(
      dummyData.injuries.filter((i) => i.artist_record_id === artistRecordId),
    );
  throw new Error('Real data source not implemented yet.');
}

// ═════════════════════════════════════════════════════════
// Posts
// ═════════════════════════════════════════════════════════
export async function getPosts(): Promise<Post[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.posts]);

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id, title, body, created_at')
    .order('created_at', { ascending: false });

  if (error) throw queryError('posts', error);
  return data ?? [];
}

export async function getPostById(id: string): Promise<Post | undefined> {
  if (isDummyDataEnabled())
    return simDelay(dummyData.posts.find((p) => p.id === id));

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id, title, body, created_at')
    .eq('id', id)
    .single();

  if (error) throw queryError('post', error);
  return data ?? undefined;
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  if (isDummyDataEnabled())
    return simDelay(dummyData.posts.filter((p) => p.user_id === userId));

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('posts')
    .select('id, user_id, title, body, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw queryError('posts by user', error);
  return data ?? [];
}

// ═════════════════════════════════════════════════════════
// Comments
// ═════════════════════════════════════════════════════════
export async function getComments(): Promise<Comment[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.comments]);

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, user_id, content, created_at')
    .order('created_at', { ascending: false });

  if (error) throw queryError('comments', error);
  return data ?? [];
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  if (isDummyDataEnabled())
    return simDelay(
      dummyData.comments.filter((c) => c.post_id === postId),
    );

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, user_id, content, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw queryError('comments for post', error);
  return data ?? [];
}

// ═════════════════════════════════════════════════════════
// Reactions
// ═════════════════════════════════════════════════════════
export async function getReactions(): Promise<Reaction[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.reactions]);

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('reactions')
    .select('id, post_id, user_id, reaction_type, created_at')
    .order('created_at', { ascending: false });

  if (error) throw queryError('reactions', error);
  return data ?? [];
}

export async function getReactionsByPostId(
  postId: string,
): Promise<Reaction[]> {
  if (isDummyDataEnabled())
    return simDelay(
      dummyData.reactions.filter((r) => r.post_id === postId),
    );

  const supabase = createClient(await cookies());
  const { data, error } = await supabase
    .from('reactions')
    .select('id, post_id, user_id, reaction_type, created_at')
    .eq('post_id', postId);

  if (error) throw queryError('reactions for post', error);
  return data ?? [];
}

// ═════════════════════════════════════════════════════════
// Aggregated / Composite queries (useful for UI)
// ═════════════════════════════════════════════════════════

export interface PostAuthor {
  id: string;
  full_name: string;
  role_name: string;
}

export interface CommentWithAuthor extends Comment {
  author: Pick<PostAuthor, 'id' | 'full_name'>;
}

export interface PostWithMeta extends Post {
  author: PostAuthor;
  commentCount: number;
  reactions: Reaction[];
}

export async function getPostsWithMeta(): Promise<PostWithMeta[]> {
  if (isDummyDataEnabled()) {
    const posts = [...dummyData.posts];
    const enriched = posts.map((post) => {
      const author = dummyData.users.find((u) => u.id === post.user_id);
      const role = dummyData.roles.find((r) => r.id === author?.role_id);
      const postReactions = dummyData.reactions.filter(
        (r) => r.post_id === post.id,
      );
      const commentCount = dummyData.comments.filter(
        (c) => c.post_id === post.id,
      ).length;
      return {
        ...post,
        author: {
          id: author?.id ?? '',
          full_name: author?.full_name ?? 'Unknown',
          role_name: role?.name ?? 'Unknown',
        },
        commentCount,
        reactions: postReactions,
      };
    });
    return simDelay(enriched);
  }

  // Real Supabase implementation — uses admin client to bypass RLS for
  // cross-user profile reads (feed needs all authors visible).
  const adminClient = createAdminClient();

  const { data: posts, error: postsError } = await adminClient
    .from('posts')
    .select('id, user_id, title, body, created_at')
    .order('created_at', { ascending: false });

  if (postsError) throw queryError('feed posts', postsError);
  if (!posts?.length) return [];

  const postIds = posts.map((p) => p.id);
  const userIds = Array.from(new Set(posts.map((p) => p.user_id)));

  // Fetch profiles + roles for all post authors in parallel
  const [profilesResult, reactionsResult, commentsResult] = await Promise.all([
    adminClient
      .from('profiles')
      .select('id, full_name, roles(name)')
      .in('id', userIds),
    adminClient
      .from('reactions')
      .select('id, post_id, user_id, reaction_type, created_at')
      .in('post_id', postIds),
    adminClient
      .from('comments')
      .select('post_id')
      .in('post_id', postIds),
  ]);

  if (profilesResult.error) throw queryError('author profiles', profilesResult.error);
  if (reactionsResult.error) throw queryError('reactions', reactionsResult.error);
  if (commentsResult.error) throw queryError('comments', commentsResult.error);

  // Build lookup maps
  const profileMap = new Map(
    (profilesResult.data ?? []).map((p) => [
      p.id,
      {
        id: p.id,
        full_name: p.full_name,
        role_name: one(p.roles)?.name ?? 'Unknown',
      } as PostAuthor,
    ]),
  );

  // Group reactions by post_id
  const reactionsByPost = new Map<string, Reaction[]>();
  for (const r of reactionsResult.data ?? []) {
    const list = reactionsByPost.get(r.post_id) ?? [];
    list.push({
      id: r.id,
      post_id: r.post_id,
      user_id: r.user_id,
      reaction_type: r.reaction_type as ReactionType,
      created_at: r.created_at,
    });
    reactionsByPost.set(r.post_id, list);
  }

  // Count comments by post_id
  const commentCountByPost = new Map<string, number>();
  for (const c of commentsResult.data ?? []) {
    commentCountByPost.set(c.post_id, (commentCountByPost.get(c.post_id) ?? 0) + 1);
  }

  return posts.map((post) => ({
    id: post.id,
    user_id: post.user_id,
    title: post.title,
    body: post.body,
    created_at: post.created_at,
    author: profileMap.get(post.user_id) ?? {
      id: post.user_id,
      full_name: 'Unknown',
      role_name: 'Unknown',
    },
    commentCount: commentCountByPost.get(post.id) ?? 0,
    reactions: reactionsByPost.get(post.id) ?? [],
  }));
}

export async function getCommentsWithAuthors(
  postId: string,
): Promise<CommentWithAuthor[]> {
  if (isDummyDataEnabled()) {
    const comments = dummyData.comments
      .filter((c) => c.post_id === postId)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    return simDelay(
      comments.map((c) => {
        const author = dummyData.users.find((u) => u.id === c.user_id);
        return {
          ...c,
          author: {
            id: author?.id ?? '',
            full_name: author?.full_name ?? 'Unknown',
          },
        };
      }),
    );
  }

  const adminClient = createAdminClient();
  const { data: comments, error } = await adminClient
    .from('comments')
    .select('id, post_id, user_id, content, created_at, profiles(full_name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) throw queryError('comments with authors', error);

  return (comments ?? []).map((c) => ({
    id: c.id,
    post_id: c.post_id,
    user_id: c.user_id,
    content: c.content,
    created_at: c.created_at,
    author: {
      id: c.user_id,
      full_name: one(c.profiles)?.full_name ?? 'Unknown',
    },
  }));
}

// ═════════════════════════════════════════════════════════
// Dashboard profile & attendance composite queries
// ═════════════════════════════════════════════════════════

export interface UserProfileData {
  id: string;
  email: string;
  full_name: string;
  role_name: string;
  created_at: string;
  artistRecord: ArtistRecord | null;
  attendanceCount: number;
  postCount: number;
  attendanceRate: number;
}

export async function getUserProfileData(
  userId: string,
): Promise<UserProfileData> {
  if (isDummyDataEnabled()) {
    const user = dummyData.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    const role = dummyData.roles.find((r) => r.id === user.role_id);
    const artistRecord = dummyData.artistRecords.find(
      (a) => a.user_id === userId,
    );
    const userAttendance = dummyData.attendanceRecords.filter((a) => {
      const artist = dummyData.artistRecords.find(
        (ar) => ar.id === a.artist_record_id,
      );
      return artist?.user_id === userId;
    });
    const presentCount = userAttendance.filter(
      (a) => a.status === 'Present',
    ).length;
    const rate =
      userAttendance.length > 0
        ? Math.round((presentCount / userAttendance.length) * 100)
        : 0;
    const postCount = dummyData.posts.filter(
      (p) => p.user_id === userId,
    ).length;

    return simDelay({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role_name: role?.name ?? 'Member',
      created_at: user.created_at,
      artistRecord: artistRecord ?? null,
      attendanceCount: userAttendance.length,
      postCount,
      attendanceRate: rate,
    });
  }

  const adminClient = createAdminClient();

  // Fetch profile with role
  const { data: profile, error: profileError } = await adminClient
    .from('profiles')
    .select('id, email, full_name, created_at, roles(name)')
    .eq('id', userId)
    .single();

  if (profileError) throw queryError('profile', profileError);

  // Fetch artist record, attendance, and post count in parallel
  const [artistResult, attendanceResult, postCountResult] = await Promise.all([
    adminClient
      .from('artist_records')
      .select('id, user_id, stage_name, specialty, join_date, created_at')
      .eq('user_id', userId)
      .maybeSingle(),
    adminClient
      .from('attendance')
      .select('id, artist_record_id, session_date, status, notes')
      .order('session_date', { ascending: false }),
    adminClient
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),
  ]);

  // Filter attendance to only this user's artist record
  const artistId = artistResult.data?.id;
  const userAttendance = artistId
    ? (attendanceResult.data ?? []).filter(
        (a) => a.artist_record_id === artistId,
      )
    : [];

  const presentCount = userAttendance.filter(
    (a) => a.status === 'Present',
  ).length;
  const rate =
    userAttendance.length > 0
      ? Math.round((presentCount / userAttendance.length) * 100)
      : 0;

  return {
    id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
    role_name: one(profile.roles)?.name ?? 'Member',
    created_at: profile.created_at,
    artistRecord: artistResult.data
      ? {
          id: artistResult.data.id,
          user_id: artistResult.data.user_id,
          stage_name: artistResult.data.stage_name,
          specialty: artistResult.data.specialty,
          join_date: artistResult.data.join_date,
          created_at: artistResult.data.created_at,
        }
      : null,
    attendanceCount: userAttendance.length,
    postCount: postCountResult.count ?? 0,
    attendanceRate: rate,
  };
}

export interface UserAttendanceData {
  records: Attendance[];
  totalSessions: number;
  presentCount: number;
  attendanceRate: number;
}

export async function getUserAttendanceData(
  userId: string,
): Promise<UserAttendanceData> {
  if (isDummyDataEnabled()) {
    const userAttendance = dummyData.attendanceRecords.filter((a) => {
      const artist = dummyData.artistRecords.find(
        (ar) => ar.id === a.artist_record_id,
      );
      return artist?.user_id === userId;
    });
    const presentCount = userAttendance.filter(
      (a) => a.status === 'Present',
    ).length;
    const rate =
      userAttendance.length > 0
        ? Math.round((presentCount / userAttendance.length) * 100)
        : 0;

    return simDelay({
      records: [...userAttendance].sort(
        (a, b) =>
          new Date(b.session_date).getTime() -
          new Date(a.session_date).getTime(),
      ),
      totalSessions: userAttendance.length,
      presentCount,
      attendanceRate: rate,
    });
  }

  const adminClient = createAdminClient();

  // Find the artist record for this user
  const { data: artistRecord } = await adminClient
    .from('artist_records')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (!artistRecord) {
    return { records: [], totalSessions: 0, presentCount: 0, attendanceRate: 0 };
  }

  const { data: records, error } = await adminClient
    .from('attendance')
    .select('id, artist_record_id, session_date, status, notes')
    .eq('artist_record_id', artistRecord.id)
    .order('session_date', { ascending: false });

  if (error) throw queryError('user attendance', error);

  const presentCount = (records ?? []).filter(
    (a) => a.status === 'Present',
  ).length;
  const rate =
    records && records.length > 0
      ? Math.round((presentCount / records.length) * 100)
      : 0;

  return {
    records: (records ?? []) as Attendance[],
    totalSessions: records?.length ?? 0,
    presentCount,
    attendanceRate: rate,
  };
}
