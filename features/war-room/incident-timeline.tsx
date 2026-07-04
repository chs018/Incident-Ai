'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle, CheckCircle2, Search, Wrench,
  MessageSquare, Radio, Shield, ChevronRight, LucideIcon,
} from 'lucide-react';
import { TimelineEvent } from '@/types';

// ─── Timeline event type config ───────────────────────────────

const typeConfig: Record<
  TimelineEvent['type'],
  { icon: LucideIcon; color: string; bg: string; label: string }
> = {
  detection:     { icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.12)',     label: 'Detection' },
  acknowledgment:{ icon: CheckCircle2,  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',    label: 'Acknowledged' },
  investigation: { icon: Search,        color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',    label: 'Investigation' },
  action:        { icon: Wrench,        color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)',    label: 'Action Taken' },
  update:        { icon: MessageSquare, color: '#06B6D4', bg: 'rgba(6,182,212,0.12)',     label: 'Update' },
  resolution:    { icon: Shield,        color: '#10B981', bg: 'rgba(16,185,129,0.12)',    label: 'Resolution' },
};

function formatTime(ts: string): { date: string; time: string } {
  const d = new Date(ts);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
  };
}

// ─── Timeline empty state ─────────────────────────────────────

function EmptyTimeline() {
  return (
    <div className="py-10 text-center">
      <Radio size={24} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No timeline events yet</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-disabled)' }}>Events will appear here as the incident progresses</p>
    </div>
  );
}

// ─── Incident Timeline ────────────────────────────────────────

interface IncidentTimelineProps {
  events: TimelineEvent[];
}

export function IncidentTimeline({ events }: IncidentTimelineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Incident Timeline
          </h2>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(59,130,246,0.1)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            {events.length} events
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="pulse-dot pulse-dot-green w-1.5 h-1.5" />
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Live</span>
        </div>
      </div>

      {/* Events */}
      <div className="px-5 py-5 relative">
        {events.length === 0 ? (
          <EmptyTimeline />
        ) : (
          <>
            {/* Vertical connector line */}
            <div
              className="absolute left-[30px] top-6 bottom-6 w-px"
              style={{ background: 'linear-gradient(to bottom, var(--border-subtle), transparent)' }}
            />

            <div className="space-y-0">
              {events.map((event, i) => {
                const tc = typeConfig[event.type];
                const Icon = tc.icon;
                const { date, time } = formatTime(event.timestamp);
                const isLast = i === events.length - 1;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.35 }}
                    className="flex gap-4 pb-6 relative"
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 z-10 relative mt-0.5"
                      style={{
                        background: tc.bg,
                        border: `1px solid ${tc.color}30`,
                        boxShadow: isLast ? `0 0 12px ${tc.color}30` : undefined,
                      }}
                    >
                      <Icon size={13} style={{ color: tc.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          {/* Type badge + actor */}
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                              style={{ background: tc.bg, color: tc.color }}
                            >
                              {tc.label}
                            </span>
                            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                              {event.actor}
                            </span>
                          </div>

                          {/* Action */}
                          <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                            {event.action}
                          </p>

                          {/* Detail */}
                          <p
                            className="text-xs leading-relaxed px-3 py-2 rounded-lg"
                            style={{
                              color: 'var(--text-muted)',
                              background: 'rgba(148,163,184,0.04)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {event.detail}
                          </p>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{time}</p>
                          <p className="text-[9px]" style={{ color: 'var(--text-disabled)' }}>{date}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Add update CTA */}
      <div
        className="px-5 py-3 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <button
          className="flex items-center gap-2 text-xs transition-colors hover:opacity-80"
          style={{ color: '#60A5FA' }}
        >
          <ChevronRight size={12} />
          Post timeline update
        </button>
      </div>
    </motion.div>
  );
}
