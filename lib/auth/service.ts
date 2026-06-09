import { isDummyDataEnabled } from '@/lib/env';
import { dummyData } from '@/lib/dummy-data';
import type { AuthResult, SessionUser } from './types';
import type { LoginInput, RegisterInput } from './schemas';

// ── Helpers ──────────────────────────────────────────

function mapUserToSessionUser(user: (typeof dummyData.users)[number]): SessionUser {
  const role =
    dummyData.roles.find((r) => r.id === user.role_id)?.name ?? 'Member';
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role,
  };
}

// ══════════════════════════════════════════════════════
// Public API
// ══════════════════════════════════════════════════════

export async function login(input: LoginInput): Promise<AuthResult> {
  if (!isDummyDataEnabled()) {
    // TODO: call real auth API / DB
    throw new Error('Real auth not implemented yet.');
  }

  const user = dummyData.users.find((u) => u.email === input.email);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Dummy mode: accept any password ≥ 8 chars for known emails
  return { success: true, user: mapUserToSessionUser(user) };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  if (!isDummyDataEnabled()) {
    // TODO: call real registration API / DB
    throw new Error('Real auth not implemented yet.');
  }

  const exists = dummyData.users.find((u) => u.email === input.email);
  if (exists) {
    return { success: false, error: 'An account with this email already exists' };
  }

  // Simulate new user — return a placeholder session
  const newUser: SessionUser = {
    id: `user-new-${Date.now()}`,
    email: input.email,
    fullName: input.fullName,
    role: 'Member',
  };

  return { success: true, user: newUser };
}
