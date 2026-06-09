import { DataTable } from '@/components/features/shared/data-table';
import { dummyData } from '@/lib/dummy-data';

export default function AdminArtistsPage() {
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
            accessor: (row) => {
              const user = dummyData.users.find((u) => u.id === row.user_id);
              return user?.full_name ?? 'Unknown';
            },
          },
          { header: 'Stage Name', accessor: 'stage_name' },
          { header: 'Specialty', accessor: 'specialty' },
          { header: 'Join Date', accessor: 'join_date' },
        ]}
        data={dummyData.artistRecords}
      />
    </div>
  );
}
