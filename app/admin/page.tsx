import { getSession } from '@/lib/auth/session';
import { StatCard } from '@/components/features/shared/stat-card';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { DataTable } from '@/components/features/shared/data-table';
import { dummyData } from '@/lib/dummy-data';

export default async function AdminDashboardPage() {
  const session = await getSession();

  const totalUsers = dummyData.users.length;
  const totalArtists = dummyData.artistRecords.length;
  const totalPosts = dummyData.posts.length;
  const recoveringInjuries = dummyData.injuries.filter(
    (i) => i.status === 'Recovering' || i.status === 'Under Treatment',
  ).length;

  const recentAttendance = dummyData.attendanceRecords.slice(-5).reverse();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Welcome, {session?.fullName}
        </h1>
        <p className="text-sm text-muted-foreground">Admin Dashboard Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Members" value={totalUsers} icon="👥" />
        <StatCard label="Active Artists" value={totalArtists} icon="🎨" />
        <StatCard label="Total Posts" value={totalPosts} icon="📝" />
        <StatCard
          label="Active Injuries"
          value={recoveringInjuries}
          icon="🏥"
          trend={
            recoveringInjuries > 0
              ? { value: 'Needs attention', positive: false }
              : undefined
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

      {/* Injury Summary */}
      <section>
        <h2 className="mb-3 font-heading text-lg font-semibold">
          Injury Summary
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
            { header: 'Date', accessor: 'incident_date' },
            {
              header: 'Severity',
              accessor: (row) => row.severity,
            },
            {
              header: 'Status',
              accessor: (row) => <StatusBadge status={row.status} />,
            },
            {
              header: 'Description',
              accessor: (row) => row.description,
              className: 'max-w-[200px] truncate text-muted-foreground',
            },
          ]}
          data={dummyData.injuries}
        />
      </section>
    </div>
  );
}
