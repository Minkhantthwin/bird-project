'use client';

import { useActionState, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { AdminActionState } from '@/lib/admin-actions';

type AdminAction = (
  state: AdminActionState,
  formData: FormData,
) => Promise<AdminActionState>;

interface EntityDialogProps {
  trigger: ReactNode;
  title: string;
  description: string;
  submitLabel: string;
  pendingLabel: string;
  successMessage: string;
  action: AdminAction;
  children: ReactNode;
  hiddenFields?: Record<string, string>;
}

const initialState: AdminActionState = {};

function ActionForm({
  action,
  setOpen,
  submitLabel,
  pendingLabel,
  successMessage,
  hiddenFields,
  children,
}: Omit<EntityDialogProps, 'trigger' | 'title' | 'description'> & {
  setOpen: (open: boolean) => void;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? successMessage);
      setOpen(false);
    } else if (state.serverError) {
      toast.error(state.serverError);
    }
  }, [state, setOpen, successMessage]);

  const errorMessages = Object.values(state.errors ?? {}).flat();

  return (
    <form action={formAction} className="space-y-4">
      {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {errorMessages.length > 0 && (
        <div className="rounded-2xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessages.join(' ')}
        </div>
      )}
      {children}
      <div className="flex justify-end gap-2 pt-2">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={pending}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export function EntityDialog(props: EntityDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      {open && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          <ActionForm {...props} setOpen={setOpen} />
        </DialogContent>
      )}
    </Dialog>
  );
}

interface DeleteDialogProps {
  id: string;
  name: string;
  entity: string;
  action: AdminAction;
  trigger: ReactNode;
  cascadeWarning?: string;
}

export function DeleteDialog({
  id,
  name,
  entity,
  action,
  trigger,
  cascadeWarning,
}: DeleteDialogProps) {
  return (
    <EntityDialog
      trigger={trigger}
      title={`Delete ${entity}?`}
      description={`This will permanently delete ${name}. ${cascadeWarning ?? 'This action cannot be undone.'}`}
      submitLabel="Delete"
      pendingLabel="Deleting…"
      successMessage={`${entity} deleted.`}
      action={action}
      hiddenFields={{ id }}
    >
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        Please confirm that you want to permanently delete this record.
      </div>
    </EntityDialog>
  );
}
