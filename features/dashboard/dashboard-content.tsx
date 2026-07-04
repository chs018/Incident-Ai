'use client';

/**
 * Command Center Dashboard — Slice 2 + Slice 3 Extension
 *
 * Orchestrates all dashboard sub-components into the mission-control layout.
 * Each panel is independently importable for future lazy loading / code splitting.
 *
 * Layout:
 *   1. Hero Header (full width)
 *   2. KPI Cards (8 cards)
 *   3. System Health Panel (7 services)
 *   4. Incident Table (2/3) + AI Insights (1/3)
 *   5. Infrastructure Map + Activity Timeline + AI Health (3 equal cols)
 *   6. Operational Analytics (Charts — 6 Recharts panels)
 *   7. Notification Center (full width panel)
 *   + Quick Actions FAB (fixed position)
 */

import { HeroHeader } from './hero-header';
import { KPICards } from './kpi-cards';
import { SystemHealthPanel } from './system-health-panel';
import { ActiveIncidentTable } from './active-incident-table';
import { AIInsightsPanel } from './ai-insights-panel';
import { InfrastructureMap } from './infrastructure-map';
import { ActivityTimeline } from './activity-timeline';
import { AIHealthWidget } from './ai-health-widget';
import { ChartsSection } from './charts-section';
import { NotificationCenter } from './notification-center';
import { QuickActions } from './quick-actions';

export function DashboardContent() {
  return (
    <>
      <div className="p-6 max-w-[1600px] mx-auto space-y-6 pb-24">

        {/* ── Section 1: Hero Header ────────────────────────── */}
        <HeroHeader />

        {/* ── Section 2: KPI Cards (8 animated cards) ──────── */}
        <KPICards />

        {/* ── Section 3: System Health Panel ───────────────── */}
        <section>
          <SystemHealthPanel />
        </section>

        {/* ── Section 4: Incident Table + AI Insights ──────── */}
        <div className="grid xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <ActiveIncidentTable />
          </div>
          <div>
            <AIInsightsPanel />
          </div>
        </div>

        {/* ── Section 5: Infra Map + Timeline + AI Health ───── */}
        <div className="grid xl:grid-cols-3 gap-5">
          <div className="xl:col-span-1">
            <InfrastructureMap />
          </div>
          <div className="xl:col-span-1">
            <ActivityTimeline />
          </div>
          <div className="xl:col-span-1">
            <AIHealthWidget />
          </div>
        </div>

        {/* ── Section 6: Operational Analytics (Charts) ─────── */}
        <section>
          <ChartsSection />
        </section>

        {/* ── Section 7: Notification Center ───────────────── */}
        <section>
          <NotificationCenterPanel />
        </section>

      </div>

      {/* ── Fixed: Quick Actions FAB ────────────────────────── */}
      <QuickActions />
    </>
  );
}

// ─── Notification Center as inline dashboard panel ────────────
// The header already has a compact Bell dropdown.
// This is the full-width notification panel for the dashboard page.

import { motion } from 'framer-motion';
import {
  Bell, AlertTriangle, CheckCircle2, Info,
  Shield, Rocket, Clock, ChevronRight,
} from 'lucide-react';

const PANEL_NOTIFICATIONS = [
  { id: 'pn-1', title: 'Critical incident detected', body: 'Payment API returning 503 — 84K users affected. War Room open.', priority: 'critical' as const, time: '2m ago', icon: AlertTriangle, action: 'Open War Room', href: '/war-room/INC-2947' },
  { id: 'pn-2', title: 'TLS Certificate expiring in 24h', body: 'api.cloudnova.io certificate expires 2026-07-05 00:00 UTC. Renewal required.', priority: 'warning' as const, time: '14m ago', icon: Shield, action: 'View details', href: '/integrations' },
  { id: 'pn-3', title: 'AI recommendation accepted', body: 'Team applied DB rollback for payment-api v2.4.1 → v2.4.0 based on AI analysis.', priority: 'info' as const, time: '28m ago', icon: Info, action: 'View analysis', href: '/war-room/INC-2947' },
  { id: 'pn-4', title: 'Deployment completed', body: 'checkout-api v8.3.1 deployed to production successfully across all regions.', priority: 'success' as const, time: '1h ago', icon: Rocket, action: undefined, href: undefined },
  { id: 'pn-5', title: 'Database backup completed', body: 'analytics-db daily snapshot completed. 247GB backed up to S3 us-east-1.', priority: 'success' as const, time: '2h ago', icon: CheckCircle2, action: undefined, href: undefined },
  { id: 'pn-6', title: 'SLA breach: checkout p99 latency', body: 'checkout-api p99 exceeded 500ms SLO for 8 minutes. Now resolved.', priority: 'warning' as const, time: '3h ago', icon: Clock, action: 'View SLO', href: '/analytics' },
];

const pColors = {
  critical: { color: '#FCA5A5', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.18)', dot: '#EF4444' },
  warning:  { color: '#FCD34D', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.18)', dot: '#F59E0B' },
  success:  { color: '#6EE7B7', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.15)', dot: '#10B981' },
  info:     { color: '#93C5FD', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.15)', dot: '#3B82F6' },
} as const;

function NotificationCenterPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="glass-card overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Bell size={13} style={{ color: '#60A5FA' }} />
          </div>
          <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Notification Center
          </h2>
          <span
            className="text-[9px] font-black px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#FCA5A5' }}
          >
            3 unread
          </span>
        </div>
        <button
          className="text-[11px] font-semibold transition-opacity hover:opacity-70"
          style={{ color: '#60A5FA' }}
        >
          Mark all read
        </button>
      </div>

      {/* Grid of notification cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 p-5">
        {PANEL_NOTIFICATIONS.map((n, i) => {
          const pc = pColors[n.priority];
          const Icon = n.icon;
          const isUnread = i < 3;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 + i * 0.06 }}
              className="flex flex-col gap-2 p-4 rounded-xl transition-all hover:bg-white/[0.02] cursor-pointer"
              style={{
                background: pc.bg,
                border: `1px solid ${pc.border}`,
                borderLeft: isUnread ? `3px solid ${pc.dot}` : `1px solid ${pc.border}`,
              }}
            >
              {/* Icon + title */}
              <div className="flex items-start gap-2.5">
                <Icon size={14} style={{ color: pc.color }} className="shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {n.title}
                    </p>
                    {isUnread && (
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: pc.dot }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Body */}
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {n.body}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-1">
                <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>{n.time}</span>
                {n.action && (
                  <a href={n.href ?? '#'}>
                    <button
                      className="flex items-center gap-1 text-[10px] font-semibold transition-opacity hover:opacity-80"
                      style={{ color: '#60A5FA' }}
                    >
                      {n.action} <ChevronRight size={9} />
                    </button>
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
