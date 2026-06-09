import Link from 'next/link';
import { IconArrowDown } from '@tabler/icons-react';

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      {/* Floating decorative elements */}
      <div className="absolute left-1/4 top-1/4 size-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute right-1/4 bottom-1/3 size-96 rounded-full bg-secondary/5 blur-3xl animate-float animate-delay-500" />

      <div className="relative z-10 max-w-3xl space-y-8">
        <div className="space-y-4">
          <h1 className="animate-fade-down font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Move With{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              attanDANCE
            </span>
          </h1>
          <p className="animate-fade-up animate-delay-200 mx-auto max-w-xl text-lg text-muted-foreground sm:text-xl">
            Join the city&apos;s most vibrant dance community. Train, connect,
            and express yourself through movement.
          </p>
        </div>

        <div className="animate-fade-up animate-delay-400 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Join Now
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
          >
            Learn More
            <IconArrowDown size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
