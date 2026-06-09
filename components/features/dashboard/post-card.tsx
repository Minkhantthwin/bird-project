import Link from 'next/link';
import { dummyData } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';

export function PostCard({ postId }: { postId: string }) {
  const post = dummyData.posts.find((p) => p.id === postId);
  if (!post) return null;

  const author = dummyData.users.find((u) => u.id === post.user_id);
  const reactions = dummyData.reactions.filter((r) => r.post_id === post.id);
  const commentCount = dummyData.comments.filter(
    (c) => c.post_id === post.id,
  ).length;

  const reactionCounts = reactions.reduce(
    (acc, r) => {
      acc[r.reaction_type] = (acc[r.reaction_type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const roleBadge: Record<string, string> = {
    Admin: 'bg-rose-500/10 text-rose-500',
    Instructor: 'bg-sky-500/10 text-sky-500',
    Member: 'bg-emerald-500/10 text-emerald-500',
  };

  const role = dummyData.roles.find((r) => r.id === author?.role_id)?.name;

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
            {author?.full_name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium truncate">
                {author?.full_name}
              </p>
              {role && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    roleBadge[role] ?? 'bg-muted text-muted-foreground',
                  )}
                >
                  {role}
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
          {commentCount > 0 && (
            <span>💬 {commentCount} comment{commentCount !== 1 ? 's' : ''}</span>
          )}
        </div>
      </article>
    </Link>
  );
}
