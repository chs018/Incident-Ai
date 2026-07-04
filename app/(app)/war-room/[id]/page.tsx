import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { incidents } from '@/lib/mock-data/incidents';
import { extendedIncidents } from '@/lib/mock-data/dashboard';
import { WarRoomDetail } from '@/features/war-room/war-room-detail';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const incident = [...incidents, ...extendedIncidents].find((i) => i.id === id);
  if (!incident) return { title: 'Incident Not Found' };
  return {
    title: `${incident.id} — War Room | AI Incident Commander`,
    description: incident.title,
  };
}

export default async function WarRoomDetailPage({ params }: Props) {
  const { id } = await params;

  // Primary incidents have full data (timeline, AI analysis); extended ones have minimal data
  const incident =
    incidents.find((i) => i.id === id) ??
    (extendedIncidents.find((i) => i.id === id) as typeof incidents[0] | undefined);

  if (!incident) notFound();

  return <WarRoomDetail incident={incident} />;
}
