'use client';

import Link from 'next/link';
import { useActionState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconMailCheck, IconReload } from '@tabler/icons-react';
import { toast } from 'sonner';

import {
  resendRegisterOtpAction,
  verifyRegisterOtpAction,
} from '@/lib/auth/actions';
import { verifyOtpSchema, type VerifyOtpInput } from '@/lib/auth/schemas';
import type { AuthFormState } from '@/lib/auth/types';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AuthCard } from './auth-card';

const initialState: AuthFormState = {};

interface RegisterOtpFormProps {
  email: string;
}

export function RegisterOtpForm({ email }: RegisterOtpFormProps) {
  const [verifyState, verifyAction, verifyPending] = useActionState(
    verifyRegisterOtpAction,
    initialState,
  );
  const [resendState, resendAction, resendPending] = useActionState(
    resendRegisterOtpAction,
    initialState,
  );

  const {
    register,
    formState: { errors },
    setError,
  } = useForm<VerifyOtpInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(verifyOtpSchema as any),
    mode: 'onBlur',
    defaultValues: {
      email,
      token: '',
    },
  });

  useEffect(() => {
    if (verifyState?.errors) {
      for (const [field, messages] of Object.entries(verifyState.errors)) {
        setError(field as keyof VerifyOtpInput, {
          message: messages?.join(', '),
        });
      }
    }

    if (verifyState?.serverError) {
      toast.error(verifyState.serverError);
    }
  }, [setError, verifyState]);

  useEffect(() => {
    if (resendState?.serverError) {
      toast.error(resendState.serverError);
    }

    if (resendState?.success && resendState.message) {
      toast.success(resendState.message);
    }
  }, [resendState]);

  return (
    <AuthCard
      title="Check your inbox"
      subtitle={`We sent an 8-digit verification code to ${email}`}
      footerLabel="Entered the wrong email?"
      footerHref="/register"
    >
      <form action={verifyAction} className="space-y-4">
        <input type="hidden" value={email} {...register('email')} />

        <div className="space-y-1.5">
          <Label htmlFor="token">Verification Code</Label>
          <Input
            id="token"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="12345678"
            maxLength={8}
            disabled={verifyPending}
            {...register('token')}
          />
          {errors.token && (
            <p className="text-xs text-destructive">{errors.token.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={verifyPending}>
          {verifyPending ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Verifying…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconMailCheck size={18} />
              Verify account
            </span>
          )}
        </Button>
      </form>

      <form action={resendAction} className="mt-4">
        <input type="hidden" name="email" value={email} />
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={resendPending}
        >
          {resendPending ? (
            <span className="flex items-center gap-2">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Sending…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <IconReload size={18} />
              Resend code
            </span>
          )}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Need to use the confirmation link instead? Open it from the same email, or{' '}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          go back to sign in
        </Link>
        .
      </p>
    </AuthCard>
  );
}
