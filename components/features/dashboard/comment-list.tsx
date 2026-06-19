import type { CommentWithAuthor } from '@/lib/data-service';

interface CommentItemProps {
  comment: CommentWithAuthor;
}

export function CommentItem({ comment }: CommentItemProps) {
  const { author } = comment;

  return (
    <div className="flex gap-3 rounded-2xl bg-muted/30 p-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
        {author.full_name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{author.full_name}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
      </div>
    </div>
  );
}

export function CommentList({ comments }: { comments: CommentWithAuthor[] }) {
  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No comments yet. Be the first!
      </p>
    );
  }

  const sorted = [...comments].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="space-y-3">
      {sorted.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </div>
  );
}
