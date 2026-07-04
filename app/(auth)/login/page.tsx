import type { Metadata } from 'next';
import { LoginContent } from '@/features/auth/login-content';

export const metadata: Metadata = {
  title: 'Sign In | AI Incident Commander',
  description: 'Sign in to your AI Incident Commander workspace',
};

export default function LoginPage() {
  return <LoginContent />;
}
