import { DataTable } from '@/components/features/shared/data-table';
import { dummyData } from '@/lib/dummy-data';

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Content Moderation
        </h1>
        <p className="text-sm text-muted-foreground">
          All posts across the platform.
        </p>
      </div>
      <DataTable
        keyField="id"
        columns={[
          {
            header: 'Author',
            accessor: (row) => {
              const user = dummyData.users.find((u) => u.id === row.user_id);
              return user?.full_name ?? 'Unknown';
            },
          },
          { header: 'Title', accessor: 'title' },
          {
            header: 'Body',
            accessor: (row) =>
              row.body.length > 80
                ? row.body.slice(0, 80) + '…'
                : row.body,
            className: 'max-w-[300px] text-muted-foreground',
          },
          { header: 'Created', accessor: 'created_at' },
        ]}
        data={dummyData.posts}
      />
    </div>
  );
}
