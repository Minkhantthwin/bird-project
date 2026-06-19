import { InstructorInjuriesManager } from '@/components/features/instructor/injuries-manager';
import { getInstructorArtists, getInstructorInjuries } from '@/lib/instructor-data';

export default async function InstructorInjuriesPage() {
  const [injuries, artists] = await Promise.all([
    getInstructorInjuries(),
    getInstructorArtists(),
  ]);

  return <InstructorInjuriesManager injuries={injuries} artists={artists} />;
}
