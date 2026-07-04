'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, AlertTriangle, Plus, ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { activeIncidents, dashboardMetrics } from '@/lib/mock-data/incidents';
import { CreateIncidentModal } from '@/features/dashboard/create-incident-modal';

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Only start rendering after mount to prevent SSR/CSR hydration mismatch
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!time) return null;

  return (
    <span className="font-mono text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
      {' '}
      <span style={{ color: 'var(--text-muted)' }}>
        {Intl.DateTimeFormat().resolvedOptions().timeZone}
      </span>
    </span>
  );
}

function PlatformStatusBadge() {
  const hasCritical = activeIncidents.some(i => i.priority === 'P0');
  const hasHigh = activeIncidents.some(i => i.priority === 'P1');
  if (hasCritical) {
    return (
      <span
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(239,68,68,0.1)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.25)' }}
      >
        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        DEGRADED — P0 Active
      </span>
    );
  }
  if (hasHigh) {
    return (
      <span
        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.25)' }}
      >
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        PARTIAL OUTAGE
      </span>
    );
  }
  return (
    <span
      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
      style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.25)' }}
    >
      <span className="w-2 h-2 rounded-full bg-emerald-400" />
      ALL SYSTEMS OPERATIONAL
    </span>
  );
}

export function HeroHeader() {
  const [mounted, setMounted] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Use stable values during SSR, real values after mount
  const hour = mounted ? new Date().getHours() : 9;
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = mounted
    ? new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    : '';
  const p0Count = activeIncidents.filter(i => i.priority === 'P0').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 glass-card"
      style={{
        boxShadow: p0Count > 0 ? '0 0 40px rgba(239,68,68,0.08)' : '0 0 40px rgba(59,130,246,0.05)',
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: p0Count > 0 ? 'rgba(239,68,68,0.04)' : 'rgba(59,130,246,0.04)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-60 h-60 rounded-full pointer-events-none"
        style={{ background: 'rgba(139,92,246,0.03)', filter: 'blur(50px)' }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 rounded-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        {/* Left: greeting + org */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', boxShadow: '0 0 20px rgba(59,130,246,0.35)' }}
            >
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold leading-tight" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {greeting}, Harshini 👋
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                CloudNova Technologies{dateStr ? ` · ${dateStr}` : ''}
              </p>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <PlatformStatusBadge />
            <LiveClock />
            {p0Count > 0 && (
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="flex items-center gap-1.5"
              >
                <AlertTriangle size={12} style={{ color: '#EF4444' }} />
                <span className="text-xs font-bold" style={{ color: '#FCA5A5' }}>
                  {p0Count} P0 incident{p0Count > 1 ? 's' : ''} require attention
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right: KPI summary + quick actions */}
        <div className="flex items-center gap-4">
          {/* Quick stats */}
          <div className="hidden md:flex items-center gap-5">
            <div className="text-right">
              <p
                className="text-3xl font-extrabold leading-none"
                style={{ color: p0Count > 0 ? '#FCA5A5' : 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                {dashboardMetrics.activeIncidents}
              </p>
              <p className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Active Incidents
              </p>
            </div>
            <div className="w-px h-10" style={{ background: 'var(--border-subtle)' }} />
            <div className="text-right">
              <p
                className="text-3xl font-extrabold leading-none"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                {dashboardMetrics.resolvedThisWeek}
              </p>
              <p className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Resolved Today
              </p>
            </div>
            <div className="w-px h-10" style={{ background: 'var(--border-subtle)' }} />
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <CheckCircle2 size={12} style={{ color: '#10B981' }} />
                <p className="text-sm font-bold" style={{ color: '#34D399' }}>
                  {dashboardMetrics.slaCompliance}%
                </p>
              </div>
              <p className="text-[10px] mt-0.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                SLA Compliance
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            {p0Count > 0 && (
              <Link href="/war-room">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.8), rgba(220,38,38,0.9))',
                    color: 'white',
                    boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <AlertTriangle size={12} />
                  Open War Room
                  <ArrowRight size={12} />
                </motion.button>
              </Link>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                color: 'white',
                boxShadow: '0 4px 16px rgba(59,130,246,0.25)',
              }}
            >
              <Plus size={12} />
              New Incident
            </motion.button>
            <ThemeToggle />
            <CreateIncidentModal open={createOpen} onClose={() => setCreateOpen(false)} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
