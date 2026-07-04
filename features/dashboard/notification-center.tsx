'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, AlertTriangle, CheckCircle2, Info, Clock,
  Shield, Rocket, X, ChevronRight,
} from 'lucide-react';

// ─── Notification data ────────────────────────────────────────

type NotifPriority = 'critical' | 'warning' | 'success' | 'info';

interface Notification {
  id: string;
  title: string;
  body: string;
  priority: NotifPriority;
  timestamp: string;
  read: boolean;
  icon: React.ElementType;
  action?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 'n-1',
    title: 'Critical incident detected',
    body: 'Payment API is returning 503 errors. 84,000 users affected.',
    priority: 'critical',
    timestamp: '2m ago',
    read: false,
    icon: AlertTriangle,
    action: 'Open War Room',
  },
  {
    id: 'n-2',
    title: 'TLS Certificate expiring in 24h',
    body: 'api.cloudnova.io certificate expires 2026-07-05 00:00 UTC.',
    priority: 'warning',
    timestamp: '14m ago',
    read: false,
    icon: Shield,
    action: 'View details',
  },
  {
    id: 'n-3',
    title: 'AI recommendation accepted',
    body: 'Team applied rollback for payment-api v2.4.1 → v2.4.0.',
    priority: 'info',
    timestamp: '28m ago',
    read: false,
    icon: Info,
    action: 'View analysis',
  },
  {
    id: 'n-4',
    title: 'Deployment completed',
    body: 'checkout-api v8.3.1 deployed to production successfully.',
    priority: 'success',
    timestamp: '1h ago',
    read: true,
    icon: Rocket,
  },
  {
    id: 'n-5',
    title: 'Database backup completed',
    body: 'analytics-db snapshot completed. 247GB backed up to S3.',
    priority: 'success',
    timestamp: '2h ago',
    read: true,
    icon: CheckCircle2,
  },
  {
    id: 'n-6',
    title: 'SLA breach alert',
    body: 'checkout-api p99 latency exceeded 500ms SLO for 8 minutes.',
    priority: 'warning',
    timestamp: '3h ago',
    read: true,
    icon: Clock,
    action: 'View SLO',
  },
];

const priorityConfig: Record<NotifPriority, { color: string; bg: string; border: string }> = {
  critical: { color: '#FCA5A5', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.18)' },
  warning:  { color: '#FCD34D', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.18)' },
  success:  { color: '#6EE7B7', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.15)' },
  info:     { color: '#93C5FD', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.15)' },
};

// ─── Notification Center ──────────────────────────────────────

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () =>
    setNotifications(ns => ns.map(n => ({ ...n, read: true })));

  const dismiss = (id: string) =>
    setNotifications(ns => ns.filter(n => n.id !== id));

  const markRead = (id: string) =>
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="relative">
      {/* Bell trigger */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center justify-center w-9 h-9 rounded-xl transition-all"
        style={{
          background: open ? 'rgba(59,130,246,0.12)' : 'var(--bg-overlay)',
          border: open ? '1px solid rgba(59,130,246,0.25)' : '1px solid var(--border-subtle)',
          color: 'var(--text-secondary)',
        }}
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell size={15} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden glass-card shadow-2xl"
              style={{
                width: 380,
                border: '1px solid var(--border-default)',
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <div className="flex items-center gap-2.5">
                  <Bell size={13} style={{ color: 'var(--text-muted)' }} />
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Notifications
                  </p>
                  {unreadCount > 0 && (
                    <span
                      className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#FCA5A5' }}
                    >
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={markAllRead}
                  className="text-[10px] font-semibold transition-colors hover:opacity-80"
                  style={{ color: '#60A5FA' }}
                >
                  Mark all read
                </button>
              </div>

              {/* Notification list */}
              <div className="max-h-[420px] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {notifications.map((notif, i) => {
                    const pc = priorityConfig[notif.priority];
                    const Icon = notif.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.2 }}
                        onClick={() => markRead(notif.id)}
                        className="relative cursor-pointer transition-colors hover:bg-white/[0.03]"
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          borderLeft: notif.read ? 'none' : `2px solid ${pc.color}`,
                        }}
                      >
                        <div className="px-4 py-3 flex gap-3">
                          {/* Icon */}
                          <div
                            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 mt-0.5"
                            style={{ background: pc.bg, border: `1px solid ${pc.border}` }}
                          >
                            <Icon size={13} style={{ color: pc.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className="text-xs font-semibold leading-tight"
                                style={{ color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}
                              >
                                {notif.title}
                              </p>
                              <button
                                onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                                className="shrink-0 p-0.5 rounded transition-opacity opacity-0 group-hover:opacity-100"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                <X size={10} />
                              </button>
                            </div>
                            <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                              {notif.body}
                            </p>
                            <div className="flex items-center justify-between mt-1.5">
                              <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>
                                {notif.timestamp}
                              </span>
                              {notif.action && (
                                <button
                                  className="text-[10px] font-semibold flex items-center gap-0.5 transition-colors hover:opacity-80"
                                  style={{ color: '#60A5FA' }}
                                >
                                  {notif.action} <ChevronRight size={9} />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {notifications.length === 0 && (
                  <div className="py-10 text-center">
                    <CheckCircle2 size={24} className="mx-auto mb-2 opacity-30" style={{ color: '#10B981' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>All caught up!</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  className="text-xs font-semibold w-full text-center transition-opacity hover:opacity-80"
                  style={{ color: 'var(--text-muted)' }}
                >
                  View all notifications →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
