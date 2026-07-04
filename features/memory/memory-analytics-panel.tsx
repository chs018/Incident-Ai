'use client';

/**
 * Memory Analytics Panel — Slice 7 Persistent Memory Intelligence
 *
 * Interactive KPIs and visualizations showing how Hindsight institutional memory
 * accelerates incident resolution and improves organizational resilience.
 */

import React from 'react';
import { MemoryAnalyticsData } from '@/types';
import { Brain, CheckCircle2, TrendingUp, Sparkles, BookOpen, ShieldAlert, Award } from 'lucide-react';

interface Props {
  analytics: MemoryAnalyticsData;
}

export function MemoryAnalyticsPanel({ analytics }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Memories */}
        <div className="relative overflow-hidden rounded-xl glass-card p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Institutional Memories
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Brain className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{analytics.totalMemories}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +8 this month
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Indexed vector patterns across 14 services
          </p>
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-purple-500/5 blur-xl pointer-events-none" />
        </div>

        {/* AI Reflections */}
        <div className="relative overflow-hidden rounded-xl glass-card p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Autonomous Reflections
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{analytics.reflectionCount}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +14 this month
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Synthesized post-incident operational lessons
          </p>
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
        </div>

        {/* Recovery Success Rate */}
        <div className="relative overflow-hidden rounded-xl glass-card p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recovery Success Rate
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{analytics.successfulRecoveriesPercent}%</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +2.4% vs last Q
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Validated remediation runbooks executed cleanly
          </p>
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
        </div>

        {/* Avg Similarity Score */}
        <div className="relative overflow-hidden rounded-xl glass-card p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Avg Retrieval Match
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white">{analytics.averageSimilarityScore}%</span>
            <span className="text-xs font-medium text-amber-400">
              High Precision
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Semantic vector distance across live incidents
          </p>
          <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-amber-500/5 blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Middle Section: Top Learning Topics & Knowledge Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Learning Topics */}
        <div className="lg:col-span-1 rounded-xl glass-card p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-semibold text-white">Top Institutional Learning Topics</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Most recurring outage patterns indexed in Hindsight persistent memory over the last 6 months.
            </p>

            <div className="space-y-4">
              {analytics.topLearningTopics.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-slate-200 truncate pr-2">{item.topic}</span>
                    <span className="font-semibold text-purple-400 shrink-0">{item.count} outages ({item.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${item.percentage * 2.5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <span>Most Common Cause:</span>
            <span className="font-semibold text-rose-400">{analytics.mostCommonRootCause}</span>
          </div>
        </div>

        {/* Knowledge Growth Chart */}
        <div className="lg:col-span-2 rounded-xl glass-card p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-semibold text-white">Institutional Knowledge Growth</h3>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                  <span className="text-slate-300">Indexed Memories</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span className="text-slate-300">AI Reflections</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Cumulative trajectory of autonomous reflections and verified recovery runbooks stored in Hindsight.
            </p>

            {/* Custom Visual Bar / Area Chart Simulation */}
            <div className="h-56 w-full flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-white/10">
              {analytics.knowledgeGrowthSeries.map((point, idx) => {
                const maxVal = 160;
                const memHeight = `${(point.memories / maxVal) * 100}%`;
                const refHeight = `${(point.reflections / maxVal) * 100}%`;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full relative">
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform duration-150 z-20 bg-slate-900 border border-white/20 rounded-lg px-2.5 py-1 text-[11px] shadow-xl pointer-events-none whitespace-nowrap">
                        <div className="font-semibold text-white">{point.date}</div>
                        <div className="text-purple-300">Memories: {point.memories}</div>
                        <div className="text-blue-300">Reflections: {point.reflections}</div>
                      </div>

                      {/* Memories Bar */}
                      <div
                        className="w-5 rounded-t-md bg-gradient-to-t from-purple-600/80 to-purple-400 transition-all duration-500 group-hover:brightness-125"
                        style={{ height: memHeight }}
                      />
                      {/* Reflections Bar */}
                      <div
                        className="w-5 rounded-t-md bg-gradient-to-t from-blue-600/80 to-blue-400 transition-all duration-500 group-hover:brightness-125"
                        style={{ height: refHeight }}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors">
                      {point.date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400" />
              <span>Top Runbook: <strong className="text-slate-200">{analytics.mostFrequentlyUsedRunbook}</strong></span>
            </div>
            <span className="text-emerald-400 font-medium">99.4% Automated Recall Accuracy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
