import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { PostWithMeta } from '@/lib/data-service';

const roleBadge: Record<string, string> = {
  Admin: 'bg-rose-500/10 text-rose-500',
  Instructor: 'bg-sky-500/10 text-sky-500',
  Member: 'bg-emerald-500/10 text-emerald-500',
};

export function PostCard({ post }: { post: PostWithMeta }) {
  const { author, reactions } = post;

  const reactionCounts = reactions.reduce(
    (acc, r) => {
      acc[r.reaction_type] = (acc[r.reaction_type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <Link href={`/dashboard/posts/${post.id}`} className="block">
      <article
        className={cn(
          'animate-scale-in rounded-3xl border border-border bg-card/60 p-5 backdrop-blur-xl',
          'hover:border-primary/20 hover:bg-card/80 hover:shadow-md transition-all duration-300 ease-out',
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-bold">
            {author.full_name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {author.full_name}
              </p>
              {author.role_name && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    roleBadge[author.role_name] ?? 'bg-muted text-muted-foreground',
                  )}
                >
                  {author.role_name}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-semibold leading-snug">{post.title}</h3>

        {/* Body preview */}
        <p className="mt-1 text-sm text-muted-foreground line-clamp-3">
          {post.body}
        </p>

        {/* Reactions bar */}
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          {Object.entries(reactionCounts).length > 0 && (
            <span className="flex items-center gap-1">
              {Object.entries(reactionCounts).map(([type, count]) => (
                <span key={type} className="flex items-center gap-0.5">
                  {type === 'Fire'
                    ? '🔥'
                    : type === 'Like'
                      ? '👍'
                      : type === 'Love'
                        ? '❤️'
                        : type === 'Celebrate'
                          ? '🎉'
                          : '💡'}
                  {count}
                </span>
              ))}
            </span>
          )}
          {post.commentCount > 0 && (
            <span>💬 {post.commentCount} comment{post.commentCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </article>
    </Link>
  );
}
