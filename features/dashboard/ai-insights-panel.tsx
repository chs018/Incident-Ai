'use client';

import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Zap, ChevronRight } from 'lucide-react';
import { aiInsights } from '@/lib/mock-data/dashboard';
import { AIInsight, IncidentSeverity } from '@/types';
import { timeAgo } from '@/lib/utils';

const severityColor: Record<IncidentSeverity, { text: string; bg: string; border: string }> = {
  critical: { text: '#FCA5A5', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  high: { text: '#FD9C6E', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
  medium: { text: '#FCD34D', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  low: { text: '#6EE7B7', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
};

const typeIcon: Record<AIInsight['type'], React.ElementType> = {
  anomaly: AlertTriangle,
  regression: TrendingUp,
  trend: TrendingUp,
  prediction: Zap,
};

const typeColor: Record<AIInsight['type'], string> = {
  anomaly: '#EF4444',
  regression: '#F59E0B',
  trend: '#3B82F6',
  prediction: '#8B5CF6',
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(148,163,184,0.1)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{
            background: value >= 90 ? '#10B981' : value >= 75 ? '#3B82F6' : '#F59E0B',
          }}
        />
      </div>
      <span className="text-[10px] font-bold w-8 shrink-0" style={{ color: 'var(--text-muted)' }}>
        {value}%
      </span>
    </div>
  );
}

export function AIInsightsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="glass-card overflow-hidden h-full"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            <Brain size={14} style={{ color: '#A78BFA' }} />
          </div>
          <div>
            <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              AI Incident Insights
            </h2>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Groq · llama-3.3-70b-versatile
            </p>
          </div>
        </div>
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          Live
        </span>
      </div>

      {/* Insights list */}
      <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
        {aiInsights.map((insight, i) => {
          const sc = severityColor[insight.severity];
          const TypeIcon = typeIcon[insight.type];

          return (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="px-5 py-4 group cursor-pointer hover:bg-white/[0.02] transition-colors"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <TypeIcon size={12} style={{ color: typeColor[insight.type] }} className="shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>
                    {insight.title}
                  </p>
                </div>
                <span
                  className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
                >
                  {insight.severity}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'var(--text-muted)' }}>
                {insight.description}
              </p>

              {/* Confidence + meta */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    AI Confidence
                  </span>
                </div>
                <ConfidenceBar value={insight.confidence} />
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                    style={{ background: 'rgba(148,163,184,0.08)', color: 'var(--text-muted)' }}
                  >
                    {insight.service}
                  </span>
                  <span
                    className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: `${typeColor[insight.type]}10`,
                      color: typeColor[insight.type],
                    }}
                  >
                    {insight.type}
                  </span>
                </div>
                <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }} suppressHydrationWarning>
                  {timeAgo(insight.timestamp)}
                </span>
              </div>

              {insight.actionable && (
                <button
                  className="mt-2.5 flex items-center gap-1 text-[10px] font-semibold transition-colors"
                  style={{ color: '#60A5FA' }}
                >
                  View recommendation <ChevronRight size={10} />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
