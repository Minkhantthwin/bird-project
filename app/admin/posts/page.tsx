import { PostsManager } from '@/components/features/admin/posts-manager';
import { getAdminPosts, getAdminUsers } from '@/lib/admin-data';

export default async function AdminPostsPage() {
  const [posts, users] = await Promise.all([
    getAdminPosts(),
    getAdminUsers(),
  ]);

  return <PostsManager posts={posts} users={users} />;
}
