'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { serviceHealthData } from '@/lib/mock-data/dashboard';
import { ServiceHealth } from '@/types';

// ─── Progress bar ────────────────────────────────────────────

function MiniProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(148,163,184,0.1)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(value, 100)}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-[10px] font-mono w-8 shrink-0 text-right" style={{ color: 'var(--text-muted)' }}>
        {value}%
      </span>
    </div>
  );
}

// ─── Status config ───────────────────────────────────────────

const statusConfig: Record<ServiceHealth['status'], { label: string; color: string; bg: string; dot: string }> = {
  healthy: { label: 'Healthy', color: '#10B981', bg: 'rgba(16,185,129,0.1)', dot: '#10B981' },
  degraded: { label: 'Degraded', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', dot: '#F59E0B' },
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', dot: '#EF4444' },
  unknown: { label: 'Unknown', color: '#64748B', bg: 'rgba(100,116,139,0.1)', dot: '#64748B' },
};

// ─── Service Card ─────────────────────────────────────────────

function ServiceCard({ svc, delay }: { svc: ServiceHealth; delay: number }) {
  const sc = statusConfig[svc.status];
  const latencyDisplay = svc.latencyMs >= 1000
    ? `${(svc.latencyMs / 1000).toFixed(1)}s`
    : `${svc.latencyMs}ms`;
  const latencyColor = svc.latencyMs > 1000 ? '#EF4444' : svc.latencyMs > 200 ? '#F59E0B' : '#10B981';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className="glass-card p-4 group cursor-pointer relative overflow-hidden"
      style={svc.status === 'critical' ? { borderColor: 'rgba(239,68,68,0.2)', boxShadow: '0 0 16px rgba(239,68,68,0.06)' } : undefined}
    >
      {/* Status glow top border */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 rounded-t-lg"
        style={{ background: sc.dot }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {svc.displayName}
          </p>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {svc.version} · {svc.region}
          </p>
        </div>
        <span
          className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full"
          style={{ background: sc.bg, color: sc.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: sc.dot,
              boxShadow: svc.status === 'critical' ? `0 0 6px ${sc.dot}` : undefined,
            }}
          />
          {sc.label}
        </span>
      </div>

      {/* Metrics */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Latency</span>
          <span className="text-xs font-bold font-mono" style={{ color: latencyColor }}>{latencyDisplay}</span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>CPU</span>
          </div>
          <MiniProgressBar
            value={svc.cpuPercent}
            color={svc.cpuPercent > 85 ? '#EF4444' : svc.cpuPercent > 60 ? '#F59E0B' : '#3B82F6'}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Memory</span>
          </div>
          <MiniProgressBar
            value={svc.memoryPercent}
            color={svc.memoryPercent > 90 ? '#EF4444' : svc.memoryPercent > 70 ? '#F59E0B' : '#10B981'}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-[10px] font-medium uppercase" style={{ color: 'var(--text-muted)' }}>
          {svc.environment}
        </span>
        <span
          className="text-[10px] font-semibold"
          style={{ color: svc.uptime < 90 ? '#EF4444' : '#10B981' }}
        >
          {svc.uptime.toFixed(1)}% uptime
        </span>
      </div>
    </motion.div>
  );
}

// ─── System Health Panel ──────────────────────────────────────

export function SystemHealthPanel() {
  const healthyCount = serviceHealthData.filter(s => s.status === 'healthy').length;
  const degradedCount = serviceHealthData.filter(s => s.status === 'degraded').length;
  const criticalCount = serviceHealthData.filter(s => s.status === 'critical').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>System Health</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: '#10B981' }}>{healthyCount} healthy</span>
            {' · '}
            <span style={{ color: '#F59E0B' }}>{degradedCount} degraded</span>
            {' · '}
            <span style={{ color: '#EF4444' }}>{criticalCount} critical</span>
          </p>
        </div>
        <button
          className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ color: '#60A5FA', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}
        >
          Full map <ExternalLink size={10} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
        {serviceHealthData.map((svc, i) => (
          <ServiceCard key={svc.id} svc={svc} delay={0.25 + i * 0.06} />
        ))}
      </div>
    </motion.div>
  );
}
