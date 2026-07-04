'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sidebar } from './sidebar';
import { Header } from './header';

// ─── Page label config ────────────────────────────────────────

const pageConfig: Record<string, { label: string; crumbs: Array<{ label: string }> }> = {
  '/dashboard': { label: 'Dashboard', crumbs: [{ label: 'Dashboard' }] },
  '/war-room': { label: 'Incident War Room', crumbs: [{ label: 'Operations' }, { label: 'War Room' }] },
  '/memory': { label: 'Memory Library', crumbs: [{ label: 'AI' }, { label: 'Memory Library' }] },
  '/routing': { label: 'Model Routing', crumbs: [{ label: 'AI' }, { label: 'Model Routing' }] },
  '/integrations': { label: 'Integrations', crumbs: [{ label: 'Settings' }, { label: 'Integrations' }] },
  '/team': { label: 'Team', crumbs: [{ label: 'Organization' }, { label: 'Team' }] },
  '/analytics': { label: 'Analytics', crumbs: [{ label: 'Analytics' }] },
  '/settings': { label: 'Settings', crumbs: [{ label: 'Settings' }] },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Match current page config
  const pageKey = Object.keys(pageConfig).find(
    (k) => pathname === k || pathname.startsWith(k + '/')
  );
  const page = pageKey ? pageConfig[pageKey] : { label: 'AI Incident Commander', crumbs: [] };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          onMobileMenuOpen={() => setMobileOpen(true)}
          currentPage={page.label}
          breadcrumbs={page.crumbs}
        />

        {/* Scrollable page content */}
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 overflow-y-auto grid-bg"
          style={{ background: 'var(--bg-base)' }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
