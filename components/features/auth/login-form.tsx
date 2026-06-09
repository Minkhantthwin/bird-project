'use client';

import { useState, useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconEye, IconEyeOff, IconLogin } from '@tabler/icons-react';
import { toast } from 'sonner';

import { loginAction } from '@/lib/auth/actions';
import { loginSchema, type LoginInput } from '@/lib/auth/schemas';
import type { AuthFormState } from '@/lib/auth/types';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuthCard } from './auth-card';

const initialState: AuthFormState = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(loginSchema as any),
    mode: 'onBlur',
  });

  // Map server errors to form fields
  useEffect(() => {
    if (state?.errors) {
      for (const [field, messages] of Object.entries(state.errors)) {
        setError(field as keyof LoginInput, {
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
      title="Welcome back"
      subtitle="Sign in to your attanDANCE account"
      footerLabel="No account yet?"
      footerHref="/register"
    >
      <form action={formAction} className="space-y-5">
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
              autoComplete="current-password"
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

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Signing in…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconLogin size={18} />
              Sign in
            </span>
          )}
        </Button>
      </form>
    </AuthCard>
  );
}
