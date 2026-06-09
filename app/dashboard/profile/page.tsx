import { getSession } from '@/lib/auth/session';
import { ProfileCard } from '@/components/features/dashboard/profile-card';

export default async function ProfilePage() {
  const session = await getSession();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground">
          Your account and artist record.
        </p>
      </div>
      <ProfileCard userId={session!.id} />
    </div>
  );
}
