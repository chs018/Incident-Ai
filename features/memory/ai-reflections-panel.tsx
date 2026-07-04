'use client';

/**
 * AI Reflections Panel — Slice 7 Persistent Memory Intelligence
 *
 * Displays autonomous post-incident reflections generated across 5 core questions:
 * What happened? Why? Was recommendation accurate? What to remember? What to improve?
 */

import React, { useState } from 'react';
import { AIReflection } from '@/types';
import { getReflections } from '@/services/memory';
import { Sparkles, Pin, Copy, Check, ChevronDown, ChevronUp, Brain, ShieldCheck, AlertTriangle } from 'lucide-react';

export function AIReflectionsPanel() {
  const [reflections, setReflections] = useState<AIReflection[]>(() => getReflections());
  const [expandedId, setExpandedId] = useState<string | null>('ref-001');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterTag, setFilterTag] = useState<string>('all');

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReflections((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isPinned: !r.isPinned } : r))
    );
  };

  const copyToClipboard = (reflection: AIReflection, e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `--- Hindsight AI Reflection (${reflection.incidentTitle}) ---
What Happened: ${reflection.whatHappened}
Why It Happened: ${reflection.whyItHappened}
Recommendation Accuracy: ${reflection.recommendationAccuracy}
What To Remember: ${reflection.whatToRemember}
What To Improve Next Time: ${reflection.whatToImproveNextTime}`;

    navigator.clipboard.writeText(text);
    setCopiedId(reflection.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sortedReflections = [...reflections].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const filteredReflections = filterTag === 'all'
    ? sortedReflections
    : sortedReflections.filter((r) => r.tags.includes(filterTag) || r.service === filterTag);

  const allTags = Array.from(new Set(reflections.flatMap((r) => r.tags)));

  const getAccuracyBadge = (acc: AIReflection['recommendationAccuracy']) => {
    switch (acc) {
      case 'Correct':
        return (
          <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[11px] font-medium">
            <ShieldCheck className="h-3 w-3" /> Accurate Prediction
          </span>
        );
      case 'Partially Correct':
        return (
          <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[11px] font-medium">
            <AlertTriangle className="h-3 w-3" /> Partial Accuracy
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded text-[11px] font-medium">
            <AlertTriangle className="h-3 w-3" /> Needs Improvement
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info Banner */}
      <div className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 via-[#161B26]/80 to-blue-900/20 p-5 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-inner">
            <Brain className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Autonomous 5-Question Reflection Engine</h3>
            <p className="text-xs text-slate-400">
              When an incident resolves, Hindsight analyzes telemetry, AI chat logs, and engineer feedback to synthesize lasting operational rules.
            </p>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Filter by topic:</span>
          <button
            onClick={() => setFilterTag('all')}
            className={`px-2.5 py-1 rounded-md transition-all shrink-0 font-medium ${
              filterTag === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Reflections ({reflections.length})
          </button>
          {allTags.slice(0, 5).map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-2.5 py-1 rounded-md transition-all shrink-0 font-medium ${
                filterTag === tag
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Reflections List */}
      <div className="space-y-4">
        {filteredReflections.map((ref) => {
          const isExpanded = expandedId === ref.id;

          return (
            <div
              key={ref.id}
              onClick={() => setExpandedId(isExpanded ? null : ref.id)}
              className={`group rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                ref.isPinned
                  ? 'border-purple-500/40 bg-gradient-to-r from-purple-950/20 via-[#161B26]/90 to-[#161B26]/90 shadow-purple-500/5 shadow-lg'
                  : 'border-white/10 glass-card hover:border-white/20 hover:glass-card shadow-md'
              }`}
            >
              {/* Card Top Summary */}
              <div className="p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => togglePin(ref.id, e)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      ref.isPinned
                        ? 'bg-purple-500/20 text-purple-400 border-purple-500/40 shadow-inner'
                        : 'bg-white/5 text-slate-500 border-white/5 hover:text-slate-300'
                    }`}
                    title={ref.isPinned ? 'Unpin reflection' : 'Pin to top'}
                  >
                    <Pin className={`h-4 w-4 ${ref.isPinned ? 'fill-purple-400' : ''}`} />
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                        {ref.incidentId}
                      </span>
                      <span className="text-xs font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {ref.service}
                      </span>
                      {getAccuracyBadge(ref.recommendationAccuracy)}
                    </div>
                    <h4 className="text-sm font-semibold text-white mt-1.5 group-hover:text-purple-300 transition-colors">
                      {ref.incidentTitle}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md">
                    <Sparkles className="h-3 w-3 text-purple-400" />
                    {ref.author}
                  </span>

                  <button
                    onClick={(e) => copyToClipboard(ref, e)}
                    className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                    title="Copy reflection markdown"
                  >
                    {copiedId === ref.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>

                  <div className="text-slate-400 group-hover:text-white transition-colors pl-1">
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </div>

              {/* Summary quote when collapsed */}
              {!isExpanded && (
                <div className="px-5 pb-4 pt-0 text-xs text-slate-300 italic flex items-center gap-2">
                  <span className="text-purple-400 font-bold">&quot;</span>
                  <span className="truncate">{ref.summary}</span>
                  <span className="text-purple-400 font-bold">&quot;</span>
                </div>
              )}

              {/* Expanded 5-Question Analysis */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-white/5 space-y-4 bg-slate-950/40 animate-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                    {/* Q1: What happened? */}
                    <div className="space-y-1.5 rounded-lg bg-slate-900/60 p-3.5 border border-white/5">
                      <span className="font-semibold text-purple-400 block uppercase tracking-wider text-[10px] flex items-center gap-1">
                        1. What happened?
                      </span>
                      <p className="text-slate-200 leading-relaxed">{ref.whatHappened}</p>
                    </div>

                    {/* Q2: Why did it happen? */}
                    <div className="space-y-1.5 rounded-lg bg-slate-900/60 p-3.5 border border-white/5">
                      <span className="font-semibold text-blue-400 block uppercase tracking-wider text-[10px] flex items-center gap-1">
                        2. Why did it happen?
                      </span>
                      <p className="text-slate-200 leading-relaxed">{ref.whyItHappened}</p>
                    </div>

                    {/* Q4: What should I remember? */}
                    <div className="space-y-1.5 rounded-lg bg-slate-900/60 p-3.5 border border-purple-500/20 bg-purple-950/10">
                      <span className="font-semibold text-emerald-400 block uppercase tracking-wider text-[10px] flex items-center gap-1">
                        4. What should I remember? (Institutional Rule)
                      </span>
                      <p className="text-slate-200 font-medium leading-relaxed">{ref.whatToRemember}</p>
                    </div>

                    {/* Q5: What can improve next time? */}
                    <div className="space-y-1.5 rounded-lg bg-slate-900/60 p-3.5 border border-blue-500/20 bg-blue-950/10">
                      <span className="font-semibold text-amber-400 block uppercase tracking-wider text-[10px] flex items-center gap-1">
                        5. What can improve next time? (AI Self-Correction)
                      </span>
                      <p className="text-slate-200 font-medium leading-relaxed">{ref.whatToImproveNextTime}</p>
                    </div>
                  </div>

                  {/* Footer tags */}
                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>Indexed vector tags:</span>
                      <div className="flex gap-1">
                        {ref.tags.map((t) => (
                          <span key={t} className="bg-white/5 text-slate-300 px-2 py-0.5 rounded">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span>Reflected on {new Date(ref.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
