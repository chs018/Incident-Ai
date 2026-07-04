'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Flame, Clock, ChevronDown, ExternalLink,
  Copy, CheckCheck, AlertTriangle, User, Shield,
} from 'lucide-react';
import Link from 'next/link';
import { Incident, IncidentStatus, IncidentPriority } from '@/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { formatDuration } from '@/lib/utils';

// ─── Live MTTR Timer ──────────────────────────────────────────

function LiveTimer({ createdAt, resolvedAt }: { createdAt: string; resolvedAt: string | null }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(createdAt).getTime();
    const end = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();

    const compute = () => {
      const now = resolvedAt ? new Date(resolvedAt).getTime() : Date.now();
      // Use abs to handle mock data with future timestamps gracefully
      setElapsed(Math.abs(Math.floor((now - start) / 1000)));
    };
    compute();

    if (!resolvedAt) {
      const interval = setInterval(compute, 1000);
      return () => clearInterval(interval);
    }
  }, [createdAt, resolvedAt]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;

  const color = elapsed > 3600 ? '#EF4444' : elapsed > 1800 ? '#F59E0B' : '#10B981';

  return (
    <div className="flex items-center gap-2">
      <Clock size={13} style={{ color }} />
      <span
        className="font-mono text-sm font-bold tabular-nums"
        style={{ color }}
      >
        {h > 0 && `${String(h).padStart(2, '0')}:`}
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {resolvedAt ? 'MTTR' : 'open'}
      </span>
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1 rounded transition-colors hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
      {copied ? <CheckCheck size={12} style={{ color: '#10B981' }} /> : <Copy size={12} />}
    </button>
  );
}

// ─── Status Selector ──────────────────────────────────────────

const statusOptions: IncidentStatus[] = ['active', 'investigating', 'mitigating', 'resolved', 'postmortem'];
const priorityOptions: IncidentPriority[] = ['P0', 'P1', 'P2', 'P3'];

const statusColors: Record<IncidentStatus, string> = {
  active: '#EF4444', investigating: '#F59E0B', mitigating: '#3B82F6',
  resolved: '#10B981', postmortem: '#8B5CF6',
};

interface IncidentHeaderProps {
  incident: Incident;
}

