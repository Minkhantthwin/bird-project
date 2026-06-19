'use client';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/features/shared/data-table';
import { EntityDialog, DeleteDialog } from './entity-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createPostAction,
  deletePostAction,
  updatePostAction,
} from '@/lib/admin-actions';
import type { AdminPost, AdminUser } from '@/lib/admin-data';

const selectClass =
  'h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

function PostFields({
  users,
  post,
}: {
  users: AdminUser[];
  post?: AdminPost;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`post-user-${post?.id ?? 'new'}`}>Author</Label>
        <select
          id={`post-user-${post?.id ?? 'new'}`}
          name="userId"
          className={selectClass}
          defaultValue={post?.user_id ?? ''}
          required
        >
          <option value="" disabled>
            Select an author
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name} ({user.role_name})
            </option>
          ))}
        </select>
      </div>
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
          className={`${selectClass} min-h-[120px] py-2`}
          defaultValue={post?.body ?? ''}
          placeholder="Post content"
          required
        />
      </div>
    </>
  );
}

export function PostsManager({
  posts,
  users,
}: {
  posts: AdminPost[];
  users: AdminUser[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Content Moderation
          </h1>
          <p className="text-sm text-muted-foreground">
            All posts across the platform.
          </p>
        </div>
        <EntityDialog
          trigger={
            <Button disabled={users.length === 0}>
              <IconPlus /> Create post
            </Button>
          }
          title="Create post"
          description="Create a new post on behalf of a user."
          submitLabel="Create post"
          pendingLabel="Creating…"
          successMessage="Post created."
          action={createPostAction}
        >
          <PostFields users={users} />
        </EntityDialog>
      </div>

      <DataTable
        keyField="id"
        columns={[
          { header: 'Author', accessor: 'author_name' },
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
                  action={updatePostAction}
                  hiddenFields={{ id: row.id }}
                >
                  <PostFields users={users} post={row} />
                </EntityDialog>
                <DeleteDialog
                  id={row.id}
                  name={`"${row.title}" by ${row.author_name}`}
                  entity="post"
                  action={deletePostAction}
                  cascadeWarning="All comments and reactions on this post will also be removed."
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
