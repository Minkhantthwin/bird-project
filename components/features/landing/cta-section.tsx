import Link from 'next/link';

export function CtaSection() {
  return (
    <section id="cta" className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <div className="animate-fade-up rounded-4xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 p-12 backdrop-blur-xl">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              move
            </span>
            ?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join attanDANCE today and become part of something bigger.
            Your crew is waiting.
          </p>
          <div className="mt-8">
            <Link
              href="/register"
              className="inline-flex rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Join the Crew
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