export function IncidentHeader({ incident }: IncidentHeaderProps) {
  const [status, setStatus] = useState<IncidentStatus>(incident.status);
  const [priority, setPriority] = useState<IncidentPriority>(incident.priority);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [showPriorityDrop, setShowPriorityDrop] = useState(false);

  const isCritical = incident.severity === 'critical' && !['resolved', 'postmortem'].includes(status);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: isCritical
          ? 'linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(15,23,42,0.95) 60%)'
          : 'linear-gradient(135deg, rgba(59,130,246,0.04) 0%, rgba(15,23,42,0.95) 60%)',
        border: isCritical ? '1px solid rgba(239,68,68,0.18)' : '1px solid var(--border-default)',
        boxShadow: isCritical ? '0 0 40px rgba(239,68,68,0.08)' : 'none',
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-20 rounded-2xl" />

      <div className="relative z-10 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/war-room">
            <button
              className="flex items-center gap-1.5 text-xs transition-colors hover:text-blue-400"
              style={{ color: 'var(--text-muted)' }}
            >
              <ArrowLeft size={12} />
              War Room
            </button>
          </Link>
          <span style={{ color: 'var(--text-disabled)' }}>/</span>
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{incident.id}</span>
        </div>

        {/* Main header row */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          {/* Left: severity bar + title */}
          <div className="flex gap-4 flex-1 min-w-0">
            {/* Severity indicator bar */}
            <div
              className="w-1.5 self-stretch rounded-full shrink-0"
              style={{
                background: incident.severity === 'critical' ? '#EF4444'
                  : incident.severity === 'high' ? '#F97316'
                  : incident.severity === 'medium' ? '#F59E0B' : '#10B981',
                boxShadow: isCritical ? '0 0 12px rgba(239,68,68,0.6)' : undefined,
              }}
            />

            <div className="min-w-0 flex-1">
              {/* ID + badges row */}
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>
                    {incident.id}
                  </span>
                  <CopyButton text={incident.id} />
                </div>
                {isCritical && (
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="flex items-center gap-1.5"
                  >
                    <Flame size={12} style={{ color: '#EF4444' }} />
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#FCA5A5' }}>
                      P0 — Critical
                    </span>
                  </motion.div>
                )}
                <StatusBadge variant="severity" value={incident.severity} />
                <span
                  className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: incident.environment === 'production' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                    color: incident.environment === 'production' ? '#FCA5A5' : '#FCD34D',
                    border: incident.environment === 'production' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(245,158,11,0.2)',
                  }}
                >
                  {incident.environment}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-xl font-bold leading-snug mb-3"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                {incident.title}
              </h1>

              {/* Description */}
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {incident.description}
              </p>

              {/* Meta row */}
              <div className="flex items-center gap-5 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Service</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {incident.service}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Team</span>
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{incident.team}</span>
                </div>
                {incident.runbook && (
                  <a href={incident.runbook} target="_blank" rel="noopener noreferrer">
                    <button
                      className="flex items-center gap-1.5 text-xs transition-colors hover:opacity-80"
                      style={{ color: '#60A5FA' }}
                    >
                      Runbook <ExternalLink size={10} />
                    </button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: controls + timer */}
          <div className="flex flex-col gap-3 shrink-0 lg:items-end">
            {/* MTTR Timer */}
            <div
              className="px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid var(--border-default)' }}
            >
              <LiveTimer createdAt={incident.createdAt} resolvedAt={incident.resolvedAt} />
            </div>

            {/* Inline Status + Priority selectors */}
            <div className="flex gap-2">
              {/* Status dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowStatusDrop(v => !v); setShowPriorityDrop(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: `${statusColors[status]}14`,
                    border: `1px solid ${statusColors[status]}30`,
                    color: statusColors[status],
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[status] }} />
                  {status}
                  <ChevronDown size={10} />
                </button>
                {showStatusDrop && (
                  <div
                    className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden py-1 min-w-[140px]"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}
                  >
                    {statusOptions.map(s => (
                      <button
                        key={s}
                        onClick={() => { setStatus(s); setShowStatusDrop(false); }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left transition-colors hover:bg-white/5"
                        style={{ color: statusColors[s] }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors[s] }} />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Priority dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowPriorityDrop(v => !v); setShowStatusDrop(false); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {priority} <ChevronDown size={10} />
                </button>
                {showPriorityDrop && (
                  <div
                    className="absolute right-0 top-full mt-1 z-50 rounded-xl overflow-hidden py-1 min-w-[80px]"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-lg)' }}
                  >
                    {priorityOptions.map(p => (
                      <button
                        key={p}
                        onClick={() => { setPriority(p); setShowPriorityDrop(false); }}
                        className="w-full px-3 py-2 text-xs text-left font-bold transition-colors hover:bg-white/5"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Commander & Assignee */}
            <div className="flex gap-3">
              {incident.commander && (
                <div className="flex items-center gap-2">
                  <Shield size={11} style={{ color: 'var(--text-muted)' }} />
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: incident.commander.avatarColor }}
                  >
                    {incident.commander.avatarInitials}
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {incident.commander.name.split(' ')[0]}
                  </span>
                </div>
              )}
              {incident.assignee && (
                <div className="flex items-center gap-2">
                  <User size={11} style={{ color: 'var(--text-muted)' }} />
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: incident.assignee.avatarColor }}
                  >
                    {incident.assignee.avatarInitials}
                  </div>
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {incident.assignee.name.split(' ')[0]}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Action Bar: Affected Services & Primary Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Affected services chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>
              Affected
            </span>
            {incident.affectedServices.map(svc => (
              <span
                key={svc}
                className="text-[10px] font-mono font-bold px-2 py-1 rounded-md"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                {svc}
              </span>
            ))}
          </div>

          {/* Action Buttons: Resolve, Escalate, Assign, Export */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
            <button
              onClick={() => setStatus('resolved')}
              disabled={status === 'resolved'}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md disabled:opacity-50 disabled:pointer-events-none"
              style={{
                background: status === 'resolved' ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                boxShadow: status === 'resolved' ? 'none' : '0 2px 10px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CheckCheck size={14} />
              <span>{status === 'resolved' ? 'Resolved' : 'Resolve Incident'}</span>
            </button>

            <button
              onClick={() => { setPriority('P0'); setStatus('active'); }}
              disabled={priority === 'P0' && status === 'active'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertTriangle size={13} className="text-red-400" />
              <span>Escalate</span>
            </button>

            <button
              onClick={() => alert(`Assigning primary incident commander for ${incident.id}...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-white/[0.08]"
              style={{
                background: 'var(--bg-overlay)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <User size={13} className="text-blue-400" />
              <span>Assign</span>
            </button>

            <button
              onClick={() => alert(`Exporting SOC2 compliance report for ${incident.id}...`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:bg-white/[0.08]"
              style={{
                background: 'var(--bg-overlay)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <ExternalLink size={13} className="text-emerald-400" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
