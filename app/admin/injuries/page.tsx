import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { getAdminInjuries } from '@/lib/admin-data';

export default async function AdminInjuriesPage() {
  const injuries = await getAdminInjuries();

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
            accessor: 'artist_name',
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
        data={injuries}
        emptyMessage="No injury records found in Supabase."
      />
    </div>
  );
}
