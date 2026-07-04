'use client';

import { motion } from 'framer-motion';
import { Users, Shield, User, Phone, Wifi, WifiOff, Moon } from 'lucide-react';
import { Incident, TeamMember } from '@/types';

// ─── On-call roster (additional responders) ───────────────────

const onCallRoster: TeamMember[] = [
  {
    id: 'usr-oc-1',
    name: 'Vikram Nair',
    email: 'vikram.nair@cloudnova.io',
    role: 'sre',
    avatarInitials: 'VN',
    avatarColor: '#A78BFA',
    team: 'Platform Engineering',
    status: 'online',
    incidentsResolved: 142,
    joinedAt: '2021-06-01T00:00:00Z',
  },
  {
    id: 'usr-oc-2',
    name: 'Ananya Bose',
    email: 'ananya.bose@cloudnova.io',
    role: 'devops',
    avatarInitials: 'AB',
    avatarColor: '#34D399',
    team: 'Cloud Infrastructure',
    status: 'online',
    incidentsResolved: 98,
    joinedAt: '2022-03-15T00:00:00Z',
  },
  {
    id: 'usr-oc-3',
    name: 'Sneha Iyer',
    email: 'sneha.iyer@cloudnova.io',
    role: 'devops',
    avatarInitials: 'SI',
    avatarColor: '#06B6D4',
    team: 'DevOps',
    status: 'away',
    incidentsResolved: 76,
    joinedAt: '2023-01-10T00:00:00Z',
  },
];

const roleColors: Record<string, string> = {
  sre: '#3B82F6',
  devops: '#8B5CF6',
  security: '#EF4444',
  engineer: '#10B981',
  manager: '#F59E0B',
};

const statusIcon: Record<TeamMember['status'], React.ElementType> = {
  online: Wifi,
  away: Moon,
  offline: WifiOff,
};

const statusColor: Record<TeamMember['status'], string> = {
  online: '#10B981',
  away: '#F59E0B',
  offline: '#64748B',
};

// ─── Member Card ──────────────────────────────────────────────

function MemberCard({
  member,
  badge,
  delay,
}: {
  member: TeamMember;
  badge?: string;
  delay: number;
}) {
  const StatusIcon = statusIcon[member.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center gap-3 p-3 rounded-xl group cursor-pointer transition-all hover:bg-white/[0.03]"
      style={{ border: '1px solid var(--border-subtle)' }}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
          style={{ background: member.avatarColor, boxShadow: `0 0 12px ${member.avatarColor}40` }}
        >
          {member.avatarInitials}
        </div>
        {/* Status dot */}
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{
            background: statusColor[member.status],
            borderColor: 'var(--bg-elevated)',
            boxShadow: member.status === 'online' ? `0 0 6px ${statusColor[member.status]}` : undefined,
          }}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {member.name}
          </p>
          {badge && (
            <span
              className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
              style={{
                background: badge === 'Commander' ? 'rgba(239,68,68,0.12)' : 'rgba(59,130,246,0.1)',
                color: badge === 'Commander' ? '#FCA5A5' : '#60A5FA',
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] font-bold uppercase"
            style={{ color: roleColors[member.role] ?? 'var(--text-muted)' }}
          >
            {member.role}
          </span>
          <span className="text-[9px]" style={{ color: 'var(--text-disabled)' }}>·</span>
          <span className="text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>
            {member.team}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1 shrink-0">
        <StatusIcon size={10} style={{ color: statusColor[member.status] }} />
        <span className="text-[9px] capitalize" style={{ color: statusColor[member.status] }}>
          {member.status}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Team Panel ───────────────────────────────────────────────

interface TeamPanelProps {
  incident: Incident;
}

export function TeamPanel({ incident }: TeamPanelProps) {
  const onlineCount = onCallRoster.filter(m => m.status === 'online').length +
    (incident.assignee?.status === 'online' ? 1 : 0) +
    (incident.commander?.status === 'online' ? 1 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <Users size={15} style={{ color: '#3B82F6' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>War Room Team</h2>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.15)' }}
          >
            {onlineCount} online
          </span>
        </div>
        <button
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(59,130,246,0.08)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <Phone size={10} />
          Join bridge
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Commanders / Leads */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <Shield size={9} style={{ color: '#EF4444' }} />
            Incident Leads
          </p>
          <div className="space-y-2">
            {incident.commander && (
              <MemberCard member={incident.commander} badge="Commander" delay={0.55} />
            )}
            {incident.assignee && (
              <MemberCard member={incident.assignee} badge="Assignee" delay={0.6} />
            )}
            {!incident.commander && !incident.assignee && (
              <div
                className="text-xs px-3 py-2 rounded-lg"
                style={{ background: 'rgba(245,158,11,0.06)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.15)' }}
              >
                ⚠ No incident commander assigned
              </div>
            )}
          </div>
        </div>

        {/* On-call roster */}
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <User size={9} />
            On-Call Responders
          </p>
          <div className="space-y-2">
            {onCallRoster.map((member, i) => (
              <MemberCard key={member.id} member={member} delay={0.65 + i * 0.06} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 gap-2 pt-3 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          {[
            { label: 'Team Members', value: 2 + onCallRoster.length },
            { label: 'Avg Resolved', value: '105' },
            { label: 'Team Incidents', value: '847' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
              <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
