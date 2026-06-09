import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link href="/" className="font-heading text-lg font-bold tracking-tight">
          attan<span className="text-primary">DANCE</span>
        </Link>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} attanDANCE. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
