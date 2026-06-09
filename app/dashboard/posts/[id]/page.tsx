import Link from 'next/link';
import { PostDetail } from '@/components/features/dashboard/post-detail';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Back to feed
      </Link>
      <PostDetail postId={id} />
    </div>
  );
}
