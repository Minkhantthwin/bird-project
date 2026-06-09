import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { dummyData } from '@/lib/dummy-data';

export default function AdminInjuriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Injury Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Track and manage all reported injuries.
        </p>
      </div>
      <DataTable
        keyField="id"
        columns={[
          {
            header: 'Artist',
            accessor: (row) => {
              const artist = dummyData.artistRecords.find(
                (a) => a.id === row.artist_record_id,
              );
              const user = artist
                ? dummyData.users.find((u) => u.id === artist.user_id)
                : null;
              return user?.full_name ?? 'Unknown';
            },
          },
          { header: 'Date', accessor: 'incident_date' },
          { header: 'Severity', accessor: 'severity' },
          {
            header: 'Status',
            accessor: (row) => <StatusBadge status={row.status} />,
          },
          {
            header: 'Description',
            accessor: (row) => row.description,
            className: 'max-w-[250px] truncate text-muted-foreground',
          },
        ]}
        data={dummyData.injuries}
      />
    </div>
  );
}
