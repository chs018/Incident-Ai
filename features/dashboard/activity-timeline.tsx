'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2, Rocket, RefreshCw, Brain, ShieldCheck,
  AlertTriangle, Plus, LucideIcon,
} from 'lucide-react';
import { activityItems } from '@/lib/mock-data/dashboard';
import { ActivityItem } from '@/types';
import { timeAgo } from '@/lib/utils';

// ─── Activity type config ─────────────────────────────────────

const typeConfig: Record<ActivityItem['type'], { icon: LucideIcon; color: string; bg: string }> = {
  resolve:  { icon: CheckCircle2, color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  deploy:   { icon: Rocket,       color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  restart:  { icon: RefreshCw,    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  ai:       { icon: Brain,        color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  security: { icon: ShieldCheck,  color: '#06B6D4', bg: 'rgba(6,182,212,0.12)' },
  alert:    { icon: AlertTriangle,color: '#F97316', bg: 'rgba(249,115,22,0.12)' },
  create:   { icon: Plus,         color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
};

export function ActivityTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="glass-card overflow-hidden h-full"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Last 24h</span>
      </div>

      {/* Timeline */}
      <div className="px-5 py-4 space-y-0 relative">
        {/* Vertical line */}
        <div
          className="absolute left-[32px] top-4 bottom-4 w-px"
          style={{ background: 'var(--border-subtle)' }}
        />

        {activityItems.map((item, i) => {
          const tc = typeConfig[item.type];
          const Icon = tc.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + i * 0.06 }}
              className="flex gap-4 pb-5 relative"
            >
              {/* Icon dot */}
              <div
                className="flex items-center justify-center w-7 h-7 rounded-full shrink-0 z-10 relative"
                style={{ background: tc.bg, border: `1px solid ${tc.color}30` }}
              >
                <Icon size={12} style={{ color: tc.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {/* Avatar */}
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                        style={{ background: item.avatarColor }}
                      >
                        {item.avatarInitials.slice(0, 1)}
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.actor}
                      </span>
                      <span
                        className="text-[9px] font-medium"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {item.actorRole}
                      </span>
                    </div>
                    <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                      {item.action}{' '}
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.target}
                      </span>
                    </p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: 'var(--text-disabled)' }} suppressHydrationWarning>
                    {timeAgo(item.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
