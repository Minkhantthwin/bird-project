'use client';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTable } from '@/components/features/shared/data-table';
import { StatusBadge } from '@/components/features/shared/status-badge';
import { EntityDialog, DeleteDialog } from './entity-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  createInjuryAction,
  deleteInjuryAction,
  updateInjuryAction,
} from '@/lib/admin-actions';
import type { AdminArtist, AdminInjury } from '@/lib/admin-data';

const controlClass =
  'h-9 w-full rounded-3xl border border-transparent bg-input/50 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30';

function InjuryFields({
  injury,
  artists,
}: {
  injury?: AdminInjury;
  artists: AdminArtist[];
}) {
  return (
    <>
      <div className="space-y-1.5">
        <Label htmlFor={`injury-artist-${injury?.id ?? 'new'}`}>Artist</Label>
        <select
          id={`injury-artist-${injury?.id ?? 'new'}`}
          name="artistRecordId"
          className={controlClass}
          defaultValue={injury?.artist_record_id ?? ''}
          required
        >
          <option value="" disabled>Select an artist</option>
          {artists.map((artist) => (
            <option key={artist.id} value={artist.id}>
              {artist.stage_name || artist.full_name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`incidentDate-${injury?.id ?? 'new'}`}>Incident date</Label>
        <Input
          id={`incidentDate-${injury?.id ?? 'new'}`}
          name="incidentDate"
          type="date"
          defaultValue={injury?.incident_date}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`severity-${injury?.id ?? 'new'}`}>Severity</Label>
          <select id={`severity-${injury?.id ?? 'new'}`} name="severity" className={controlClass} defaultValue={injury?.severity ?? 'Minor'}>
            <option value="Minor">Minor</option>
            <option value="Moderate">Moderate</option>
            <option value="Severe">Severe</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`status-${injury?.id ?? 'new'}`}>Status</Label>
          <select id={`status-${injury?.id ?? 'new'}`} name="status" className={controlClass} defaultValue={injury?.status ?? 'Under Treatment'}>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Recovering">Recovering</option>
            <option value="Cleared">Cleared</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`description-${injury?.id ?? 'new'}`}>Description</Label>
        <textarea
          id={`description-${injury?.id ?? 'new'}`}
          name="description"
          className={`${controlClass} min-h-24 resize-y py-2`}
          defaultValue={injury?.description}
          required
        />
      </div>
    </>
  );
}

export function InjuriesManager({ injuries, artists }: { injuries: AdminInjury[]; artists: AdminArtist[] }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Injury Management</h1>
          <p className="text-sm text-muted-foreground">Create, update, and resolve reported injuries.</p>
        </div>
        <EntityDialog
          trigger={<Button disabled={artists.length === 0}><IconPlus /> Add injury</Button>}
          title="Report injury"
          description="Create an injury record for an artist."
          submitLabel="Create injury"
          pendingLabel="Creating…"
          successMessage="Injury created."
          action={createInjuryAction}
        >
          <InjuryFields artists={artists} />
        </EntityDialog>
      </div>

      <DataTable
        keyField="id"
        columns={[
          { header: 'Artist', accessor: 'artist_name' },
          { header: 'Date', accessor: 'incident_date' },
          { header: 'Severity', accessor: 'severity' },
          { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
          { header: 'Description', accessor: 'description', className: 'max-w-[250px] truncate text-muted-foreground' },
          {
            header: 'Actions',
            accessor: (row) => (
              <div className="flex items-center gap-1">
                <EntityDialog
                  trigger={<Button variant="ghost" size="icon-sm" aria-label={`Edit injury for ${row.artist_name}`}><IconEdit /></Button>}
                  title="Edit injury"
                  description="Update the incident details or recovery status."
                  submitLabel="Save changes"
                  pendingLabel="Saving…"
                  successMessage="Injury updated."
                  action={updateInjuryAction}
                  hiddenFields={{ id: row.id }}
                >
                  <InjuryFields injury={row} artists={artists} />
                </EntityDialog>
                <DeleteDialog
                  id={row.id}
                  name={`the injury record for ${row.artist_name}`}
                  entity="injury"
                  action={deleteInjuryAction}
                  trigger={<Button variant="destructive" size="icon-sm" aria-label={`Delete injury for ${row.artist_name}`}><IconTrash /></Button>}
                />
              </div>
            ),
          },
        ]}
        data={injuries}
        emptyMessage="No injury records found in Supabase."
      />
    </div>
  );
}
