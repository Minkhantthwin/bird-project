import { InstructorArtistsManager } from '@/components/features/instructor/artists-manager';
import {
  getInstructorArtists,
  getInstructorArtistUsers,
} from '@/lib/instructor-data';

export default async function InstructorArtistsPage() {
  const [artists, users] = await Promise.all([
    getInstructorArtists(),
    getInstructorArtistUsers(),
  ]);

  return <InstructorArtistsManager artists={artists} users={users} />;
}
