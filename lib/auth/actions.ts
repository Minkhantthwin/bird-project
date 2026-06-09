'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { loginSchema, registerSchema } from './schemas';
import { login, register } from './service';
import type { AuthFormState } from './types';

// ══════════════════════════════════════════════════════
// Login Action
// ══════════════════════════════════════════════════════

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const result = await login(parsed.data);

  if (!result.success) {
    return { serverError: result.error };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('auth-token', result.user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/');
}

// ══════════════════════════════════════════════════════
// Register Action
// ══════════════════════════════════════════════════════

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const result = await register(parsed.data);

  if (!result.success) {
    return { serverError: result.error };
  }

  // Set session cookie
  const cookieStore = await cookies();
  cookieStore.set('auth-token', result.user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/');
}

// ══════════════════════════════════════════════════════
// Logout Action
// ══════════════════════════════════════════════════════

export async function logoutAction() {
  'use server';
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  redirect('/login');
}
