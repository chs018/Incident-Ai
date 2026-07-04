'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, RefreshCw, ArrowUpDown, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { StatusBadge } from '@/components/ui/status-badge';
import { extendedIncidents } from '@/lib/mock-data/dashboard';
import { timeAgo } from '@/lib/utils';
import { IncidentPriority, IncidentSeverity, IncidentStatus } from '@/types';

// ─── Priority sort order ──────────────────────────────────────

const priorityOrder: Record<IncidentPriority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
const severityColor: Record<IncidentSeverity, string> = {
  critical: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#10B981',
};

// ─── Active Incident Table ────────────────────────────────────

export function ActiveIncidentTable() {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | IncidentPriority>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const filtered = useMemo(() => {
    return extendedIncidents
      .filter((i) => {
        const matchSearch = !search ||
          i.title.toLowerCase().includes(search.toLowerCase()) ||
          i.id.toLowerCase().includes(search.toLowerCase()) ||
          i.service.toLowerCase().includes(search.toLowerCase());
        const matchPriority = priorityFilter === 'all' || i.priority === priorityFilter;
        const matchStatus = statusFilter === 'all' ||
          (statusFilter === 'active' && !['resolved', 'postmortem'].includes(i.status)) ||
          (statusFilter === 'resolved' && ['resolved', 'postmortem'].includes(i.status));
        return matchSearch && matchPriority && matchStatus;
      })
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }, [search, priorityFilter, statusFilter]);

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(r => setTimeout(r, 800));
    setIsRefreshing(false);
  };

  // Time-open helper
  const timeOpen = (createdAt: string, resolvedAt: string | null) => {
    const end = resolvedAt ? new Date(resolvedAt) : new Date();
    const mins = Math.floor((end.getTime() - new Date(createdAt).getTime()) / 60000);
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Active Incidents
          </h2>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            {filtered.length} results
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
          >
            <Search size={12} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="bg-transparent text-xs w-28 outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Priority filter */}
          <div className="flex gap-1">
            {(['all', 'P0', 'P1', 'P2', 'P3'] as const).map((p) => (
              <button
                key={p}
                onClick={() => { setPriorityFilter(p); setPage(0); }}
                className="px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all"
                style={
                  priorityFilter === p
                    ? { background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }
                    : { background: 'var(--bg-overlay)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
                }
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1">
            {(['all', 'active', 'resolved'] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className="px-2.5 py-1.5 rounded-md text-[10px] font-medium capitalize transition-all"
                style={
                  statusFilter === s
                    ? { background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }
                    : { background: 'var(--bg-overlay)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
                }
              >
                {s}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={handleRefresh}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
          >
            <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['ID', 'Title', 'Service', 'Priority', 'Team', 'Env', 'Time Open', 'Status', 'Severity'].map((h) => (
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
            <AnimatePresence mode="sync">
              {paginated.map((incident, i) => (
                <motion.tr
                  key={incident.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="group cursor-pointer"
                  style={{ borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <td className="px-4 py-3">
                    <Link href={`/war-room/${incident.id}`}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: severityColor[incident.severity] }}
                        />
                        <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {incident.id}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 max-w-[240px]">
                    <Link href={`/war-room/${incident.id}`}>
                      <p
                        className="text-xs font-medium truncate group-hover:text-blue-400 transition-colors"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {incident.title}
                      </p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {incident.service}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant="priority" value={incident.priority} showDot={false} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {incident.assignee && (
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                          style={{ background: incident.assignee.avatarColor }}
                        >
                          {incident.assignee.avatarInitials}
                        </div>
                      )}
                      <span className="text-[10px] truncate max-w-[80px]" style={{ color: 'var(--text-muted)' }}>
                        {incident.team.split(' ')[0]}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{
                        background: incident.environment === 'production' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                        color: incident.environment === 'production' ? '#FCA5A5' : '#FCD34D',
                      }}
                    >
                      {incident.environment.slice(0, 4)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                      {timeOpen(incident.createdAt, incident.resolvedAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant="status" value={incident.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge variant="severity" value={incident.severity} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 transition-all"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-xs disabled:opacity-40 transition-all"
              style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
