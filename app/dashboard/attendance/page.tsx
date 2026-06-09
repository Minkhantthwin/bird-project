import { getSession } from '@/lib/auth/session';
import { AttendanceTable } from '@/components/features/dashboard/attendance-table';

export default async function MyAttendancePage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          My Attendance
        </h1>
        <p className="text-sm text-muted-foreground">
          Your session attendance history.
        </p>
      </div>
      <AttendanceTable userId={session!.id} />
    </div>
  );
}
