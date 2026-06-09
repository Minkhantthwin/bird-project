import { dummyData } from '@/lib/dummy-data';
import { cn } from '@/lib/utils';
import { CommentList } from './comment-list';

interface PostDetailProps {
  postId: string;
}

export function PostDetail({ postId }: PostDetailProps) {
  const post = dummyData.posts.find((p) => p.id === postId);
  if (!post) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  const author = dummyData.users.find((u) => u.id === post.user_id);
  const reactions = dummyData.reactions.filter((r) => r.post_id === post.id);
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
    <div className="space-y-6">
      <article className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
            {author?.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{author?.full_name}</p>
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
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Content */}
        <h1 className="mt-5 font-heading text-xl font-bold">{post.title}</h1>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
          {post.body}
        </p>

        {/* Reactions */}
        {Object.keys(reactionCounts).length > 0 && (
          <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
            {Object.entries(reactionCounts).map(([type, count]) => (
              <span key={type}>
                {type === 'Fire'
                  ? '🔥'
                  : type === 'Like'
                    ? '👍'
                    : type === 'Love'
                      ? '❤️'
                      : type === 'Celebrate'
                        ? '🎉'
                        : '💡'}{' '}
                {count} {type}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Comments */}
      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold">Comments</h2>
        <CommentList postId={post.id} />
      </section>
    </div>
  );
}
