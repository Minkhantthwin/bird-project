import { DataTable } from '@/components/features/shared/data-table';
import { getAdminPosts } from '@/lib/admin-data';

export default async function AdminPostsPage() {
  const posts = await getAdminPosts();

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
            accessor: 'author_name',
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
        data={posts}
        emptyMessage="No posts found in Supabase."
      />
    </div>
  );
}
