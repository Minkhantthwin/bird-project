import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');

  return (
    <DashboardShell
      user={session}
      variant="member"
      navItems={[
        { href: '/dashboard', label: 'Feed', icon: '📰' },
        { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
        { href: '/dashboard/attendance', label: 'Attendance', icon: '📋' },
        { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
