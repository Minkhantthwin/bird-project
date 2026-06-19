'use client';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/features/shared/data-table';
import { EntityDialog, DeleteDialog } from './entity-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createArtistAction,
  deleteArtistAction,
  updateArtistAction,
} from '@/lib/admin-actions';
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
  const memberUsers = users.filter(
    (user) => user.role_name === 'Member' || user.id === artist?.user_id,
  );
  const instructorUsers = users.filter(
    (user) => user.role_name === 'Instructor',
  );

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
          <option value="" disabled>Select a user</option>
          {memberUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name} ({user.email})
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`artist-instructor-${artist?.id ?? 'new'}`}>
          Instructor
        </Label>
        <select
          id={`artist-instructor-${artist?.id ?? 'new'}`}
          name="instructorId"
          className={selectClass}
          defaultValue={artist?.instructor_id ?? ''}
        >
          <option value="">Unassigned</option>
          {instructorUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name}
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

export function ArtistsManager({
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
          <h1 className="font-heading text-2xl font-bold tracking-tight">Artist Records</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage artist profiles and specialties.
          </p>
        </div>
        <EntityDialog
          trigger={
            <Button disabled={availableUsers.length === 0}>
              <IconPlus /> Add artist
            </Button>
          }
          title="Create artist"
          description="Attach a new artist record to an existing user."
          submitLabel="Create artist"
          pendingLabel="Creating…"
          successMessage="Artist created."
          action={createArtistAction}
        >
          <ArtistFields users={availableUsers} />
        </EntityDialog>
      </div>

      <DataTable
        keyField="id"
        columns={[
          { header: 'Name', accessor: 'full_name' },
          {
            header: 'Instructor',
            accessor: (row) => row.instructor_name ?? 'Unassigned',
          },
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
                    trigger={<Button variant="ghost" size="icon-sm" aria-label={`Edit ${row.full_name}`}><IconEdit /></Button>}
                    title="Edit artist"
                    description="Update this artist record."
                    submitLabel="Save changes"
                    pendingLabel="Saving…"
                    successMessage="Artist updated."
                    action={updateArtistAction}
                    hiddenFields={{ id: row.id }}
                  >
                    <ArtistFields artist={row} users={editUsers} />
                  </EntityDialog>
                  <DeleteDialog
                    id={row.id}
                    name={row.stage_name || row.full_name}
                    entity="artist"
                    action={deleteArtistAction}
                    cascadeWarning="Their attendance and injury records will also be removed."
                    trigger={<Button variant="destructive" size="icon-sm" aria-label={`Delete ${row.full_name}`}><IconTrash /></Button>}
                  />
                </div>
              );
            },
          },
        ]}
        data={artists}
        emptyMessage="No artist records found in Supabase."
      />
    </div>
  );
}
