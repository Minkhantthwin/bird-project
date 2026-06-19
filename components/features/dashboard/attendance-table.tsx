import { StatusBadge } from '@/components/features/shared/status-badge';
import { DataTable } from '@/components/features/shared/data-table';
import { getUserAttendanceData } from '@/lib/data-service';

interface AttendanceTableProps {
  userId: string;
}

export async function AttendanceTable({ userId }: AttendanceTableProps) {
  const data = await getUserAttendanceData(userId);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Total Sessions</p>
          <p className="mt-1 font-heading text-xl font-bold">
            {data.totalSessions}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Attendance Rate</p>
          <p className="mt-1 font-heading text-xl font-bold">{data.attendanceRate}%</p>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <p className="text-xs text-muted-foreground">Present Sessions</p>
          <p className="mt-1 font-heading text-xl font-bold">{data.presentCount}</p>
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
        data={data.records}
        emptyMessage="No attendance records found."
      />
    </div>
  );
}
