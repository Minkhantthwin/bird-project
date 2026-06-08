/**
 * Data Service — provides data access that automatically switches between
 * dummy/mock data and real API / database calls based on DUMMY_DATA_ENABLED.
 *
 * Every public function:
 *  1. Checks `isDummyDataEnabled())`
 *  2. If true  → returns dummy data (or simulated async result)
 *  3. If false → calls real API / DB (stubbed for now)
 *
 *  Usage:
 *    import { getPosts } from '@/lib/data-service';
 *    const posts = await getPosts();
 */

import { isDummyDataEnabled } from '@/lib/env';
import { dummyData } from '@/lib/dummy-data';
import type {
  Role,
  User,
  ArtistRecord,
  Attendance,
  Injury,
  Post,
  Comment,
  Reaction,
} from '@/lib/types';

// ── Helper ──────────────────────────────────────────────
function simDelay<T>(data: T, ms = 60): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
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
  throw new Error('Real data source not implemented yet.');
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
  throw new Error('Real data source not implemented yet.');
}

// ═════════════════════════════════════════════════════════
// Attendance
// ═════════════════════════════════════════════════════════
export async function getAttendanceRecords(): Promise<Attendance[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.attendanceRecords]);
  throw new Error('Real data source not implemented yet.');
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
  throw new Error('Real data source not implemented yet.');
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
  throw new Error('Real data source not implemented yet.');
}

export async function getPostById(id: string): Promise<Post | undefined> {
  if (isDummyDataEnabled())
    return simDelay(dummyData.posts.find((p) => p.id === id));
  throw new Error('Real data source not implemented yet.');
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  if (isDummyDataEnabled())
    return simDelay(dummyData.posts.filter((p) => p.user_id === userId));
  throw new Error('Real data source not implemented yet.');
}

// ═════════════════════════════════════════════════════════
// Comments
// ═════════════════════════════════════════════════════════
export async function getComments(): Promise<Comment[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.comments]);
  throw new Error('Real data source not implemented yet.');
}

export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  if (isDummyDataEnabled())
    return simDelay(
      dummyData.comments.filter((c) => c.post_id === postId),
    );
  throw new Error('Real data source not implemented yet.');
}

// ═════════════════════════════════════════════════════════
// Reactions
// ═════════════════════════════════════════════════════════
export async function getReactions(): Promise<Reaction[]> {
  if (isDummyDataEnabled()) return simDelay([...dummyData.reactions]);
  throw new Error('Real data source not implemented yet.');
}

export async function getReactionsByPostId(
  postId: string,
): Promise<Reaction[]> {
  if (isDummyDataEnabled())
    return simDelay(
      dummyData.reactions.filter((r) => r.post_id === postId),
    );
  throw new Error('Real data source not implemented yet.');
}

// ═════════════════════════════════════════════════════════
// Aggregated / Composite queries (useful for UI)
// ═════════════════════════════════════════════════════════

export interface PostWithMeta extends Post {
  author: User;
  commentCount: number;
  reactions: Reaction[];
}

export async function getPostsWithMeta(): Promise<PostWithMeta[]> {
  if (isDummyDataEnabled()) {
    const posts = [...dummyData.posts];
    const enriched = posts.map((post) => {
      const author = dummyData.users.find((u) => u.id === post.user_id);
      const postReactions = dummyData.reactions.filter(
        (r) => r.post_id === post.id,
      );
      const commentCount = dummyData.comments.filter(
        (c) => c.post_id === post.id,
      ).length;
      return {
        ...post,
        author: author!,
        commentCount,
        reactions: postReactions,
      };
    });
    return simDelay(enriched);
  }
  throw new Error('Real data source not implemented yet.');
}
