import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { isDummyDataEnabled } from '@/lib/env';
import { dummyData } from '@/lib/dummy-data';
import type { AuthResult, SessionUser } from './types';
import type { LoginInput, RegisterInput } from './schemas';

// ── Helpers ──────────────────────────────────────────

function mapDummyUserToSessionUser(
  user: (typeof dummyData.users)[number],
): SessionUser {
  const role =
    dummyData.roles.find((r) => r.id === user.role_id)?.name ?? 'Member';
  return { id: user.id, email: user.email, fullName: user.full_name, role };
}

// ══════════════════════════════════════════════════════
// Real Auth (Supabase)
// ══════════════════════════════════════════════════════

async function supabaseLogin(input: LoginInput): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: 'Invalid email or password' };
  }

  // Fetch profile + role from public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, roles(name)')
    .eq('id', data.user.id)
    .single();

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email!,
      fullName: profile?.full_name ?? 'User',
      role: (profile as any)?.roles?.name ?? 'Member',
    },
  };
}

async function supabaseRegister(input: RegisterInput): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.fullName },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: 'Registration failed. Please try again.' };
  }

  // 2. Insert profile row
  const { data: memberRole } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'Member')
    .single();

  const { error: profileError } = await supabase.from('profiles').insert({
    id: data.user.id,
    role_id: memberRole?.id,
    email: input.email,
    full_name: input.fullName,
  });

  if (profileError) {
    // Profile insert failed, but auth user was created.
    // In production, use a database trigger instead.
    console.error('Profile creation failed:', profileError.message);
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email!,
      fullName: input.fullName,
      role: 'Member',
    },
  };
}

// ══════════════════════════════════════════════════════
// Dummy Auth (fallback)
// ══════════════════════════════════════════════════════

async function dummyLogin(input: LoginInput): Promise<AuthResult> {
  const user = dummyData.users.find((u) => u.email === input.email);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  return { success: true, user: mapDummyUserToSessionUser(user) };
}

async function dummyRegister(input: RegisterInput): Promise<AuthResult> {
  const exists = dummyData.users.find((u) => u.email === input.email);
  if (exists) {
    return {
      success: false,
      error: 'An account with this email already exists',
    };
  }
  return {
    success: true,
    user: {
      id: `user-new-${Date.now()}`,
      email: input.email,
      fullName: input.fullName,
      role: 'Member',
    },
  };
}

// ══════════════════════════════════════════════════════
// Public API — switches based on DUMMY_DATA_ENABLED
// ══════════════════════════════════════════════════════

export async function login(input: LoginInput): Promise<AuthResult> {
  if (isDummyDataEnabled()) return dummyLogin(input);
  return supabaseLogin(input);
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  if (isDummyDataEnabled()) return dummyRegister(input);
  return supabaseRegister(input);
}

