'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, AlertTriangle, Plus, Loader2, CheckCircle2, ArrowRight,
  Tag, AlignLeft, Server, Zap, Users, Link2, ShieldAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const SEVERITIES = [
  { id: 'P0', label: 'P0 — Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)', desc: 'Complete outage · Immediate response' },
  { id: 'P1', label: 'P1 — High',     color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', desc: 'Major degradation · < 15 min SLA' },
  { id: 'P2', label: 'P2 — Medium',   color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  desc: 'Partial impact · < 2 hr SLA' },
  { id: 'P3', label: 'P3 — Low',      color: '#10B981', bg: 'rgba(16,185,129,0.12)', desc: 'Minor issue · Best effort' },
];

const SERVICES = [
  'payment-api', 'auth-gateway', 'postgres-db', 'redis-cluster',
  'analytics-service', 'checkout-api', 'search-engine', 'k8s-mesh', 'Other',
];

interface CreateIncidentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateIncidentModal({ open, onClose }: CreateIncidentModalProps) {
  const router = useRouter();
  const [severity, setSeverity] = useState('P1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState('payment-api');
  const [assignee, setAssignee] = useState('');
  const [runbookUrl, setRunbookUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'creating' | 'done'>('idle');

  const sel = SEVERITIES.find((s) => s.id === severity)!;

  const handleCreate = async () => {
    if (!title.trim()) return;
    setStatus('creating');
    // Simulate async creation (replace with Supabase insert when ready)
    await new Promise((r) => setTimeout(r, 1400));
    setStatus('done');
    await new Promise((r) => setTimeout(r, 800));
    onClose();
    // Navigate to war room with a mock incident id
    router.push('/war-room/INC-2947');
  };

  const reset = () => {
    setSeverity('P1');
    setTitle('');
    setDescription('');
    setService('payment-api');
    setAssignee('');
    setRunbookUrl('');
    setStatus('idle');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-2xl glass-card shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    <ShieldAlert size={16} style={{ color: '#EF4444' }} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      Declare New Incident
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      CascadeFlow AI will auto-triage and assemble the War Room
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-500/10"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Severity Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: 'var(--text-muted)' }}>
                    Severity Level *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SEVERITIES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSeverity(s.id)}
                        className="p-3 rounded-xl border text-left transition-all"
                        style={{
                          background: severity === s.id ? s.bg : 'transparent',
                          borderColor: severity === s.id ? s.color : 'var(--border-default)',
                          boxShadow: severity === s.id ? `0 0 12px ${s.color}20` : 'none',
                        }}
                      >
                        <span className="text-xs font-extrabold block" style={{ color: s.color }}>
                          {s.id}
                        </span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {s.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Incident Title *
                  </label>
                  <div className="relative">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Payment API returning 503 — complete checkout outage"
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm border outline-none transition-all"
                      style={{
                        background: 'var(--bg-overlay)',
                        borderColor: title ? sel.color + '60' : 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = sel.color)}
                      onBlur={(e) => (e.target.style.borderColor = title ? sel.color + '60' : 'var(--border-default)')}
                    />
                  </div>
                </div>

                {/* Affected Service & Assignee — 2 cols */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Affected Service
                    </label>
                    <div className="relative">
                      <Server size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm border outline-none transition-all appearance-none cursor-pointer"
                        style={{
                          background: 'var(--bg-overlay)',
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                      Assign Incident Commander
                    </label>
                    <div className="relative">
                      <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        value={assignee}
                        onChange={(e) => setAssignee(e.target.value)}
                        placeholder="e.g. Sarah Chen"
                        className="w-full pl-9 pr-4 py-3 rounded-xl text-sm border outline-none transition-all"
                        style={{
                          background: 'var(--bg-overlay)',
                          borderColor: 'var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Description / Initial Impact
                  </label>
                  <div className="relative">
                    <AlignLeft size={13} className="absolute left-3 top-3" style={{ color: 'var(--text-muted)' }} />
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="What is impacted? What is the blast radius? Any initial observations?"
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm border outline-none transition-all resize-none"
                      style={{
                        background: 'var(--bg-overlay)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* Runbook URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                    Runbook URL <span className="normal-case font-normal opacity-60">(optional)</span>
                  </label>
                  <div className="relative">
                    <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="url"
                      value={runbookUrl}
                      onChange={(e) => setRunbookUrl(e.target.value)}
                      placeholder="https://notion.so/runbooks/payment-api-outage"
                      className="w-full pl-9 pr-4 py-3 rounded-xl text-sm border outline-none transition-all font-mono"
                      style={{
                        background: 'var(--bg-overlay)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                </div>

                {/* AI Notice */}
                <div
                  className="p-3.5 rounded-xl border flex items-start gap-3 text-xs"
                  style={{ background: 'rgba(6,182,212,0.05)', borderColor: 'rgba(6,182,212,0.2)' }}
                >
                  <Zap size={14} className="shrink-0 mt-0.5 text-cyan-400" />
                  <p style={{ color: 'var(--text-muted)' }}>
                    <strong className="text-cyan-400">CascadeFlow AI</strong> will automatically run root-cause analysis,
                    generate a blast-radius map, propose a recovery plan, and notify your on-call team via Slack within seconds.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-6 py-4 border-t gap-4"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold transition-all border"
                  style={{
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border-default)',
                    background: 'transparent',
                  }}
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: status === 'idle' ? 1.03 : 1 }}
                  whileTap={{ scale: status === 'idle' ? 0.97 : 1 }}
                  onClick={handleCreate}
                  disabled={!title.trim() || status !== 'idle'}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: status === 'done'
                      ? 'linear-gradient(135deg, #10B981, #06B6D4)'
                      : `linear-gradient(135deg, ${sel.color}, ${sel.color}CC)`,
                    color: '#ffffff',
                    boxShadow: `0 4px 16px ${sel.color}35`,
                  }}
                >
                  {status === 'creating' ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      <span>Declaring Incident...</span>
                    </>
                  ) : status === 'done' ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Incident Declared! Opening War Room...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={13} />
                      <span>Declare {severity} Incident</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
