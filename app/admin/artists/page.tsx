import { ArtistsManager } from '@/components/features/admin/artists-manager';
import { getAdminArtists, getAdminUsers } from '@/lib/admin-data';

export default async function AdminArtistsPage() {
  const [artists, users] = await Promise.all([
    getAdminArtists(),
    getAdminUsers(),
  ]);

  return <ArtistsManager artists={artists} users={users} />;
}
