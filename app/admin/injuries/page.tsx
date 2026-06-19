import { InjuriesManager } from '@/components/features/admin/injuries-manager';
import { getAdminArtists, getAdminInjuries } from '@/lib/admin-data';

export default async function AdminInjuriesPage() {
  const [injuries, artists] = await Promise.all([
    getAdminInjuries(),
    getAdminArtists(),
  ]);

  return <InjuriesManager injuries={injuries} artists={artists} />;
}
