'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2, XCircle, AlertCircle, Clock, Plug, Search, ExternalLink,
} from 'lucide-react';
import { integrations } from '@/lib/mock-data/integrations';
import { IntegrationStatus } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const statusConfig: Record<IntegrationStatus, { label: string; color: string; icon: React.ElementType }> = {
  connected: { label: 'Connected', color: '#10B981', icon: CheckCircle2 },
  disconnected: { label: 'Disconnected', color: '#475569', icon: XCircle },
  error: { label: 'Error', color: '#EF4444', icon: AlertCircle },
  pending: { label: 'Pending', color: '#F59E0B', icon: Clock },
};

const categoryColors: Record<string, string> = {
  monitoring: '#3B82F6',
  alerting: '#EF4444',
  communication: '#10B981',
  ticketing: '#8B5CF6',
  deployment: '#F59E0B',
  cloud: '#06B6D4',
};

export function IntegrationsContent() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(integrations.map(i => i.category)))];
  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const filtered = integrations.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || i.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Plug size={20} style={{ color: '#3B82F6' }} />
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Integrations</h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {connectedCount} of {integrations.length} integrations active
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
          style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-subtle)' }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search integrations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm flex-1 outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all"
              style={
                category === cat
                  ? { background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.3)' }
                  : { background: 'var(--bg-overlay)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Integration cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((integration, i) => {
          const StatusIcon = statusConfig[integration.status].icon;
          const statusColor = statusConfig[integration.status].color;
          const catColor = categoryColors[integration.category] ?? '#64748B';

          return (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-4 flex flex-col gap-3 group cursor-pointer"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: `${catColor}15`, border: `1px solid ${catColor}25`, color: catColor }}
                >
                  {integration.name.slice(0, 2)}
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusIcon size={12} style={{ color: statusColor }} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: statusColor }}>
                    {statusConfig[integration.status].label}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {integration.name}
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {integration.description}
                </p>
              </div>

              {/* Category tag */}
              <div className="flex items-center justify-between mt-auto">
                <span
                  className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{ background: `${catColor}10`, color: catColor }}
                >
                  {integration.category}
                </span>
                {integration.status === 'connected' ? (
                  <button
                    className="text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Configure <ExternalLink size={10} />
                  </button>
                ) : (
                  <button
                    className="text-xs font-semibold transition-colors hover:text-blue-300"
                    style={{ color: '#60A5FA' }}
                  >
                    Connect
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
