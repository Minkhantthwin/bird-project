import { AttendanceManager } from '@/components/features/admin/attendance-manager';
import { getAdminAttendance, getAdminArtists } from '@/lib/admin-data';

export default async function AdminAttendancePage() {
  const [attendance, artists] = await Promise.all([
    getAdminAttendance(),
    getAdminArtists(),
  ]);

  return <AttendanceManager attendance={attendance} artists={artists} />;
}
