import { DataTable } from '@/components/features/shared/data-table';
import { dummyData } from '@/lib/dummy-data';

export default function InstructorPostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          My Posts
        </h1>
        <p className="text-sm text-muted-foreground">
          Create and manage your posts.
        </p>
      </div>
      <DataTable
        keyField="id"
        columns={[
          { header: 'Title', accessor: 'title' },
          {
            header: 'Body',
            accessor: (row) =>
              row.body.length > 100
                ? row.body.slice(0, 100) + '…'
                : row.body,
            className: 'max-w-[300px] text-muted-foreground',
          },
          { header: 'Created', accessor: 'created_at' },
        ]}
        data={dummyData.posts.slice(0, 3)}
      />
    </div>
  );
}
