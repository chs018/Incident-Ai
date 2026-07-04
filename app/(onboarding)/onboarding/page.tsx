import type { Metadata } from 'next';
import { OnboardingWizard } from '@/features/onboarding/onboarding-wizard';

export const metadata: Metadata = {
  title: 'Workspace Setup | AI Incident Commander',
  description: 'Configure your enterprise AI Operations workspace and telemetry integrations',
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
