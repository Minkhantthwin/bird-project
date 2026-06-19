import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { getAdminAttendance } from '@/lib/admin-data';

export default async function AdminAttendancePage() {
  const attendance = await getAdminAttendance();

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
            className: 'max-w-[250px] truncate text-muted-foreground',
          },
        ]}
        data={attendance}
        emptyMessage="No attendance records found in Supabase."
      />
    </div>
  );
}
