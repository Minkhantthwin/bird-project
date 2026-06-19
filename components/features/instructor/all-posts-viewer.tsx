import { DataTable } from '@/components/features/shared/data-table';
import type { AdminPost } from '@/lib/admin-data';

export function AllPostsViewer({ posts }: { posts: AdminPost[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          All Posts
        </h1>
        <p className="text-sm text-muted-foreground">
          Browse posts from all members and instructors across the platform.
        </p>
      </div>

      <DataTable
        keyField="id"
        columns={[
          { header: 'Author', accessor: 'author_name' },
          { header: 'Title', accessor: 'title' },
          {
            header: 'Body',
            accessor: (row) =>
              row.body.length > 120
                ? row.body.slice(0, 120) + '…'
                : row.body,
            className: 'max-w-[400px] text-muted-foreground',
          },
          { header: 'Created', accessor: 'created_at' },
        ]}
        data={posts}
        emptyMessage="No posts found."
      />
    </div>
  );
}
