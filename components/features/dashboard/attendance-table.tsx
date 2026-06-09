import { dummyData } from '@/lib/dummy-data';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { DataTable } from '@/components/features/shared/data-table';

interface AttendanceTableProps {
  userId: string;
}

export function AttendanceTable({ userId }: AttendanceTableProps) {
  const userAttendance = dummyData.attendanceRecords.filter((a) => {
    const artist = dummyData.artistRecords.find(
      (ar) => ar.id === a.artist_record_id,
    );
    return artist?.user_id === userId;
  });

  const presentCount = userAttendance.filter((a) => a.status === 'Present').length;
  const rate =
    userAttendance.length > 0
      ? Math.round((presentCount / userAttendance.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Total Sessions</p>
          <p className="mt-1 font-heading text-xl font-bold">
            {userAttendance.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Attendance Rate</p>
          <p className="mt-1 font-heading text-xl font-bold">{rate}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Present Sessions</p>
          <p className="mt-1 font-heading text-xl font-bold">{presentCount}</p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        keyField="id"
        columns={[
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
        data={userAttendance.sort(
          (a, b) =>
            new Date(b.session_date).getTime() -
            new Date(a.session_date).getTime(),
        )}
        emptyMessage="No attendance records found."
      />
    </div>
  );
}
