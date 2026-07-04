import type { Metadata } from 'next';
import { DashboardContent } from '@/features/dashboard/dashboard-content';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Executive overview of your production environment',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
