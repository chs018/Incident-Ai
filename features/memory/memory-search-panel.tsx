'use client';

/**
 * Memory Search Panel — Slice 7 Persistent Memory Intelligence
 *
 * Enterprise semantic search and filtering interface across Hindsight institutional
 * memories. Displays vector similarity matches, MTTR, business impact, and runbooks.
 */

import React, { useState } from 'react';
import { HistoricalMemory } from '@/types';
import { searchMemoryLibrary } from '@/services/memory';
import { Search, Filter, Sparkles, CheckCircle2, Clock, ExternalLink, ShieldAlert, Tag, User } from 'lucide-react';

export function MemorySearchPanel() {
  const [query, setQuery] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  const memories = searchMemoryLibrary({
    query,
    service: selectedService,
    severity: selectedSeverity,
    tag: selectedTag,
  });

  const services = ['all', 'payment-api', 'checkout-service', 'order-processor', 'notification-worker', 'auth-gateway', 'api-gateway', 'billing-service', 'search-engine', 'analytics-worker', 'frontend-app'];
  const severities = ['all', 'critical', 'high', 'medium', 'low'];
  const tags = ['all', 'redis', 'oom', 'kubernetes', 'dns', 'postgres', 'deadlock', 'kafka', 'jwt', 'istio', 'aws', 'elasticsearch'];

  const getBadgeStyle = (badge: HistoricalMemory['relevanceBadge']) => {
    switch (badge) {
      case 'Exact Pattern':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'High Similarity':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Related Service':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'medium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search & Filter Bar */}
      <div className="rounded-xl border border-white/10 glass-card p-5 shadow-lg backdrop-blur-md space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Semantic search by outage pattern, root cause, error message, service, or engineer..."
            className="w-full rounded-lg border border-white/10 bg-slate-900/90 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Filter className="h-3.5 w-3.5 text-purple-400" />
            <span>Filters:</span>
          </div>

          {/* Service Filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="rounded-md border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-slate-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Services</option>
            {services.filter((s) => s !== 'all').map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="rounded-md border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-slate-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Severities</option>
            {severities.filter((s) => s !== 'all').map((s) => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="rounded-md border border-white/10 bg-slate-900/80 px-2.5 py-1.5 text-slate-200 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Tags</option>
            {tags.filter((t) => t !== 'all').map((t) => (
              <option key={t} value={t}>#{t}</option>
            ))}
          </select>

          {(selectedService !== 'all' || selectedSeverity !== 'all' || selectedTag !== 'all' || query !== '') && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedService('all');
                setSelectedSeverity('all');
                setSelectedTag('all');
              }}
              className="ml-auto text-purple-400 hover:text-purple-300 font-medium underline"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white font-semibold">{memories.length}</strong> institutional memory patterns
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" /> Hindsight Vector Index Active
        </span>
      </div>

      {/* Memories Grid */}
      {memories.length === 0 ? (
        <div className="rounded-xl border border-white/10 glass-card p-12 text-center text-slate-400 space-y-3">
          <ShieldAlert className="h-10 w-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No Matching Institutional Memories</h3>
          <p className="text-xs max-w-md mx-auto">
            No historical incidents or reflections matched your search criteria. Try loosening your filters or searching for terms like &quot;redis&quot;, &quot;dns&quot;, or &quot;deadlock&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className="group rounded-xl border border-white/10 glass-card p-6 shadow-lg backdrop-blur-md hover:border-purple-500/40 hover:glass-card transition-all duration-300 space-y-4"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getSeverityStyle(mem.severity)} uppercase tracking-wider`}>
                    {mem.severity}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                    {mem.incidentId}
                  </span>
                  <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {mem.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${getBadgeStyle(mem.relevanceBadge)}`}>
                    <Sparkles className="h-3 w-3" />
                    {mem.relevanceBadge} ({mem.similarityScore}%)
                  </span>
                </div>
              </div>

              {/* Root Cause & Resolution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5 text-xs">
                <div className="space-y-1.5 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                  <span className="font-semibold text-rose-400 block uppercase tracking-wider text-[10px]">
                    Root Cause Pattern
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {mem.rootCause}
                  </p>
                </div>

                <div className="space-y-1.5 bg-slate-900/50 p-3 rounded-lg border border-white/5">
                  <span className="font-semibold text-emerald-400 block uppercase tracking-wider text-[10px]">
                    Verified Remediation Runbook
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {mem.resolution}
                  </p>
                </div>
              </div>

              {/* Metadata Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs text-slate-400">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-purple-400" />
                    <span className="text-slate-300">{mem.engineer.name}</span>
                    <span className="text-slate-500">({mem.engineer.role})</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    <span>MTTR: <strong className="text-white">{mem.timeToResolution} mins</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Success Rate: <strong className="text-emerald-400">{mem.recoverySuccessRate}%</strong> ({mem.useCount} uses)</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Tag className="h-3 w-3 text-slate-500" />
                    <div className="flex gap-1">
                      {mem.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-white/5 hover:bg-white/10 text-slate-300 px-1.5 py-0.5 rounded text-[10px] transition-colors">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {mem.runbookUrl && (
                    <a
                      href={mem.runbookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium pl-2 border-l border-white/10"
                    >
                      Runbook <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
