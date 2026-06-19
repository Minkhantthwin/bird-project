import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { DashboardShell } from '@/components/layout/dashboard-shell';

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect('/login');
  if (session.role !== 'Instructor') redirect('/dashboard');

  return (
    <DashboardShell
      user={session}
      variant="instructor"
      navItems={[
        { href: '/instructor', label: 'Dashboard', icon: '📊' },
        { href: '/instructor/attendance', label: 'Attendance', icon: '📋' },
        { href: '/instructor/injuries', label: 'Injuries', icon: '🏥' },
        { href: '/instructor/artists', label: 'My Artists', icon: '🎨' },
        { href: '/instructor/posts', label: 'My Posts', icon: '📝' },
        { href: '/instructor/posts/all', label: 'All Posts', icon: '📰' },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
