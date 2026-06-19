import { DataTable } from '@/components/features/shared/data-table';
import { getAdminArtists } from '@/lib/admin-data';

export default async function AdminArtistsPage() {
  const artists = await getAdminArtists();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Artist Records
        </h1>
        <p className="text-sm text-muted-foreground">
          All registered artists and their specialties.
        </p>
      </div>
      <DataTable
        keyField="id"
        columns={[
          {
            header: 'Name',
            accessor: 'full_name',
          },
          { header: 'Stage Name', accessor: 'stage_name' },
          { header: 'Specialty', accessor: 'specialty' },
          { header: 'Join Date', accessor: 'join_date' },
        ]}
        data={artists}
        emptyMessage="No artist records found in Supabase."
      />
    </div>
  );
}
