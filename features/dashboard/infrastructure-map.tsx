'use client';

import { motion } from 'framer-motion';
import { Users, GitMerge, Shield, CreditCard, Lock, ShoppingCart, Database, Server, Activity } from 'lucide-react';
import { infraNodes } from '@/lib/mock-data/dashboard';

const iconMap: Record<string, React.ElementType> = {
  users: Users,
  'git-merge': GitMerge,
  shield: Shield,
  'credit-card': CreditCard,
  lock: Lock,
  'shopping-cart': ShoppingCart,
  database: Database,
  server: Server,
  activity: Activity,
};

const statusConfig: Record<string, { color: string; bg: string; border: string; glow?: string }> = {
  healthy: { color: '#10B981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.15)' },
  degraded: { color: '#F59E0B', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)', glow: 'rgba(245,158,11,0.12)' },
  critical: { color: '#EF4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', glow: 'rgba(239,68,68,0.15)' },
};

// ─── Connector arrow ─────────────────────────────────────────

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <div className="w-px h-5" style={{ background: 'var(--border-subtle)' }} />
      <svg width="10" height="6" viewBox="0 0 10 6">
        <path d="M5 6L0 0H10L5 6Z" fill="var(--text-disabled)" />
      </svg>
      {label && (
        <span className="text-[9px] font-medium" style={{ color: 'var(--text-disabled)' }}>{label}</span>
      )}
    </div>
  );
}

// ─── Infrastructure Node ──────────────────────────────────────

function InfraNode({ node, delay }: { node: typeof infraNodes[0]; delay: number }) {
  const sc = statusConfig[node.status];
  const Icon = iconMap[node.icon] || Activity;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.03, transition: { duration: 0.15 } }}
      className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl cursor-pointer relative"
      style={{
        background: sc.bg,
        border: `1px solid ${sc.border}`,
        boxShadow: sc.glow ? `0 0 16px ${sc.glow}` : undefined,
        minWidth: 110,
      }}
    >
      {/* Status dot */}
      <div
        className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
        style={{
          background: sc.color,
          boxShadow: node.status !== 'healthy' ? `0 0 6px ${sc.color}` : undefined,
        }}
      />

      <div
        className="flex items-center justify-center w-9 h-9 rounded-xl"
        style={{ background: `${sc.color}15`, border: `1px solid ${sc.color}25` }}
      >
        <Icon size={16} style={{ color: sc.color }} />
      </div>
      <p className="text-xs font-semibold text-center" style={{ color: 'var(--text-primary)' }}>
        {node.label}
      </p>
      <p className="text-[9px] text-center font-mono" style={{ color: 'var(--text-muted)' }}>
        {node.sublabel}
      </p>
    </motion.div>
  );
}

// ─── Infrastructure Map ───────────────────────────────────────

export function InfrastructureMap() {
  // Group nodes by level
  const byLevel = infraNodes.reduce<Record<number, typeof infraNodes>>((acc, n) => {
    acc[n.level] = acc[n.level] || [];
    acc[n.level].push(n);
    return acc;
  }, {});

  const levelLabels: Record<number, string | undefined> = {
    1: 'HTTPS 443',
    2: 'Routes traffic',
    3: 'Microservices',
    4: 'Persistence',
    5: 'Observability',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Infrastructure Map</h2>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Live topology · React Flow integration planned
          </p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { label: 'Healthy', color: '#10B981' },
            { label: 'Degraded', color: '#F59E0B' },
            { label: 'Critical', color: '#EF4444' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Topology tree */}
      <div className="flex flex-col items-center gap-0">
        {Object.entries(byLevel).map(([levelStr, nodes], i) => {
          const level = parseInt(levelStr);
          return (
            <div key={level} className="flex flex-col items-center w-full">
              {level > 0 && <Connector label={levelLabels[level]} />}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {nodes.map((node, j) => (
                  <InfraNode
                    key={node.id}
                    node={node}
                    delay={0.5 + i * 0.08 + j * 0.05}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
