import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { isDummyDataEnabled } from '@/lib/env';
import { dummyData } from '@/lib/dummy-data';
import {
  isUserRole,
  type AuthResult,
  type RegisterResult,
  type SessionUser,
} from './types';
import type { LoginInput, RegisterInput, VerifyOtpInput } from './schemas';

// ── Helpers ──────────────────────────────────────────

function mapDummyUserToSessionUser(
  user: (typeof dummyData.users)[number],
): SessionUser {
  const role =
    dummyData.roles.find((r) => r.id === user.role_id)?.name ?? 'Member';

  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: isUserRole(role) ? role : 'Member',
  };
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
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('full_name, roles(name)')
    .eq('id', data.user.id)
    .single();

  const role = (profile as { roles: { name: unknown } | null } | null)?.roles
    ?.name;

  if (profileError || !profile || !isUserRole(role)) {
    console.error('Profile role lookup failed after login:', profileError);
    await supabase.auth.signOut();
    return {
      success: false,
      error: 'Your account profile could not be loaded. Please contact an administrator.',
    };
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email!,
      fullName: profile.full_name,
      role,
    },
  };
}

async function ensureMemberProfile(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  email: string,
  fullName: string,
) {
  const { data: memberRole, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('name', 'Member')
    .single();

  if (roleError || !memberRole?.id) {
    console.error('Member role lookup failed:', roleError);
    return;
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: userId,
      role_id: memberRole.id,
      email,
      full_name: fullName,
    },
    { onConflict: 'id' },
  );

  if (profileError) {
    console.error('Profile upsert failed:', profileError.message);
  }
}

async function supabaseRegister(input: RegisterInput): Promise<RegisterResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

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

  if (!data.user || !data.user.email) {
    return { success: false, error: 'Registration failed. Please try again.' };
  }

  return {
    success: true,
    email: data.user.email,
    requiresVerification: !data.session,
  };
}

async function supabaseVerifyOtp(input: VerifyOtpInput): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.verifyOtp({
    email: input.email,
    token: input.token,
    type: 'email',
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user || !data.user.email) {
    return {
      success: false,
      error: 'Verification failed. Please request a new code and try again.',
    };
  }

  const fullName =
    typeof data.user.user_metadata?.full_name === 'string'
      ? data.user.user_metadata.full_name
      : data.user.email.split('@')[0];

  await ensureMemberProfile(
    supabase,
    data.user.id,
    data.user.email,
    fullName,
  );

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      fullName,
      role: 'Member',
    },
  };
}

async function supabaseResendVerification(email: string): Promise<AuthResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    user: {
      id: 'pending-verification',
      email,
      fullName: '',
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

async function dummyRegister(input: RegisterInput): Promise<RegisterResult> {
  const exists = dummyData.users.find((u) => u.email === input.email);
  if (exists) {
    return {
      success: false,
      error: 'An account with this email already exists',
    };
  }
  return {
    success: true,
    email: input.email,
    requiresVerification: false,
  };
}

// ══════════════════════════════════════════════════════
// Public API — switches based on DUMMY_DATA_ENABLED
// ══════════════════════════════════════════════════════

export async function login(input: LoginInput): Promise<AuthResult> {
  if (isDummyDataEnabled()) return dummyLogin(input);
  return supabaseLogin(input);
}

export async function register(input: RegisterInput): Promise<RegisterResult> {
  if (isDummyDataEnabled()) return dummyRegister(input);
  return supabaseRegister(input);
}

export async function verifyRegistrationOtp(
  input: VerifyOtpInput,
): Promise<AuthResult> {
  if (isDummyDataEnabled()) {
    return {
      success: true,
      user: {
        id: `user-new-${Date.now()}`,
        email: input.email,
        fullName: input.email.split('@')[0],
        role: 'Member',
      },
    };
  }

  return supabaseVerifyOtp(input);
}

export async function resendRegistrationOtp(email: string): Promise<AuthResult> {
  if (isDummyDataEnabled()) {
    return {
      success: true,
      user: {
        id: 'pending-verification',
        email,
        fullName: '',
        role: 'Member',
      },
    };
  }

  return supabaseResendVerification(email);
}
