import { getSession } from '@/lib/auth/session';
import { Feed } from '@/components/features/dashboard/feed';
import { CreatePostCard } from '@/components/features/dashboard/create-post-card';

export default async function DashboardFeedPage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Welcome, {session?.fullName}
        </h1>
        <p className="text-sm text-muted-foreground">
          Your attanDANCE feed
        </p>
      </div>
      <CreatePostCard />
      <Feed />
    </div>
  );
}
