'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Circle, ChevronRight, ExternalLink } from 'lucide-react';
import { Incident } from '@/types';

// ─── Default runbook steps ────────────────────────────────────
// Generated per incident severity — in production this would load from a runbook database

function getRunbookSteps(incident: Incident): string[] {
  const base = [
    `Acknowledge incident ${incident.id} and open war room`,
    `Notify on-call team via PagerDuty / Slack #incidents`,
    `Assess immediate blast radius — check ${incident.service} dashboard`,
    `Review recent deployments (last 2h) to ${incident.service}`,
    `Check error logs: kubectl logs -n production -l app=${incident.service} --since=30m`,
    `Inspect metrics: CPU, memory, latency, error rate`,
    `Attempt mitigation — restart pods or rollback if deployment regression confirmed`,
    `Validate mitigation — confirm error rate returning to baseline`,
    `Communicate status update to stakeholders`,
    `Post resolution note and start postmortem draft`,
  ];

  if (incident.severity === 'critical' || incident.priority === 'P0') {
    return [
      `🚨 PAGE CRITICAL: Escalate to L3 on-call engineer immediately`,
      `Declare major incident in Statuspage — set status to "Major Outage"`,
      ...base,
      `Schedule blameless postmortem within 48h of resolution`,
    ];
  }

  return base;
}

// ─── Runbook Panel ────────────────────────────────────────────

interface RunbookPanelProps {
  incident: Incident;
}

export function RunbookPanel({ incident }: RunbookPanelProps) {
  const steps = getRunbookSteps(incident);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const pct = steps.length > 0 ? Math.round((completed.size / steps.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <BookOpen size={15} style={{ color: '#06B6D4' }} />
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Incident Runbook</h2>
        </div>
        {incident.runbook && (
          <a href={incident.runbook} target="_blank" rel="noopener noreferrer">
            <button
              className="flex items-center gap-1.5 text-xs transition-all hover:opacity-80"
              style={{ color: '#60A5FA' }}
            >
              Full runbook <ExternalLink size={10} />
            </button>
          </a>
        )}
      </div>

      <div className="p-5">
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
              Progress
            </span>
            <span className="text-xs font-bold" style={{ color: pct === 100 ? '#10B981' : 'var(--text-secondary)' }}>
              {completed.size}/{steps.length} steps
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.08)' }}>
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full"
              style={{
                background: pct === 100
                  ? 'linear-gradient(90deg, #10B981, #34D399)'
                  : 'linear-gradient(90deg, #3B82F6, #6366F1)',
              }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div className="space-y-2">
          {steps.map((step, i) => {
            const done = completed.has(i);
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.04 }}
                onClick={() => toggle(i)}
                className="flex items-start gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-all group"
                style={{
                  background: done ? 'rgba(16,185,129,0.05)' : 'rgba(148,163,184,0.02)',
                  border: `1px solid ${done ? 'rgba(16,185,129,0.15)' : 'var(--border-subtle)'}`,
                }}
              >
                {done ? (
                  <CheckCircle2 size={14} style={{ color: '#10B981' }} className="shrink-0 mt-0.5" />
                ) : (
                  <Circle size={14} style={{ color: 'var(--text-disabled)' }} className="shrink-0 mt-0.5 group-hover:text-blue-400 transition-colors" />
                )}
                <span
                  className="text-xs leading-relaxed transition-all"
                  style={{
                    color: done ? 'var(--text-muted)' : 'var(--text-secondary)',
                    textDecoration: done ? 'line-through' : 'none',
                    opacity: done ? 0.7 : 1,
                  }}
                >
                  <span
                    className="font-mono text-[10px] mr-2"
                    style={{ color: 'var(--text-disabled)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {step}
                </span>
              </motion.button>
            );
          })}
        </div>

        {pct === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <CheckCircle2 size={14} style={{ color: '#10B981' }} />
            <p className="text-xs font-semibold" style={{ color: '#34D399' }}>
              All steps complete — ready to resolve incident
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
