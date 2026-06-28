import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { RegisterOtpForm } from '@/components/features/auth/register-otp-form';

export const metadata: Metadata = {
  title: 'Verify Account — attanDANCE',
  description: 'Enter the email verification code to finish creating your attanDANCE account.',
};

interface RegisterVerifyPageProps {
  searchParams: Promise<{
    email?: string;
  }>;
}

export default async function RegisterVerifyPage({
  searchParams,
}: RegisterVerifyPageProps) {
  const { email } = await searchParams;

  if (!email) {
    redirect('/register');
  }

  return <RegisterOtpForm email={email} />;
}
