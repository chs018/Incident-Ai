'use client';

import { motion } from 'framer-motion';
import {
  Server,
  Globe,
  Cloud,
  Users,
  DollarSign,
  UserCheck,
  Clock,
  Tag,
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Incident } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';

interface IncidentOverviewCardProps {
  incident: Incident;
}

const phases = [
  { id: 1, label: 'Alerted', status: 'completed' },
  { id: 2, label: 'Investigating', status: 'current' },
  { id: 3, label: 'Mitigating', status: 'pending' },
  { id: 4, label: 'Resolved', status: 'pending' },
];

export function IncidentOverviewCard({ incident }: IncidentOverviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-5 space-y-5 rounded-2xl border relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      {/* Top ambient glow */}
      <div
        className="absolute -top-24 -left-24 w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-20"
        style={{ background: incident.severity === 'critical' ? '#EF4444' : '#3B82F6' }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Server size={16} className="text-blue-400 shrink-0" />
            <h3 className="text-base font-bold text-white tracking-tight">
              {incident.service}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Core production microservice &middot; API Gateway
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <StatusBadge variant="status" value={incident.status} />
          <StatusBadge variant="severity" value={incident.severity} />
        </div>
      </div>

      {/* Incident Lifecycle Progress Bar */}
      <div className="space-y-2 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Activity size={13} className="text-blue-400 animate-pulse" />
            <span>Current Phase: Investigating</span>
          </span>
          <span className="text-blue-400 font-mono text-[11px]">Phase 2 / 4</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {phases.map((p) => (
            <div key={p.id} className="space-y-1">
              <div
                className={cn(
                  'h-1.5 rounded-full transition-all duration-500',
                  p.status === 'completed' && 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
                  p.status === 'current' && 'bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]',
                  p.status === 'pending' && 'bg-slate-800'
                )}
              />
              <span
                className={cn(
                  'block text-[9px] font-medium text-center truncate',
                  p.status === 'completed' && 'text-emerald-400',
                  p.status === 'current' && 'text-blue-300 font-bold',
                  p.status === 'pending' && 'text-slate-500'
                )}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of operational attributes */}
      <div className="grid grid-cols-2 gap-3">
        {/* Environment */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Globe size={13} className="text-indigo-400" />
            <span>Environment</span>
          </div>
          <p className="text-xs font-semibold text-white">Production</p>
          <p className="text-[10px] font-mono text-slate-500">us-east-1</p>
        </div>

        {/* Cloud Provider */}
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Cloud size={13} className="text-sky-400" />
            <span>Cloud Provider</span>
          </div>
          <p className="text-xs font-semibold text-white">AWS EKS Cluster</p>
          <p className="text-[10px] font-mono text-slate-500">k8s-prod-us-east-1</p>
        </div>

        {/* Affected Users */}
        <div className="p-3 rounded-xl bg-red-500/[0.06] border border-red-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-red-300 font-medium">
            <Users size={13} className="text-red-400" />
            <span>Affected Users</span>
          </div>
          <p className="text-sm font-extrabold text-white font-mono">84,200</p>
          <div className="flex items-center gap-1 text-[10px] text-red-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Active checkouts impacted</span>
          </div>
        </div>

        {/* Business Impact */}
        <div className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
            <DollarSign size={13} className="text-amber-400" />
            <span>Business Impact</span>
          </div>
          <p className="text-sm font-extrabold text-amber-300 font-mono">~$14,500 / min</p>
          <p className="text-[10px] text-amber-400/80 font-medium">Revenue at risk (SLA alert)</p>
        </div>
      </div>

      {/* Owner & MTTR Section */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3">
        {/* Owner */}
        <div className="flex items-center gap-2.5 min-w-0">
          {incident.assignee ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md"
              style={{ background: incident.assignee.avatarColor }}
            >
              {incident.assignee.avatarInitials}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
              ?
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Incident Owner</p>
            <p className="text-xs font-bold text-white truncate">
              {incident.assignee?.name ?? 'Unassigned'}
            </p>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-800 shrink-0" />

        {/* Estimated MTTR */}
        <div className="text-right shrink-0">
          <div className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            <Clock size={11} className="text-blue-400" />
            <span>Est. MTTR</span>
          </div>
          <p className="text-sm font-extrabold text-emerald-400 font-mono">
            14 mins
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
          <Tag size={13} className="text-slate-400" />
          <span>Incident Tags</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[
            `#p0-${incident.severity}`,
            `#${incident.service.toLowerCase().replace(/\s+/g, '-')}`,
            '#redis-leak',
            '#checkout-api',
            '#aws-eks',
            '#soc2-monitored',
          ].map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-colors hover:bg-white/[0.08]"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
