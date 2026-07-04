'use client';

/**
 * Memory Library View — Slice 7 Persistent Memory Intelligence
 *
 * Enterprise knowledge center allowing engineers and SRE teams to explore Hindsight
 * institutional memories, semantic search libraries, autonomous reflections, and graphs.
 */

import React, { useState } from 'react';
import { getMemoryAnalytics } from '@/services/memory';
import { MemoryAnalyticsPanel } from './memory-analytics-panel';
import { MemorySearchPanel } from './memory-search-panel';
import { AIReflectionsPanel } from './ai-reflections-panel';
import { MemoryTimelinePanel } from './memory-timeline-panel';
import { KnowledgeGraphPanel } from './knowledge-graph-panel';
import { Brain, Search, Sparkles, Activity, Layers, ShieldCheck, Database } from 'lucide-react';

export function MemoryLibraryView() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'search' | 'reflections' | 'timeline' | 'graph'>('analytics');
  const analytics = getMemoryAnalytics();

  const tabs = [
    { id: 'analytics', label: 'Overview & Analytics', icon: Brain, count: undefined },
    { id: 'search', label: 'Historical Incidents', icon: Search, count: analytics.totalMemories },
    { id: 'reflections', label: 'AI Reflections', icon: Sparkles, count: analytics.reflectionCount },
    { id: 'timeline', label: 'Knowledge Lifecycle', icon: Activity, count: undefined },
    { id: 'graph', label: 'Knowledge Graph', icon: Layers, count: undefined },
  ] as const;

  return (
    <div className="min-h-screen pb-16" style={{ color: 'var(--text-primary)' }}>
      {/* Top Header */}
      <div className="border-b sticky top-0 z-30" style={{ background: 'var(--glass-bg)', borderColor: 'var(--border-default)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/20 border border-white/20">
              <Brain className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Memory Library</h1>
                <span className="flex items-center gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full text-xs font-semibold">
                  <Sparkles className="h-3 w-3" /> Hindsight Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Institutional knowledge base powered by persistent vector memory and autonomous post-incident reflections.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-lg">
              <Database className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-slate-400">Vector Index:</span>
              <strong className="text-white">100% Synced</strong>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-slate-400">Recovery Rate:</span>
              <strong className="text-emerald-400">{analytics.successfulRecoveriesPercent}%</strong>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto border-t border-white/5 pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'analytics' && <MemoryAnalyticsPanel analytics={analytics} />}
        {activeTab === 'search' && <MemorySearchPanel />}
        {activeTab === 'reflections' && <AIReflectionsPanel />}
        {activeTab === 'timeline' && <MemoryTimelinePanel />}
        {activeTab === 'graph' && <KnowledgeGraphPanel />}
      </div>
    </div>
  );
}
