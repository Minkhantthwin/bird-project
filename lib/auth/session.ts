import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { dummyData } from '@/lib/dummy-data';
import { isDummyDataEnabled } from '@/lib/env';
import { isUserRole, type SessionUser } from './types';

/**
 * Server-side session resolver.
 * Dummy mode: reads legacy `auth-token` cookie.
 * Real mode: uses Supabase `getUser()` + queries `public.profiles`.
 * Returns `null` when unauthenticated.
 */
export async function getSession(): Promise<SessionUser | null> {
  // ── Dummy mode: legacy cookie-based ─────────────
  if (isDummyDataEnabled()) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return null;

    const user = dummyData.users.find((u) => u.id === token);
    if (!user) return null;

    const role =
      dummyData.roles.find((r) => r.id === user.role_id)?.name ?? 'Member';

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: isUserRole(role) ? role : 'Member',
    };
  }

  // ── Real mode: Supabase Auth ────────────────────
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  // Fetch profile + role from public.profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, roles(name)')
    .eq('id', user.id)
    .single();

  const role = (profile as { roles: { name: unknown } | null } | null)?.roles
    ?.name;

  if (profileError || !profile || !isUserRole(role)) {
    throw new Error('Authenticated user has no readable profile role.', {
      cause: profileError,
    });
  }

  return {
    id: user.id,
    email: user.email!,
    fullName: profile.full_name,
    role,
  };
}
