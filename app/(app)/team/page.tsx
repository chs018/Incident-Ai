import type { Metadata } from 'next';
import { TeamContent } from '@/features/team/team-content';

export const metadata: Metadata = { title: 'Team' };
export default function TeamPage() { return <TeamContent />; }
