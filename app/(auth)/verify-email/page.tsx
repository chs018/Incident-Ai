import type { Metadata } from 'next';
import { VerifyEmailContent } from '@/features/auth/verify-email-content';

export const metadata: Metadata = {
  title: 'Verify Work Email | AI Incident Commander',
  description: 'Enter your 6-digit verification code to access your enterprise AI Operations workspace',
};

export default function VerifyEmailPage() {
  return <VerifyEmailContent />;
}
