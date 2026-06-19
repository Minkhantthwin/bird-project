'use client';

import {
  useActionState,
  useEffect,
  useOptimistic,
  useRef,
  useTransition,
} from 'react';
import { IconLoader2, IconSend } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  createCommentAction,
  toggleReactionAction,
  type DashboardActionState,
} from '@/lib/dashboard-actions';
import type { ReactionType } from '@/lib/types';
import { cn } from '@/lib/utils';

const reactionOptions: ReadonlyArray<{
  type: ReactionType;
  emoji: string;
  label: string;
}> = [
  { type: 'Like', emoji: '👍', label: 'Like' },
  { type: 'Love', emoji: '❤️', label: 'Love' },
  { type: 'Celebrate', emoji: '🎉', label: 'Celebrate' },
  { type: 'Fire', emoji: '🔥', label: 'Fire' },
  { type: 'Insightful', emoji: '💡', label: 'Insightful' },
];

type ReactionCounts = Partial<Record<ReactionType, number>>;

export function ReactionPicker({
  postId,
  counts,
  initialReaction,
}: {
  postId: string;
  counts: ReactionCounts;
  initialReaction: ReactionType | null;
}) {
  const [reactionState, updateOptimisticReaction] = useOptimistic(
    { activeReaction: initialReaction, counts },
    (current, reactionType: ReactionType) => {
      const nextReaction =
        current.activeReaction === reactionType ? null : reactionType;
      const nextCounts = { ...current.counts };

      if (current.activeReaction) {
        nextCounts[current.activeReaction] = Math.max(
          0,
          (nextCounts[current.activeReaction] ?? 0) - 1,
        );
      }
      if (nextReaction) {
        nextCounts[nextReaction] = (nextCounts[nextReaction] ?? 0) + 1;
      }

      return { activeReaction: nextReaction, counts: nextCounts };
    },
  );
  const [pending, startTransition] = useTransition();

  function react(reactionType: ReactionType) {
    if (pending) return;

    startTransition(async () => {
      updateOptimisticReaction(reactionType);
      const result = await toggleReactionAction(postId, reactionType);

      if (!result.success) {
        toast.error(result.serverError ?? 'Unable to update your reaction.');
      }
    });
  }

  return (
    <div className="mt-5 border-t border-border/70 pt-4">
      <div className="flex flex-wrap items-center gap-2" aria-label="React to this post">
        {reactionOptions.map(({ type, emoji, label }) => {
          const active = reactionState.activeReaction === type;
          const count = reactionState.counts[type] ?? 0;

          return (
            <button
              key={type}
              type="button"
              aria-label={`${label}${count ? `, ${count}` : ''}`}
              aria-pressed={active}
              disabled={pending}
              onClick={() => react(type)}
              className={cn(
                'inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors',
                'focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30',
                active
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <span aria-hidden="true">{emoji}</span>
              <span className="hidden sm:inline">{label}</span>
              {count > 0 && <span className="tabular-nums">{count}</span>}
            </button>
          );
        })}
        {pending && (
          <IconLoader2
            className="ml-1 size-4 animate-spin text-muted-foreground"
            aria-label="Saving reaction"
          />
        )}
      </div>
    </div>
  );
}

const initialCommentState: DashboardActionState = {};

export function CommentComposer({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    createCommentAction,
    initialCommentState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      toast.success(state.message ?? 'Comment posted.');
    } else if (state.serverError) {
      toast.error(state.serverError);
    }
  }, [state]);

  const contentError = state.errors?.content?.[0];

  return (
    <form
      ref={formRef}
      action={formAction}
      className="rounded-2xl border border-border bg-card/50 p-3"
    >
      <input type="hidden" name="postId" value={postId} />
      <label htmlFor={`comment-${postId}`} className="sr-only">
        Add a comment
      </label>
      <textarea
        id={`comment-${postId}`}
        name="content"
        rows={3}
        maxLength={1000}
        required
        disabled={pending}
        aria-invalid={Boolean(contentError)}
        aria-describedby={contentError ? `comment-error-${postId}` : undefined}
        placeholder="Join the conversation…"
        className="min-h-20 w-full resize-y bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-60"
      />
      <div className="mt-2 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
        <p
          id={`comment-error-${postId}`}
          className={cn('text-xs', contentError ? 'text-destructive' : 'text-muted-foreground')}
          aria-live="polite"
        >
          {contentError ?? 'Be kind, clear, and constructive.'}
        </p>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? <IconLoader2 className="animate-spin" /> : <IconSend />}
          {pending ? 'Posting…' : 'Post comment'}
        </Button>
      </div>
    </form>
  );
}
