'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Flame,
  Brain,
  GitBranch,
  Plug,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Circle,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { activeIncidents } from '@/lib/mock-data/incidents';

// ─── Navigation config ───────────────────────────────────────

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Executive overview',
  },
  {
    id: 'war-room',
    label: 'War Room',
    href: '/war-room',
    icon: Flame,
    description: 'Active incident response',
    badge: activeIncidents.length,
    badgeVariant: 'critical' as const,
  },
  {
    id: 'memory',
    label: 'Memory Library',
    href: '/memory',
    icon: Brain,
    description: 'Incident knowledge base',
    isBeta: true,
  },
  {
    id: 'routing',
    label: 'Model Routing',
    href: '/routing',
    icon: GitBranch,
    description: 'AI routing configuration',
    isBeta: true,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    href: '/integrations',
    icon: Plug,
    description: 'Connect your tools',
  },
  {
    id: 'team',
    label: 'Team',
    href: '/team',
    icon: Users,
    description: 'Members and on-call',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Metrics and insights',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Platform configuration',
  },
];

// ─── Component ──────────────────────────────────────────────

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        animate={{ width: isCollapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen flex flex-col overflow-hidden',
          'border-r border-[var(--border-subtle)]',
          'lg:relative lg:translate-x-0',
          // Mobile behavior
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ background: 'var(--bg-surface)' }}
      >
        {/* Logo / Brand */}
        <div
          className="flex items-center h-16 px-4 border-b shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon */}
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)',
              }}
            >
              <Zap size={16} className="text-white" />
            </div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="min-w-0"
                >
                  <div
                    className="text-sm font-bold leading-tight truncate"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Incident AI
                  </div>
                  <div
                    className="text-xs leading-tight truncate"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Commander
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.id} href={item.href} onClick={onMobileClose}>
                <motion.div
                  whileHover={{ x: isCollapsed ? 0 : 2 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 cursor-pointer',
                    'transition-all duration-150 group',
                    'border border-transparent',
                    isActive
                      ? 'nav-item-active'
                      : 'hover:bg-white/[0.04] hover:border-white/[0.06]'
                  )}
                  style={!isActive ? { color: 'var(--text-secondary)' } : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                      style={{ background: 'var(--primary-500)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}

                  {/* Icon */}
                  <div className="shrink-0 ml-1">
                    <Icon
                      size={16}
                      className={cn(
                        'transition-colors duration-150',
                        isActive ? 'text-blue-400' : 'group-hover:text-slate-300'
                      )}
                    />
                  </div>

                  {/* Label + Badge */}
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="flex items-center justify-between flex-1 min-w-0"
                      >
                        <span
                          className={cn(
                            'text-sm font-medium truncate',
                            isActive ? 'text-blue-300' : 'text-slate-300'
                          )}
                        >
                          {item.label}
                        </span>

                        <div className="flex items-center gap-1.5 ml-2 shrink-0">
                          {item.isBeta && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                              style={{
                                background: 'rgba(139, 92, 246, 0.15)',
                                color: '#A78BFA',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                              }}
                            >
                              Beta
                            </span>
                          )}
                          {item.badge !== undefined && item.badge > 0 && (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                              style={{
                                background: 'rgba(239, 68, 68, 0.15)',
                                color: '#FCA5A5',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                              }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Collapsed badge */}
                  {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="absolute top-1 right-1 text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full"
                      style={{
                        background: '#EF4444',
                        color: 'white',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* AI Status Indicator */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-3 mb-3 p-3 rounded-lg"
              style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
              }}
            >
              <div className="flex items-center gap-2">
                <div className="pulse-dot pulse-dot-green" />
                <span className="text-xs font-medium" style={{ color: '#34D399' }}>
                  AI Engine Active
                </span>
              </div>
              <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                Groq · llama-3.3-70b
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Toggle */}
        <div
          className="flex items-center justify-end p-3 border-t shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md transition-colors"
            style={{
              color: 'var(--text-muted)',
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
