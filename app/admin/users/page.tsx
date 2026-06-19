import { UsersManager } from '@/components/features/admin/users-manager';
import { getAdminUsers } from '@/lib/admin-data';
import { getSession } from '@/lib/auth/session';

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getAdminUsers(), getSession()]);

  return <UsersManager users={users} currentUserId={session?.id ?? ''} />;
}
