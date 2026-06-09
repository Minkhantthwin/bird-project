import type { Metadata } from 'next';
import { LoginForm } from '@/components/features/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In — attanDANCE',
  description: 'Sign in to your attanDANCE account.',
};

export default function LoginPage() {
  return <LoginForm />;
}
