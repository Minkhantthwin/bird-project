import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role !== 'Admin') redirect('/dashboard');

  return (
    <DashboardShell
      user={session}
      variant="admin"
      navItems={[
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/users', label: 'Users', icon: '👥' },
        { href: '/admin/artists', label: 'Artists', icon: '🎨' },
        { href: '/admin/attendance', label: 'Attendance', icon: '📋' },
        { href: '/admin/injuries', label: 'Injuries', icon: '🏥' },
        { href: '/admin/posts', label: 'Posts', icon: '📝' },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
