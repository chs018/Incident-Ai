'use client';

import { motion } from 'framer-motion';
import { Layers, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Incident } from '@/types';

// ─── Status config ────────────────────────────────────────────

const serviceStatus: Record<string, 'critical' | 'degraded' | 'healthy'> = {
  'payment-api':            'critical',
  'session-cache':          'degraded',
  'analytics-db':           'critical',
  'recommendation-service': 'critical',
  'checkout-api':           'degraded',
  'auth-service':           'degraded',
  'api-gateway':            'healthy',
  'notification-worker':    'degraded',
  'storefront-api':         'degraded',
  'order-management':       'degraded',
  'inventory-service':      'healthy',
  'checkout-bff':           'degraded',
  'homepage-bff':           'healthy',
  'mobile-api':             'healthy',
  'partner-api':            'healthy',
  'user-api':               'degraded',
  'email-service':          'healthy',
  'push-service':           'healthy',
};

const statusConfig = {
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', Icon: AlertTriangle },
  degraded: { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', Icon: Clock },
  healthy:  { color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', Icon: CheckCircle2 },
};

// ─── Service node ─────────────────────────────────────────────

function ServiceNode({ name, isPrimary, delay }: { name: string; isPrimary: boolean; delay: number }) {
  const status = serviceStatus[name] ?? 'healthy';
  const sc = statusConfig[status];
  const Icon = sc.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ scale: 1.04, transition: { duration: 0.15 } }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
      style={{
        background: isPrimary
          ? `${sc.bg} linear-gradient(135deg, ${sc.color}10, transparent)`
          : sc.bg,
        border: `1px solid ${sc.border}`,
        boxShadow: isPrimary ? `0 0 16px ${sc.color}25` : undefined,
      }}
    >
      <Icon size={12} style={{ color: sc.color }} className="shrink-0" />
      <span
        className="text-[11px] font-mono font-semibold"
        style={{ color: isPrimary ? sc.color : 'var(--text-secondary)' }}
      >
        {name}
      </span>
      {isPrimary && (
        <span
          className="text-[8px] font-bold uppercase ml-auto px-1.5 py-0.5 rounded"
          style={{ background: `${sc.color}20`, color: sc.color }}
        >
          Origin
        </span>
      )}
    </motion.div>
  );
}

// ─── Blast Radius Map ─────────────────────────────────────────

interface BlastRadiusMapProps {
  incident: Incident;
}

export function BlastRadiusMap({ incident }: BlastRadiusMapProps) {
  const primary = incident.service;
  const affected = incident.affectedServices.filter(s => s !== primary);

  const criticalCount = incident.affectedServices.filter(s => (serviceStatus[s] ?? 'healthy') === 'critical').length;
  const degradedCount = incident.affectedServices.filter(s => (serviceStatus[s] ?? 'healthy') === 'degraded').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <Layers size={15} style={{ color: '#EF4444' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Blast Radius</h2>
        </div>
        <div className="flex gap-3 text-[10px]">
          <span style={{ color: '#EF4444' }}>{criticalCount} critical</span>
          <span style={{ color: '#F59E0B' }}>{degradedCount} degraded</span>
        </div>
      </div>

      <div className="p-5">
        {/* Origin */}
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
            Origin Service
          </p>
          <ServiceNode name={primary} isPrimary delay={0.45} />
        </div>

        {/* Animated Propagation Flow Connector */}
        {affected.length > 0 && (
          <>
            <div className="my-3 py-2 flex flex-col items-center justify-center relative">
              <div className="w-0.5 h-8 bg-gradient-to-b from-red-500 via-amber-500 to-blue-500 rounded-full relative overflow-hidden">
                <motion.div
                  animate={{ y: [-32, 32] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="w-full h-4 bg-white shadow-[0_0_8px_#ffffff] rounded-full"
                />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[9px] font-mono font-bold text-amber-300 shadow-md mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>Cascade Propagation (Live Telemetry)</span>
              </div>
            </div>

            {/* Affected services */}
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--text-muted)' }}>
                Affected Services ({affected.length})
              </p>
              <div className="grid grid-cols-1 gap-2">
                {affected.map((svc, i) => (
                  <ServiceNode key={svc} name={svc} isPrimary={false} delay={0.5 + i * 0.06} />
                ))}
              </div>
            </div>
          </>
        )}

        {affected.length === 0 && (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>
            No downstream services affected
          </p>
        )}

        {/* React Flow note */}
        <div
          className="mt-4 px-3 py-2 rounded-lg text-[10px]"
          style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid var(--border-subtle)', color: 'var(--text-disabled)' }}
        >
          🔗 Interactive topology via React Flow — planned in next iteration
        </div>
      </div>
    </motion.div>
  );
}
