import Link from 'next/link';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/lib/auth/actions';
import type { SessionUser } from '@/lib/auth/types';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface DashboardShellProps {
  user: SessionUser;
  variant: 'admin' | 'instructor' | 'member';
  navItems: NavItem[];
  children: React.ReactNode;
}

const variantAccents: Record<DashboardShellProps['variant'], string> = {
  admin: 'bg-rose-500',
  instructor: 'bg-sky-500',
  member: 'bg-emerald-500',
};

const variantTexts: Record<DashboardShellProps['variant'], string> = {
  admin: 'text-rose-500',
  instructor: 'text-sky-500',
  member: 'text-emerald-500',
};

export function DashboardShell({
  user,
  variant,
  navItems,
  children,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Sidebar ─────────────────────────── */}
      <aside className="animate-fade-right flex w-60 shrink-0 flex-col border-r border-border bg-card/40 backdrop-blur-xl">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 border-b border-border px-5 py-4"
        >
          <span className="font-heading text-lg font-bold tracking-tight">
            attan<span className="text-primary">DANCE</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors',
                'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-xs font-bold text-white',
                variantAccents[variant],
              )}
            >
              {user.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.fullName}</p>
              <p className={cn('text-xs font-medium', variantTexts[variant])}>
                {user.role}
              </p>
            </div>
          </div>

          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-xl px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              🚪 Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────── */}
      <main className="animate-fade-in animate-delay-200 flex-1 overflow-auto">
        <div className="mx-auto max-w-6xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
