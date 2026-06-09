import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { LandingPage } from '@/components/features/landing/landing-page';

export default async function RootPage() {
  const session = await getSession();

  if (!session) {
    return <LandingPage />;
  }

  switch (session.role) {
    case 'Admin':
      redirect('/admin');
    case 'Instructor':
      redirect('/instructor');
    case 'Member':
    default:
      redirect('/dashboard');
  }
}

