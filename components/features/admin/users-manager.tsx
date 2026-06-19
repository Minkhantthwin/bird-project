'use client';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { EntityDialog, DeleteDialog } from './entity-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createUserAction,
  deleteUserAction,
  updateUserAction,
} from '@/lib/admin-actions';
import type { AdminUser } from '@/lib/admin-data';

const selectClass =
  'h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

function UserFields({ user }: { user?: AdminUser }) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`fullName-${user?.id ?? 'new'}`}>Full name</Label>
        <Input
          id={`fullName-${user?.id ?? 'new'}`}
          name="fullName"
          defaultValue={user?.full_name}
          autoComplete="name"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`email-${user?.id ?? 'new'}`}>Email</Label>
        <Input
          id={`email-${user?.id ?? 'new'}`}
          name="email"
          type="email"
          defaultValue={user?.email}
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`role-${user?.id ?? 'new'}`}>Role</Label>
        <select
          id={`role-${user?.id ?? 'new'}`}
          name="role"
          className={selectClass}
          defaultValue={user?.role_name === 'Unknown' ? 'Member' : user?.role_name}
          required
        >
          <option value="Admin">Admin</option>
          <option value="Instructor">Instructor</option>
          <option value="Member">Member</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`password-${user?.id ?? 'new'}`}>
          Password {user ? '(leave blank to keep current)' : ''}
        </Label>
        <Input
          id={`password-${user?.id ?? 'new'}`}
          name="password"
          type="password"
          autoComplete="new-password"
          required={!user}
          minLength={user ? undefined : 8}
        />
      </div>
    </>
  );
}

export function UsersManager({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and manage Supabase Auth users and their roles.
          </p>
        </div>
        <EntityDialog
          trigger={
            <Button>
              <IconPlus /> Add user
            </Button>
          }
          title="Create user"
          description="Create a confirmed Supabase Auth account and profile."
          submitLabel="Create user"
          pendingLabel="Creating…"
          successMessage="User created."
          action={createUserAction}
        >
          <UserFields />
        </EntityDialog>
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
          {
            header: 'Actions',
            accessor: (row) => (
              <div className="flex items-center gap-1">
                <EntityDialog
                  trigger={
                    <Button variant="ghost" size="icon-sm" aria-label={`Edit ${row.full_name}`}>
                      <IconEdit />
                    </Button>
                  }
                  title="Edit user"
                  description="Update this user's Auth account, profile, and role."
                  submitLabel="Save changes"
                  pendingLabel="Saving…"
                  successMessage="User updated."
                  action={updateUserAction}
                  hiddenFields={{ id: row.id }}
                >
                  <UserFields user={row} />
                </EntityDialog>
                <DeleteDialog
                  id={row.id}
                  name={row.full_name}
                  entity="user"
                  action={deleteUserAction}
                  cascadeWarning="Their artist record and related data will also be removed."
                  trigger={
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      disabled={row.id === currentUserId}
                      aria-label={`Delete ${row.full_name}`}
                      title={row.id === currentUserId ? 'You cannot delete your own account' : undefined}
                    >
                      <IconTrash />
                    </Button>
                  }
                />
              </div>
            ),
          },
        ]}
        data={users}
        emptyMessage="No users found in Supabase."
      />
    </div>
  );
}
