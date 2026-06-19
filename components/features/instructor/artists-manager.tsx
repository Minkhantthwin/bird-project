'use client';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/features/shared/data-table';
import { EntityDialog, DeleteDialog } from '@/components/features/admin/entity-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createInstructorArtistAction,
  deleteInstructorArtistAction,
  updateInstructorArtistAction,
} from '@/lib/instructor-actions';
import type { AdminArtist, AdminUser } from '@/lib/admin-data';

const selectClass =
  'h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

function ArtistFields({
  artist,
  users,
}: {
  artist?: AdminArtist;
  users: AdminUser[];
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`artist-user-${artist?.id ?? 'new'}`}>User</Label>
        <select
          id={`artist-user-${artist?.id ?? 'new'}`}
          name="userId"
          className={selectClass}
          defaultValue={artist?.user_id ?? ''}
          required
        >
          <option value="" disabled>
            Select member user
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name} ({user.email})
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`stageName-${artist?.id ?? 'new'}`}>Stage name</Label>
        <Input
          id={`stageName-${artist?.id ?? 'new'}`}
          name="stageName"
          defaultValue={artist?.stage_name ?? ''}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`specialty-${artist?.id ?? 'new'}`}>Specialty</Label>
        <Input
          id={`specialty-${artist?.id ?? 'new'}`}
          name="specialty"
          defaultValue={artist?.specialty ?? ''}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`joinDate-${artist?.id ?? 'new'}`}>Join date</Label>
        <Input
          id={`joinDate-${artist?.id ?? 'new'}`}
          name="joinDate"
          type="date"
          defaultValue={artist?.join_date}
          required
        />
      </div>
    </>
  );
}

export function InstructorArtistsManager({
  artists,
  users,
}: {
  artists: AdminArtist[];
  users: AdminUser[];
}) {
  const assignedUserIds = new Set(artists.map((artist) => artist.user_id));
  const availableUsers = users.filter((user) => !assignedUserIds.has(user.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            My Artists
          </h1>
          <p className="text-sm text-muted-foreground">
            Artists assigned to your instructor account.
          </p>
        </div>
        <EntityDialog
          trigger={
            <Button disabled={availableUsers.length === 0}>
              <IconPlus /> Add artist
            </Button>
          }
          title="Create artist"
          description="Attach an artist record to a member account."
          submitLabel="Create artist"
          pendingLabel="Creating…"
          successMessage="Artist created."
          action={createInstructorArtistAction}
        >
          <ArtistFields users={availableUsers} />
        </EntityDialog>
      </div>

      <DataTable
        keyField="id"
        columns={[
          { header: 'Name', accessor: 'full_name' },
          { header: 'Stage Name', accessor: (row) => row.stage_name ?? '—' },
          { header: 'Specialty', accessor: (row) => row.specialty ?? '—' },
          { header: 'Join Date', accessor: 'join_date' },
          {
            header: 'Actions',
            accessor: (row) => {
              const editUsers = users.filter(
                (user) => user.id === row.user_id || !assignedUserIds.has(user.id),
              );

              return (
                <div className="flex items-center gap-1">
                  <EntityDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${row.full_name}`}
                      >
                        <IconEdit />
                      </Button>
                    }
                    title="Edit artist"
                    description="Update this artist record."
                    submitLabel="Save changes"
                    pendingLabel="Saving…"
                    successMessage="Artist updated."
                    action={updateInstructorArtistAction}
                    hiddenFields={{ id: row.id }}
                  >
                    <ArtistFields artist={row} users={editUsers} />
                  </EntityDialog>
                  <DeleteDialog
                    id={row.id}
                    name={row.stage_name || row.full_name}
                    entity="artist"
                    action={deleteInstructorArtistAction}
                    cascadeWarning="Attendance and injury records for this artist will also be removed."
                    trigger={
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        aria-label={`Delete ${row.full_name}`}
                      >
                        <IconTrash />
                      </Button>
                    }
                  />
                </div>
              );
            },
          },
        ]}
        data={artists}
        emptyMessage="No artists assigned to you in Supabase."
      />
    </div>
  );
}
