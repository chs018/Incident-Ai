import type { Metadata } from 'next';
import { IntegrationsContent } from '@/features/integrations/integrations-content';

export const metadata: Metadata = { title: 'Integrations' };

export default function IntegrationsPage() {
  return <IntegrationsContent />;
}
