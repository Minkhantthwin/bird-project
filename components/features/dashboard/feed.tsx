import { PostCard } from './post-card';
import { getPostsWithMeta } from '@/lib/data-service';

export async function Feed() {
  const posts = await getPostsWithMeta();

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-card/40 p-12 text-center backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">
          No posts yet. Check back soon!
        </p>
      </div>
    );
  }

  const sorted = [...posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="space-y-4">
      {sorted.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
