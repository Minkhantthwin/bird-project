import { InstructorAttendanceManager } from '@/components/features/instructor/attendance-manager';
import {
  getInstructorArtists,
  getInstructorAttendance,
} from '@/lib/instructor-data';

export default async function InstructorAttendancePage() {
  const [attendance, artists] = await Promise.all([
    getInstructorAttendance(),
    getInstructorArtists(),
  ]);

  return (
    <InstructorAttendanceManager attendance={attendance} artists={artists} />
  );
}
