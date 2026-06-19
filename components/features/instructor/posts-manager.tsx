'use client';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/features/shared/data-table';
import { EntityDialog, DeleteDialog } from '@/components/features/admin/entity-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createInstructorPostAction,
  deleteInstructorPostAction,
  updateInstructorPostAction,
} from '@/lib/instructor-actions';
import type { AdminPost } from '@/lib/admin-data';

const controlClass =
  'h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

function PostFields({ post }: { post?: AdminPost }) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`post-title-${post?.id ?? 'new'}`}>Title</Label>
        <Input
          id={`post-title-${post?.id ?? 'new'}`}
          name="title"
          defaultValue={post?.title ?? ''}
          placeholder="Post title"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`post-body-${post?.id ?? 'new'}`}>Body</Label>
        <textarea
          id={`post-body-${post?.id ?? 'new'}`}
          name="body"
          className={`${controlClass} min-h-[120px] py-2`}
          defaultValue={post?.body ?? ''}
          placeholder="Share update with members"
          required
        />
      </div>
    </>
  );
}

export function InstructorPostsManager({ posts }: { posts: AdminPost[] }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            My Posts
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage posts from your instructor account.
          </p>
        </div>
        <EntityDialog
          trigger={
            <Button>
              <IconPlus /> Create post
            </Button>
          }
          title="Create post"
          description="Publish a new post as instructor."
          submitLabel="Create post"
          pendingLabel="Creating…"
          successMessage="Post created."
          action={createInstructorPostAction}
        >
          <PostFields />
        </EntityDialog>
      </div>

      <DataTable
        keyField="id"
        columns={[
          { header: 'Title', accessor: 'title' },
          {
            header: 'Body',
            accessor: (row) =>
              row.body.length > 80 ? row.body.slice(0, 80) + '…' : row.body,
            className: 'max-w-[300px] text-muted-foreground',
          },
          { header: 'Created', accessor: 'created_at' },
          {
            header: 'Actions',
            accessor: (row) => (
              <div className="flex items-center gap-1">
                <EntityDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit "${row.title}"`}
                    >
                      <IconEdit />
                    </Button>
                  }
                  title="Edit post"
                  description="Update this post."
                  submitLabel="Save changes"
                  pendingLabel="Saving…"
                  successMessage="Post updated."
                  action={updateInstructorPostAction}
                  hiddenFields={{ id: row.id }}
                >
                  <PostFields post={row} />
                </EntityDialog>
                <DeleteDialog
                  id={row.id}
                  name={`"${row.title}"`}
                  entity="post"
                  action={deleteInstructorPostAction}
                  cascadeWarning="Comments and reactions on this post will also be removed."
                  trigger={
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      aria-label={`Delete "${row.title}"`}
                    >
                      <IconTrash />
                    </Button>
                  }
                />
              </div>
            ),
          },
        ]}
        data={posts}
        emptyMessage="No posts found in Supabase."
      />
    </div>
  );
}
