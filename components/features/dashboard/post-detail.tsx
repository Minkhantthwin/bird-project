import { cn } from '@/lib/utils';
import { getPostsWithMeta, getCommentsWithAuthors } from '@/lib/data-service';
import { getSession } from '@/lib/auth/session';
import type { ReactionType } from '@/lib/types';
import { CommentList } from './comment-list';
import { CommentComposer, ReactionPicker } from './post-interactions';

interface PostDetailProps {
  postId: string;
}

const roleBadge: Record<string, string> = {
  Admin: 'bg-rose-500/10 text-rose-500',
  Instructor: 'bg-sky-500/10 text-sky-500',
  Member: 'bg-emerald-500/10 text-emerald-500',
};

export async function PostDetail({ postId }: PostDetailProps) {
  const [posts, comments, session] = await Promise.all([
    getPostsWithMeta(),
    getCommentsWithAuthors(postId),
    getSession(),
  ]);

  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Post not found.</p>
      </div>
    );
  }

  const { author, reactions } = post;
  const reactionCounts = reactions.reduce(
    (acc, r) => {
      acc[r.reaction_type] = (acc[r.reaction_type] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<ReactionType, number>>,
  );
  const currentReaction =
    reactions.find((reaction) => reaction.user_id === session?.id)?.reaction_type ??
    null;

  return (
    <div className="space-y-6">
      <article className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
            {author.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{author.full_name}</p>
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

        <ReactionPicker
          postId={post.id}
          counts={reactionCounts}
          initialReaction={currentReaction}
        />
      </article>

      {/* Comments */}
      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-lg font-semibold">
            Comments{comments.length > 0 ? ` (${comments.length})` : ''}
          </h2>
          <p className="text-sm text-muted-foreground">
            Share encouragement, feedback, or a useful thought.
          </p>
        </div>
        <CommentComposer postId={post.id} />
        <CommentList comments={comments} />
      </section>
    </div>
  );
}
