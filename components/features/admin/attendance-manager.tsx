'use client';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { EntityDialog, DeleteDialog } from './entity-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createAttendanceAction,
  deleteAttendanceAction,
  updateAttendanceAction,
} from '@/lib/admin-actions';
import type { AdminArtist, AdminAttendance } from '@/lib/admin-data';

const selectClass =
  'h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

function AttendanceFields({
  artists,
  record,
}: {
  artists: AdminArtist[];
  record?: AdminAttendance;
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`artist-${record?.id ?? 'new'}`}>Artist</Label>
        <select
          id={`artist-${record?.id ?? 'new'}`}
          name="artistRecordId"
          className={selectClass}
          defaultValue={record?.artist_record_id ?? ''}
          required
        >
          <option value="" disabled>
            Select an artist
          </option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.full_name}
              {artist.stage_name ? ` (${artist.stage_name})` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`sessionDate-${record?.id ?? 'new'}`}>
          Session date & time
        </Label>
        <Input
          id={`sessionDate-${record?.id ?? 'new'}`}
          name="sessionDate"
          type="datetime-local"
          defaultValue={
            record?.session_date
              ? new Date(record.session_date).toISOString().slice(0, 16)
              : ''
          }
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`status-${record?.id ?? 'new'}`}>Status</Label>
        <select
          id={`status-${record?.id ?? 'new'}`}
          name="status"
          className={selectClass}
          defaultValue={record?.status ?? 'Present'}
          required
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`notes-${record?.id ?? 'new'}`}>Notes</Label>
        <Input
          id={`notes-${record?.id ?? 'new'}`}
          name="notes"
          defaultValue={record?.notes ?? ''}
          placeholder="Optional instructor notes"
        />
      </div>
    </>
  );
}

export function AttendanceManager({
  attendance,
  artists,
}: {
  attendance: AdminAttendance[];
  artists: AdminArtist[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Attendance Log
          </h1>
          <p className="text-sm text-muted-foreground">
            Full attendance history across all sessions.
          </p>
        </div>
        <EntityDialog
          trigger={
            <Button disabled={artists.length === 0}>
              <IconPlus /> Add record
            </Button>
          }
          title="Create attendance record"
          description="Log an attendance entry for an artist session."
          submitLabel="Create record"
          pendingLabel="Creating…"
          successMessage="Attendance record created."
          action={createAttendanceAction}
        >
          <AttendanceFields artists={artists} />
        </EntityDialog>
      </div>

      <DataTable
        keyField="id"
        columns={[
          { header: 'Artist', accessor: 'artist_name' },
          { header: 'Date', accessor: 'session_date' },
          {
            header: 'Status',
            accessor: (row) => <StatusBadge status={row.status} />,
          },
          {
            header: 'Notes',
            accessor: (row) => row.notes ?? '—',
            className: 'max-w-[250px] truncate text-muted-foreground',
          },
          {
            header: 'Actions',
            accessor: (row) => (
              <div className="flex items-center gap-1">
                <EntityDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit attendance for ${row.artist_name}`}
                    >
                      <IconEdit />
                    </Button>
                  }
                  title="Edit attendance"
                  description="Update this attendance record."
                  submitLabel="Save changes"
                  pendingLabel="Saving…"
                  successMessage="Attendance updated."
                  action={updateAttendanceAction}
                  hiddenFields={{ id: row.id }}
                >
                  <AttendanceFields artists={artists} record={row} />
                </EntityDialog>
                <DeleteDialog
                  id={row.id}
                  name={`${row.artist_name} — ${row.session_date}`}
                  entity="attendance record"
                  action={deleteAttendanceAction}
                  trigger={
                    <Button
                      variant="destructive"
                      size="icon-sm"
                      aria-label={`Delete attendance for ${row.artist_name}`}
                    >
                      <IconTrash />
                    </Button>
                  }
                />
              </div>
            ),
          },
        ]}
        data={attendance}
        emptyMessage="No attendance records found in Supabase."
      />
    </div>
  );
}
