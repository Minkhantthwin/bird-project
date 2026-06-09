import { cookies } from 'next/headers';
import { dummyData } from '@/lib/dummy-data';
import { isDummyDataEnabled } from '@/lib/env';
import type { SessionUser } from './types';

/**
 * Server-side session resolver.
 * Reads the `auth-token` cookie and returns the matching SessionUser.
 * Returns `null` when unauthenticated.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  if (!token) return null;

  if (isDummyDataEnabled()) {
    // Dummy mode: token is the user UUID
    const user = dummyData.users.find((u) => u.id === token);
    if (!user) return null;

    const role =
      dummyData.roles.find((r) => r.id === user.role_id)?.name ?? 'Member';

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role,
    };
  }

  // TODO: real session resolution (JWT verify, DB lookup, etc.)
  return null;
}
