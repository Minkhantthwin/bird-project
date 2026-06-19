import { AllPostsViewer } from '@/components/features/instructor/all-posts-viewer';
import { getAllInstructorPosts } from '@/lib/instructor-data';

export default async function InstructorAllPostsPage() {
  const posts = await getAllInstructorPosts();

  return <AllPostsViewer posts={posts} />;
}
