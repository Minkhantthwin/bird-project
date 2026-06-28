'use client';

import { useState, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconEye, IconEyeOff, IconUserPlus } from '@tabler/icons-react';
import { toast } from 'sonner';

import { registerAction } from '@/lib/auth/actions';
import { registerSchema, type RegisterInput } from '@/lib/auth/schemas';
import type { AuthFormState } from '@/lib/auth/types';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuthCard } from './auth-card';

const initialState: AuthFormState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registerSchema as any),
    mode: 'onBlur',
  });

  // Map server errors to form fields
  useEffect(() => {
    if (state?.errors) {
      for (const [field, messages] of Object.entries(state.errors)) {
        setError(field as keyof RegisterInput, {
          message: messages?.join(', '),
        });
      }
    }
    if (state?.serverError) {
      toast.error(state.serverError);
    }
  }, [state, setError]);

  return (
    <AuthCard
      title="Join the crew"
      subtitle="Create your account, then confirm it with an email code"
      footerLabel="Already a member?"
      footerHref="/login"
    >
      <form action={formAction} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Sakura Tanaka"
            autoComplete="name"
            disabled={isPending}
            {...register('fullName')}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isPending}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className="pr-10"
              disabled={isPending}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className="pr-10"
              disabled={isPending}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating account…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconUserPlus size={18} />
              Create account
            </span>
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
