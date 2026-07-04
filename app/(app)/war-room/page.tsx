import type { Metadata } from 'next';
import { WarRoomContent } from '@/features/war-room/war-room-content';

export const metadata: Metadata = {
  title: 'Incident War Room',
  description: 'Real-time incident investigation and response command center',
};

export default function WarRoomPage() {
  return <WarRoomContent />;
}
