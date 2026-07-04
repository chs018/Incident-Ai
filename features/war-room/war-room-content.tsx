'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Search, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { StatusBadge } from '@/components/ui/status-badge';
import { incidents, activeIncidents } from '@/lib/mock-data/incidents';
import { timeAgo } from '@/lib/utils';
import { IncidentSeverity } from '@/types';

const severityDot: Record<IncidentSeverity, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#10B981',
};

export function WarRoomContent() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');

  const filtered = incidents.filter((i) => {
    const matchSearch =
      !search ||
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.id.toLowerCase().includes(search.toLowerCase()) ||
      i.service.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && !['resolved', 'postmortem'].includes(i.status)) ||
      (filter === 'resolved' && ['resolved', 'postmortem'].includes(i.status));
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <Flame size={16} style={{ color: '#EF4444' }} />
            </div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Incident War Room
            </h1>
            {activeIncidents.length > 0 && (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                {activeIncidents.length} ACTIVE
              </motion.span>
            )}
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Real-time incident monitoring and AI-powered response coordination
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', color: 'white', boxShadow: '0 4px 16px rgba(59,130,246,0.25)' }}
          >
            <Plus size={14} />
            New Incident
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
      >
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-xl min-w-0"
          style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
          <input
            type="text"
            placeholder="Search incidents, services, IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm flex-1 min-w-0 outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          {(['all', 'active', 'resolved'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all"
              style={
                filter === f
                  ? { background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }
                  : { background: 'var(--bg-overlay)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
              }
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Incidents table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Incident', 'Severity', 'Status', 'Priority', 'Service', 'Assignee', 'Created', ''].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((incident, i) => (
                <motion.tr
                  key={incident.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04 }}
                  className="group"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  {/* ID + Title */}
                  <td className="px-4 py-3">
                    <Link href={`/war-room/${incident.id}`} className="block">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: severityDot[incident.severity] }}
                        />
                        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                          {incident.id}
                        </span>
                      </div>
                      <p
                        className="text-sm font-medium group-hover:text-blue-400 transition-colors max-w-[300px] truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {incident.title}
                      </p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant="severity" value={incident.severity} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant="status" value={incident.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant="priority" value={incident.priority} showDot={false} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {incident.service}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {incident.assignee ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ background: incident.assignee.avatarColor }}
                        >
                          {incident.assignee.avatarInitials}
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {incident.assignee.name.split(' ')[0]}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs" style={{ color: 'var(--text-disabled)' }}>Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }} suppressHydrationWarning>
                      {timeAgo(incident.createdAt)}
                    </span>
                  </td>
                  {/* Open War Room CTA */}
                  <td className="px-4 py-3">
                    <Link href={`/war-room/${incident.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold opacity-0 group-hover:opacity-100 transition-all"
                        style={{
                          background: 'rgba(59,130,246,0.1)',
                          color: '#60A5FA',
                          border: '1px solid rgba(59,130,246,0.2)',
                        }}
                      >
                        Open <ExternalLink size={9} />
                      </motion.button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">No incidents match your filters.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
