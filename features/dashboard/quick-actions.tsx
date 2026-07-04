'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus, FileText, Terminal, BarChart2,
  UserPlus, Download, ChevronUp,
  TrendingUp, Sheet,
} from 'lucide-react';
import { CreateIncidentModal } from '@/features/dashboard/create-incident-modal';

// ─── Action config ────────────────────────────────────────────

const actions = [
  {
    id: 'new-incident',
    label: 'Create Incident',
    icon: Plus,
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.2)',
    shortcut: 'C',
  },
  {
    id: 'upload-logs',
    label: 'Upload Logs',
    icon: FileText,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.18)',
    shortcut: 'U',
  },
  {
    id: 'diagnostics',
    label: 'Run Diagnostics',
    icon: Terminal,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.18)',
    shortcut: 'D',
  },
  {
    id: 'report',
    label: 'Generate Report',
    icon: BarChart2,
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.1)',
    border: 'rgba(139,92,246,0.18)',
    shortcut: 'R',
  },
  {
    id: 'analytics',
    label: 'View Analytics',
    icon: TrendingUp,
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.18)',
    shortcut: 'A',
    href: '/analytics',
  },
  {
    id: 'export-csv',
    label: 'Export CSV',
    icon: Sheet,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.15)',
    shortcut: 'X',
  },
  {
    id: 'invite',
    label: 'Invite Team',
    icon: UserPlus,
    color: '#06B6D4',
    bg: 'rgba(6,182,212,0.1)',
    border: 'rgba(6,182,212,0.18)',
    shortcut: 'I',
  },
  {
    id: 'export',
    label: 'Export Dashboard',
    icon: Download,
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.1)',
    border: 'rgba(167,139,250,0.18)',
    shortcut: 'E',
  },
];

// ─── Quick Actions FAB ────────────────────────────────────────

export function QuickActions() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const handleAction = (id: string) => {
    setOpen(false);
    switch (id) {
      case 'new-incident':
        setCreateOpen(true);
        break;
      case 'analytics':
        router.push('/analytics');
        break;
      case 'invite':
        router.push('/settings');
        break;
      default:
        // For actions without a real target yet, provide visual feedback via the FAB button
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Action buttons */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-end gap-2"
          >
            {actions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.04, x: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleAction(action.id)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all glass-card shadow-xl cursor-pointer"
                  style={{
                    border: `1px solid ${action.border}`,
                    color: 'var(--text-primary)',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px ${action.border}`,
                    minWidth: 180,
                  }}
                >
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0"
                    style={{ background: action.bg }}
                  >
                    <Icon size={13} style={{ color: action.color }} />
                  </div>
                  <span className="flex-1 text-left">{action.label}</span>
                  <kbd
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto"
                    style={{ background: 'rgba(148,163,184,0.15)', color: 'var(--text-muted)' }}
                  >
                    {action.shortcut}
                  </kbd>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-bold text-white transition-all"
        style={{
          background: open
            ? 'linear-gradient(135deg, #6366F1, #4F46E5)'
            : 'linear-gradient(135deg, #3B82F6, #6366F1)',
          boxShadow: open
            ? '0 8px 32px rgba(99,102,241,0.5)'
            : '0 8px 32px rgba(59,130,246,0.4)',
        }}
        aria-label="Quick Actions"
        aria-expanded={open}
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          {open ? <ChevronUp size={16} /> : <Plus size={16} />}
        </motion.div>
        {open ? 'Close' : 'Quick Actions'}
      </motion.button>

      {/* Create Incident Modal */}
      <CreateIncidentModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
