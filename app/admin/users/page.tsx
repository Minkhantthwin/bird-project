import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { dummyData } from '@/lib/dummy-data';

export default function AdminUsersPage() {
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
            accessor: (row) => {
              const role = dummyData.roles.find((r) => r.id === row.role_id);
              return (
                <StatusBadge
                  status={
                    role?.name === 'Admin'
                      ? 'Present'
                      : role?.name === 'Instructor'
                        ? 'Late'
                        : 'Absent'
                  }
                />
              );
            },
          },
          { header: 'Joined', accessor: 'created_at' },
        ]}
        data={dummyData.users}
      />
    </div>
  );
}
