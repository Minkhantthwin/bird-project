'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { loginSchema, registerSchema, verifyOtpSchema } from './schemas';
import { login, register, resendRegistrationOtp, verifyRegistrationOtp } from './service';
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

  if (result.requiresVerification) {
    redirect(`/register/verify?email=${encodeURIComponent(result.email)}`);
  }

  redirect('/');
}

export async function verifyRegisterOtpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = verifyOtpSchema.safeParse({
    email: formData.get('email'),
    token: formData.get('token'),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const result = await verifyRegistrationOtp(parsed.data);

  if (!result.success) {
    return { serverError: result.error };
  }

  redirect('/');
}

export async function resendRegisterOtpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get('email');
  const parsed = verifyOtpSchema.shape.email.safeParse(email);

  if (!parsed.success) {
    return { errors: { email: parsed.error.issues.map((issue) => issue.message) } };
  }

  const result = await resendRegistrationOtp(parsed.data);

  if (!result.success) {
    return { serverError: result.error };
  }

  return {
    success: true,
    message: 'A fresh verification code is on its way to your inbox.',
  };
}

// ══════════════════════════════════════════════════════
// Logout Action
// ══════════════════════════════════════════════════════

export async function logoutAction() {
  'use server';

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();

  redirect('/login');
}
