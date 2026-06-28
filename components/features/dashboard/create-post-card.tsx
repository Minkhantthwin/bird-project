'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createPostAction, type DashboardActionState } from '@/lib/dashboard-actions';

const initialState: DashboardActionState = {};

function CreatePostForm({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createPostAction, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message ?? 'Post published!');
      setOpen(false);
      formRef.current?.reset();
    } else if (state.serverError) {
      toast.error(state.serverError);
    }
  }, [state, setOpen]);

  const errorMessages = Object.values(state.errors ?? {}).flat();

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          +
        </div>
        <span className="text-sm font-medium">New Post</span>
      </div>

      {errorMessages.length > 0 && (
        <div className="rounded-2xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessages.join(' ')}
        </div>
      )}

      <input
        type="text"
        name="title"
        placeholder="Post title"
        required
        maxLength={255}
        className="w-full rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm outline-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/20"
      />

      <textarea
        name="body"
        placeholder="What's on your mind?"
        required
        maxLength={10000}
        rows={4}
        className="w-full rounded-2xl border border-border bg-input/40 px-3 py-2 text-sm outline-none resize-none focus-visible:border-primary/30 focus-visible:ring-2 focus-visible:ring-primary/20"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            formRef.current?.reset();
          }}
          disabled={pending}
          className="rounded-2xl px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {pending ? 'Publishing…' : 'Publish'}
        </button>
      </div>
    </form>
  );
}

export function CreatePostCard() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        'animate-scale-in rounded-3xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all duration-300',
        open && 'border-primary/20 shadow-md',
      )}
    >
      {!open ? (
        /* Collapsed — single trigger row */
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 text-left"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            +
          </div>
          <span className="text-sm text-muted-foreground">
            Share something with the club…
          </span>
        </button>
      ) : (
        /* Expanded — full form */
        <CreatePostForm setOpen={setOpen} />
      )}
    </div>
  );
}
