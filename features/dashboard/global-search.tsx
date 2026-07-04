'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Flame, Server, Users, Settings, BarChart2, Keyboard } from 'lucide-react';
import { incidents } from '@/lib/mock-data/incidents';

// ─── Search result categories ─────────────────────────────────

type ResultType = 'incident' | 'service' | 'page' | 'action';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  href?: string;
  icon: React.ElementType;
  iconColor: string;
}

const PAGES: SearchResult[] = [
  { id: 'p-dash', type: 'page', title: 'Command Center', subtitle: 'Dashboard', href: '/dashboard', icon: BarChart2, iconColor: '#3B82F6' },
  { id: 'p-war', type: 'page', title: 'War Room', subtitle: 'Incident list', href: '/war-room', icon: Flame, iconColor: '#EF4444' },
  { id: 'p-mem', type: 'page', title: 'Memory Library', subtitle: 'Hindsight Institutional Memory', href: '/memory', icon: Server, iconColor: '#8B5CF6' },
  { id: 'p-team', type: 'page', title: 'Team', subtitle: 'Members & on-call', href: '/team', icon: Users, iconColor: '#10B981' },
  { id: 'p-set', type: 'page', title: 'Settings', subtitle: 'Workspace configuration', href: '/settings', icon: Settings, iconColor: '#94A3B8' },
];

const typeConfig: Record<ResultType, { color: string; label: string }> = {
  incident: { color: '#EF4444', label: 'Incident' },
  service:  { color: '#3B82F6', label: 'Service' },
  page:     { color: '#8B5CF6', label: 'Page' },
  action:   { color: '#10B981', label: 'Action' },
};

// ─── Global Search ────────────────────────────────────────────

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-focus on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelected(0);
    }
  }, [open]);

  // Build results
  const results: SearchResult[] = query.trim().length === 0
    ? PAGES.slice(0, 5)
    : [
        ...incidents
          .filter(i =>
            i.title.toLowerCase().includes(query.toLowerCase()) ||
            i.id.toLowerCase().includes(query.toLowerCase()) ||
            i.service.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
          .map(i => ({
            id: i.id,
            type: 'incident' as ResultType,
            title: i.title.length > 55 ? i.title.slice(0, 55) + '…' : i.title,
            subtitle: `${i.id} · ${i.service} · ${i.priority}`,
            href: `/war-room/${i.id}`,
            icon: Flame,
            iconColor: i.severity === 'critical' ? '#EF4444' : i.severity === 'high' ? '#F97316' : '#F59E0B',
          })),
        ...PAGES.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase())
        ),
      ].slice(0, 8);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(v => Math.min(v + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(v => Math.max(v - 1, 0)); }
    if (e.key === 'Enter' && results[selected]?.href) {
      window.location.href = results[selected].href!;
      setOpen(false);
    }
  }, [results, selected]);

  return (
    <>
      {/* Trigger pill */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all group"
        style={{
          background: 'var(--bg-overlay)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)',
          minWidth: 220,
        }}
        aria-label="Open search (⌘K)"
      >
        <Search size={13} />
        <span className="flex-1 text-left text-xs">Search incidents, services…</span>
        <kbd
          className="hidden sm:flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(148,163,184,0.08)', color: 'var(--text-disabled)' }}
        >
          ⌘K
        </kbd>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(6,10,18,0.75)', backdropFilter: 'blur(4px)' }}
              onClick={() => setOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-[12%] left-1/2 -translate-x-1/2 z-50 rounded-2xl overflow-hidden glass-card shadow-2xl"
              style={{
                width: '100%',
                maxWidth: 600,
                border: '1px solid var(--border-default)',
              }}
            >
              {/* Search input row */}
              <div
                className="flex items-center gap-3 px-4 py-3.5 border-b"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <Search size={16} style={{ color: '#3B82F6' }} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search incidents, services, pages…"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }}
                  aria-label="Global search"
                />
                {query && (
                  <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
                <kbd
                  className="text-[10px] px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(148,163,184,0.08)', color: 'var(--text-muted)' }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[380px] overflow-y-auto py-2">
                {query === '' && (
                  <p
                    className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: 'var(--text-disabled)' }}
                  >
                    Quick Navigation
                  </p>
                )}
                {results.map((result, i) => {
                  const Icon = result.icon;
                  const tc = typeConfig[result.type];
                  return (
                    <motion.a
                      key={result.id}
                      href={result.href ?? '#'}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl transition-all group"
                      style={{
                        background: i === selected ? 'rgba(59,130,246,0.08)' : 'transparent',
                        border: i === selected ? '1px solid rgba(59,130,246,0.15)' : '1px solid transparent',
                      }}
                      onMouseEnter={() => setSelected(i)}
                    >
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                        style={{ background: `${result.iconColor}14` }}
                      >
                        <Icon size={13} style={{ color: result.iconColor }} />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                          {result.title}
                        </p>
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                          {result.subtitle}
                        </p>
                      </div>

                      {/* Type badge */}
                      <span
                        className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                        style={{ background: `${tc.color}12`, color: tc.color }}
                      >
                        {tc.label}
                      </span>

                      {/* Arrow on selected */}
                      {i === selected && (
                        <ArrowRight size={12} style={{ color: '#60A5FA' }} className="shrink-0" />
                      )}
                    </motion.a>
                  );
                })}

                {results.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No results for "{query}"</p>
                  </div>
                )}
              </div>

              {/* Footer hints */}
              <div
                className="flex items-center gap-4 px-4 py-2.5 border-t"
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                {[
                  { key: '↑↓', label: 'navigate' },
                  { key: '↵', label: 'open' },
                  { key: 'ESC', label: 'close' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <kbd
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: 'rgba(148,163,184,0.08)', color: 'var(--text-muted)' }}
                    >
                      {key}
                    </kbd>
                    <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>{label}</span>
                  </div>
                ))}
                <div className="ml-auto flex items-center gap-1.5">
                  <Keyboard size={10} style={{ color: 'var(--text-disabled)' }} />
                  <span className="text-[10px]" style={{ color: 'var(--text-disabled)' }}>⌘K to toggle</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
