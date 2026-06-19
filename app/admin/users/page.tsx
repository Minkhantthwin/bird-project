import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { getAdminUsers } from '@/lib/admin-data';

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage all platform users.
        </p>
      </div>
      <DataTable
        keyField="id"
        columns={[
          { header: 'Name', accessor: 'full_name' },
          { header: 'Email', accessor: 'email' },
          {
            header: 'Role',
            accessor: (row) => <StatusBadge status={row.role_name} />,
          },
          { header: 'Joined', accessor: 'created_at' },
        ]}
        data={users}
        emptyMessage="No users found in Supabase."
      />
    </div>
  );
}
