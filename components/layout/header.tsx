'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  Menu,
  Cpu,
  AlertTriangle,
  CheckCircle2,
  X,
  LogOut,
  User,
  Settings as SettingsIcon,
  Shield,
} from 'lucide-react';
import { cn, timeAgo } from '@/lib/utils';
import { organizations, currentUser } from '@/lib/mock-data/organizations';
import { activeIncidents } from '@/lib/mock-data/incidents';
import { GlobalSearch } from '@/features/dashboard/global-search';

// ─── Mock Notifications ──────────────────────────────────────

const notifications = [
  {
    id: 'n1',
    type: 'critical',
    title: 'P0 Incident Active',
    body: 'Payment API is returning 503 errors. 84K users affected.',
    timestamp: '2026-07-04T14:32:00Z',
    read: false,
  },
  {
    id: 'n2',
    type: 'warning',
    title: 'Redis Memory at 98%',
    body: 'Session cache approaching OOM. Mitigation in progress.',
    timestamp: '2026-07-04T12:10:00Z',
    read: false,
  },
  {
    id: 'n3',
    type: 'info',
    title: 'AI Analysis Complete',
    body: 'Root cause identified for INC-2947 with 94% confidence.',
    timestamp: '2026-07-04T14:35:00Z',
    read: true,
  },
  {
    id: 'n4',
    type: 'success',
    title: 'Incident Resolved',
    body: 'INC-2943 Auth service restored. MTTR: 12 minutes.',
    timestamp: '2026-07-03T22:12:00Z',
    read: true,
  },
];

// ─── Component ──────────────────────────────────────────────

interface HeaderProps {
  onMobileMenuOpen: () => void;
  currentPage: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function Header({ onMobileMenuOpen, currentPage, breadcrumbs }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [orgOpen, setOrgOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [currentOrg, setCurrentOrg] = useState(organizations[0]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="sticky top-0 z-30 flex items-center h-16 px-4 gap-4 shrink-0"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Mobile menu toggle */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md"
        style={{ color: 'var(--text-secondary)' }}
      >
        <Menu size={18} />
      </button>

      {/* Breadcrumb / Page title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <span style={{ color: 'var(--text-disabled)' }} className="text-xs">/</span>
                )}
                <span
                  className={cn(
                    'text-sm',
                    i === breadcrumbs.length - 1
                      ? 'font-semibold'
                      : 'font-normal'
                  )}
                  style={{
                    color:
                      i === breadcrumbs.length - 1
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                  }}
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        ) : (
          <h1
            className="text-sm font-semibold truncate"
            style={{ color: 'var(--text-primary)' }}
          >
            {currentPage}
          </h1>
        )}
      </div>

      {/* Global Search — Cmd+K */}
      <div className="hidden md:block">
        <GlobalSearch />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* Active incident count */}
        {activeIncidents.length > 0 && (
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#FCA5A5',
            }}
          >
            <div className="pulse-dot pulse-dot-red" style={{ width: 6, height: 6 }} />
            <span>{activeIncidents.length} active</span>
          </div>
        )}

        {/* AI Status */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
            color: '#34D399',
          }}
        >
          <Cpu size={12} />
          <span>AI Online</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setNotifOpen(!notifOpen); setOrgOpen(false); setUserOpen(false); }}
            className="relative flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{ background: '#EF4444' }}
              >
                {unreadCount}
              </span>
            )}
          </motion.button>

          {/* Notifications panel */}
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Notifications
                  </span>
                  <button onClick={() => setNotifOpen(false)}>
                    <X size={14} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex gap-3 px-4 py-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-white/[0.03]"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'critical' && <AlertTriangle size={14} className="text-red-400" />}
                        {n.type === 'warning' && <AlertTriangle size={14} className="text-amber-400" />}
                        {n.type === 'info' && <Cpu size={14} className="text-blue-400" />}
                        {n.type === 'success' && <CheckCircle2 size={14} className="text-emerald-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={cn('text-xs font-semibold', !n.read && 'text-white')}
                            style={n.read ? { color: 'var(--text-secondary)' } : undefined}
                          >
                            {n.title}
                          </span>
                          {!n.read && (
                            <div
                              className="w-1.5 h-1.5 rounded-full shrink-0 mt-1"
                              style={{ background: '#3B82F6' }}
                            />
                          )}
                        </div>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                          {n.body}
                        </p>
                        <p className="text-[10px] mt-1" style={{ color: 'var(--text-disabled)' }} suppressHydrationWarning>
                          {timeAgo(n.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Organization selector */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.01 }}
            onClick={() => { setOrgOpen(!orgOpen); setNotifOpen(false); setUserOpen(false); }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white shrink-0"
              style={{ background: currentOrg.avatarColor }}
            >
              {currentOrg.name.charAt(0)}
            </div>
            <span
              className="text-xs font-medium max-w-[100px] truncate hidden md:block"
              style={{ color: 'var(--text-primary)' }}
            >
              {currentOrg.name}
            </span>
            <ChevronDown size={12} style={{ color: 'var(--text-muted)' }} />
          </motion.button>

          <AnimatePresence>
            {orgOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div
                  className="px-3 py-2 border-b"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    Organizations
                  </p>
                </div>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => { setCurrentOrg(org); setOrgOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
                  >
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ background: org.avatarColor }}
                    >
                      {org.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {org.name}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {org.memberCount} members · {org.plan}
                      </p>
                    </div>
                    {currentOrg.id === org.id && (
                      <CheckCircle2 size={12} className="text-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar & dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); setOrgOpen(false); }}
            className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-white cursor-pointer shrink-0 border transition-all"
            style={{
              background: currentUser.avatarColor,
              borderColor: userOpen ? 'rgba(59,130,246,0.6)' : 'transparent',
              boxShadow: userOpen ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
            }}
            title={currentUser.name}
          >
            {currentUser.avatarInitials}
          </motion.button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden z-50"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {/* Profile Header */}
                <div className="p-3.5 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: currentUser.avatarColor }}
                    >
                      {currentUser.avatarInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-[10px] font-mono text-slate-400 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-300 font-semibold">
                    <Shield size={11} className="text-blue-400" />
                    <span>Administrator · SOC2 Verified</span>
                  </div>
                </div>

                {/* Links */}
                <div className="py-1 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                  <a
                    href="/settings"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <User size={14} className="text-slate-400" />
                    <span>Profile & Preferences</span>
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <SettingsIcon size={14} className="text-slate-400" />
                    <span>Workspace Settings</span>
                  </a>
                </div>

                {/* Logout Option */}
                <div className="p-1.5">
                  <button
                    onClick={() => {
                      try { sessionStorage.clear(); } catch (e) {}
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Log Out of Workspace</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
