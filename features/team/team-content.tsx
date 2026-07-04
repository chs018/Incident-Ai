'use client';

import { motion } from 'framer-motion';
import { Users, Shield, Activity } from 'lucide-react';
import { teamMembers, teams } from '@/lib/mock-data/organizations';

const roleColors: Record<string, string> = {
  admin: '#EF4444',
  'incident-commander': '#3B82F6',
  sre: '#10B981',
  devops: '#F59E0B',
  viewer: '#64748B',
};

const statusDot: Record<string, string> = {
  online: '#10B981',
  away: '#F59E0B',
  offline: '#475569',
};

export function TeamContent() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      <div className="flex items-center gap-3 mb-1">
        <Users size={20} style={{ color: '#3B82F6' }} />
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Team</h1>
      </div>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        {teamMembers.length} members across {teams.length} teams
      </p>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Members list */}
        <div className="lg:col-span-2 glass-card overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Members</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="relative shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: member.avatarColor }}
                  >
                    {member.avatarInitials}
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ background: statusDot[member.status], borderColor: 'var(--bg-surface)' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{member.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{member.email}</p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-1">
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                    style={{ background: `${roleColors[member.role]}15`, color: roleColors[member.role] }}
                  >
                    {member.role}
                  </span>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {member.incidentsResolved} resolved
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Teams */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--text-primary)' }}>Teams</h2>
          {teams.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{team.name}</p>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5' }}
                >
                  {team.oncallCount} on-call
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{team.description}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Lead: {team.lead}</span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{team.memberCount} members</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
