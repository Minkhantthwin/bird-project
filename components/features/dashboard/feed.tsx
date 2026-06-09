import { PostCard } from './post-card';
import { dummyData } from '@/lib/dummy-data';

export function Feed() {
  const posts = [...dummyData.posts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} postId={post.id} />
      ))}
    </div>
  );
}
