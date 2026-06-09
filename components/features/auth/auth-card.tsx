import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  /** The form to render (LoginForm or RegisterForm) */
  children: ReactNode;
  /** Page heading, e.g. "Welcome back" */
  title: string;
  /** Page subtitle, e.g. "Sign in to your account" */
  subtitle: string;
  /** Link text below the form, e.g. "No account? Register" */
  footerLabel: string;
  /** Link href below the form */
  footerHref: string;
}

export function AuthCard({
  children,
  title,
  subtitle,
  footerLabel,
  footerHref,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div
        className={cn(
          'animate-scale-in-up relative flex w-full max-w-4xl overflow-hidden rounded-4xl',
          'bg-card/60 shadow-2xl ring-1 ring-foreground/10',
          'backdrop-blur-xl backdrop-saturate-150',
        )}
      >
        {/* ── Branding Side (hidden on mobile) ───── */}
        <div className="relative hidden w-1/2 flex-col justify-between bg-muted/50 p-10 md:flex">
          {/* Decorative gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

          <div className="relative z-10">
            <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
              attan<span className="text-primary">DANCE</span>
            </Link>
          </div>

          <div className="relative z-10 space-y-4">
            <blockquote className="text-lg leading-relaxed text-muted-foreground">
              &ldquo;Dance is the hidden language of the soul.&rdquo;
            </blockquote>
            <p className="text-sm text-muted-foreground/60">
              — Martha Graham
            </p>
          </div>

          {/* Abstract decorative shapes */}
          <div className="relative z-10 flex gap-3">
            <div className="size-3 rounded-full bg-primary/40" />
            <div className="size-3 rounded-full bg-secondary/40" />
            <div className="size-3 rounded-full bg-primary/20" />
          </div>
        </div>

        {/* ── Form Side ──────────────────────────── */}
        <div className="flex w-full flex-col justify-center px-6 py-12 md:w-1/2 md:px-12">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 text-center font-heading text-xl font-bold tracking-tight md:hidden"
          >
            attan<span className="text-primary">DANCE</span>
          </Link>

          <div className="mb-8 space-y-1">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footerLabel}{' '}
            <Link
              href={footerHref}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {footerHref === '/register' ? 'Register' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
