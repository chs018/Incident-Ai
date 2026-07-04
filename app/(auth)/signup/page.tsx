import type { Metadata } from 'next';
import { SignupContent } from '@/features/auth/signup-content';

export const metadata: Metadata = {
  title: 'Sign Up | AI Incident Commander',
  description: 'Create your enterprise AI Operations workspace and start resolving incidents 10× faster',
};

export default function SignupPage() {
  return <SignupContent />;
}
