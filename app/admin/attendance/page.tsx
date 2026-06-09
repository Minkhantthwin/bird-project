import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { dummyData } from '@/lib/dummy-data';

export default function AdminAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Attendance Log
        </h1>
        <p className="text-sm text-muted-foreground">
          Full attendance history across all sessions.
        </p>
      </div>
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
            className: 'max-w-[250px] truncate text-muted-foreground',
          },
        ]}
        data={dummyData.attendanceRecords}
      />
    </div>
  );
}
