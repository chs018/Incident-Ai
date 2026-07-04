import type { Metadata } from 'next';
import { AnalyticsDashboard } from '@/features/analytics/analytics-dashboard';

export const metadata: Metadata = {
  title: 'Analytics & ROI Telemetry | AI Incident Commander',
  description: 'Enterprise SRE intelligence, MTTR tracking, SLA compliance velocity, and autonomous AI remediation analytics.',
};

export default function AnalyticsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <AnalyticsDashboard />
    </div>
  );
}
