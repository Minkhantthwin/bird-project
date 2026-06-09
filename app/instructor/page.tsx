import { getSession } from '@/lib/auth/session';
import { StatCard } from '@/components/features/shared/stat-card';
import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { dummyData } from '@/lib/dummy-data';

export default async function InstructorDashboardPage() {
  const session = await getSession();

  const totalAttendance = dummyData.attendanceRecords.length;
  const presentCount = dummyData.attendanceRecords.filter(
    (a) => a.status === 'Present',
  ).length;
  const rate = Math.round((presentCount / totalAttendance) * 100) || 100;

  const recentAttendance = dummyData.attendanceRecords.slice(-5).reverse();

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
        <StatCard label="My Artists" value={dummyData.artistRecords.length} icon="🎨" />
        <StatCard
          label="Total Sessions"
          value={totalAttendance}
          icon="📋"
        />
        <StatCard
          label="Attendance Rate"
          value={`${rate}%`}
          icon="✅"
          trend={
            rate >= 80
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
              accessor: (row) => {
                const artist = dummyData.artistRecords.find(
                  (a) => a.id === row.artist_record_id,
                );
                const user = artist
                  ? dummyData.users.find((u) => u.id === artist.user_id)
                  : null;
                return user?.full_name ?? 'Unknown';
              },
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
          data={recentAttendance}
        />
      </section>
    </div>
  );
}
