'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RotateCcw,
  Ticket,
  Bell,
  Sparkles,
  Download,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Command,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionItem {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
  variant?: 'default' | 'primary' | 'destructive' | 'success' | 'ai';
  toast: string;
}

const actions: ActionItem[] = [
  {
    id: 'act-restart',
    label: 'Restart Service Pods',
    shortcut: '⌘R',
    icon: <RotateCcw size={15} className="text-sky-400" />,
    toast: 'Triggered rolling restart for payment-api across 12 EKS pods.',
  },
  {
    id: 'act-jira',
    label: 'Create Linear / Jira Ticket',
    shortcut: '⌘L',
    icon: <Ticket size={15} className="text-blue-400" />,
    toast: 'Creating engineering ticket in Linear...',
  },
  {
    id: 'act-notify',
    label: 'Notify PagerDuty & Slack',
    shortcut: '⌘N',
    icon: <Bell size={15} className="text-amber-400" />,
    toast: 'Broadcasting live briefing to Slack channel...',
  },
  {
    id: 'act-ai',
    label: 'Request AI Analysis',
    shortcut: '⌘A',
    icon: <Sparkles size={15} className="text-purple-400" />,
    variant: 'ai',
    toast: 'Groq AI re-analyzing live telemetry streams and memory dumps...',
  },
  {
    id: 'act-export',
    label: 'Export Incident Report',
    shortcut: '⌘E',
    icon: <Download size={15} className="text-emerald-400" />,
    toast: 'Exporting SOC2 Type II Incident Summary Report PDF...',
  },
  {
    id: 'act-postmortem',
    label: 'Sync Postmortem Tickets',
    shortcut: '⌘P',
    icon: <FileText size={15} className="text-indigo-400" />,
    toast: 'Syncing action items to Linear tickets...',
  },
  {
    id: 'act-escalate',
    label: 'Escalate Severity',
    shortcut: '⌘⇧E',
    icon: <AlertOctagon size={15} className="text-red-400" />,
    variant: 'destructive',
    toast: 'Escalated severity to P0 Critical! Executive leadership notified.',
  },
  {
    id: 'act-resolve',
    label: 'Mark Incident Resolved',
    shortcut: '⌘⇧R',
    icon: <CheckCircle2 size={15} className="text-emerald-400" />,
    variant: 'success',
    toast: 'Incident marked RESOLVED! SLA timer stopped at 14m 12s.',
  },
];

interface QuickActionsPanelProps {
  incidentId?: string;
}

export function QuickActionsPanel({ incidentId }: QuickActionsPanelProps) {
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const handleAction = async (item: ActionItem) => {
    setActiveToast(item.toast);

    if (incidentId && (item.id === 'act-notify' || item.id === 'act-jira' || item.id === 'act-postmortem')) {
      try {
        const actionType = item.id === 'act-notify' ? 'slack_broadcast' : item.id === 'act-jira' ? 'create_ticket' : 'sync_postmortem_tickets';
        const res = await fetch(`/api/incidents/${incidentId}/actions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: actionType }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.toast) {
            setActiveToast(data.toast);
          }
        }
      } catch (err) {
        console.error('Failed to trigger live action:', err);
      }
    }

    setTimeout(() => setActiveToast(null), 4000);
  };

  return (
    <div className="glass-card rounded-2xl border p-5 space-y-4 relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Toast Overlay */}
      <AnimatePresence>
        {activeToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute inset-x-3 bottom-3 z-30 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-blue-400/30 backdrop-blur-md"
          >
            <Zap size={15} className="text-amber-300 shrink-0 animate-bounce" />
            <span className="flex-1 leading-snug">{activeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Command size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Quick Actions</h3>
            <p className="text-[11px] text-slate-400">
              One-click operational triggers &middot; Cmd+K enabled
            </p>
          </div>
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 gap-2">
        {actions.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => handleAction(item)}
            whileHover={{ scale: 1.01, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'w-full p-2.5 rounded-xl border flex items-center justify-between gap-3 text-left transition-all group',
              item.variant === 'ai' && 'bg-purple-500/[0.08] border-purple-500/30 hover:bg-purple-500/15 text-purple-200',
              item.variant === 'destructive' && 'bg-red-500/[0.08] border-red-500/30 hover:bg-red-500/15 text-red-300',
              item.variant === 'success' && 'bg-emerald-500/[0.08] border-emerald-500/30 hover:bg-emerald-500/15 text-emerald-300 font-bold',
              (!item.variant || item.variant === 'default') && 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200'
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <span className="text-xs font-semibold truncate">
                {item.label}
              </span>
            </div>

            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400 border border-white/[0.06] shrink-0 group-hover:text-slate-200 transition-colors">
              {item.shortcut}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
