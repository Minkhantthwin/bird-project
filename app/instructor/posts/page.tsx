import { InstructorPostsManager } from '@/components/features/instructor/posts-manager';
import { getInstructorPosts } from '@/lib/instructor-data';

export default async function InstructorPostsPage() {
  const posts = await getInstructorPosts();

  return <InstructorPostsManager posts={posts} />;
}
