import type { Metadata } from 'next';
import { RegisterForm } from '@/components/features/auth/register-form';

export const metadata: Metadata = {
  title: 'Register — attanDANCE',
  description: 'Create your attanDANCE account and join the crew.',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
