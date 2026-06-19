import { StatCard } from '@/components/features/shared/stat-card';
import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { getSession } from '@/lib/auth/session';
import { getInstructorDashboardData } from '@/lib/instructor-data';

export default async function InstructorDashboardPage() {
  const [session, dashboard] = await Promise.all([
    getSession(),
    getInstructorDashboardData(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Welcome, {session?.fullName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Instructor Dashboard Overview
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <a
          href="/instructor/attendance"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          📋 Take Attendance
        </a>
        <a
          href="/instructor/injuries"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500 hover:bg-amber-500/20 transition-colors"
        >
          🏥 Log Injury
        </a>
        <a
          href="/instructor/posts"
          className="inline-flex items-center gap-2 rounded-2xl bg-sky-500/10 px-4 py-2 text-sm font-medium text-sky-500 hover:bg-sky-500/20 transition-colors"
        >
          📝 New Post
        </a>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="My Artists" value={dashboard.totalArtists} icon="🎨" />
        <StatCard label="Total Sessions" value={dashboard.totalSessions} icon="📋" />
        <StatCard
          label="Attendance Rate"
          value={`${dashboard.attendanceRate}%`}
          icon="✅"
          trend={
            dashboard.attendanceRate >= 80
              ? { value: 'Good', positive: true }
              : { value: 'Needs work', positive: false }
          }
        />
      </div>

      {/* Recent Attendance */}
      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">
          Recent Attendance
        </h2>
        <DataTable
          keyField="id"
          columns={[
            {
              header: 'Artist',
              accessor: 'artist_name',
            },
            { header: 'Date', accessor: 'session_date' },
            {
              header: 'Status',
              accessor: (row) => <StatusBadge status={row.status} />,
            },
            {
              header: 'Notes',
              accessor: (row) => row.notes ?? '—',
              className: 'max-w-[200px] truncate text-muted-foreground',
            },
          ]}
          data={dashboard.recentAttendance}
          emptyMessage="No attendance records found in Supabase."
        />
      </section>
    </div>
  );
}
