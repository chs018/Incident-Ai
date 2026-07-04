'use client';

/**
 * AI Improvement Comparison Card — Slice 7 Persistent Memory Intelligence (War Room)
 *
 * THE DEMO HIGHLIGHT: Side-by-side comparison illustrating how Hindsight persistent
 * institutional memory prevents catastrophic generic AI recommendations by recalling
 * historical outage patterns and verified remediation runbooks.
 */

import React from 'react';
import { AIImprovementComparison } from '@/types';
import { Brain, Sparkles, AlertTriangle, ShieldCheck, ArrowRight, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  improvement?: AIImprovementComparison;
}

export function AIImprovementCard({ improvement }: Props) {
  if (!improvement) return null;

  const { withoutMemory, withMemory } = improvement;

  return (
    <div className="rounded-xl border border-purple-500/40 bg-gradient-to-br from-[#161B26]/95 via-[#1A132B]/95 to-[#161B26]/95 p-6 shadow-2xl backdrop-blur-md space-y-6 animate-in fade-in duration-500 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 border border-white/20">
            <Brain className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                Hindsight Memory Value Demonstration
              </h3>
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Demo Highlight
              </span>
            </div>
            <p className="text-xs text-slate-300">
              See how persistent institutional memory prevents risky generic AI remediation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-mono">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-slate-400">Memories Consulted:</span>
          <strong className="text-purple-300 font-bold">{withMemory.memoriesUsedCount} Historical Outages</strong>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        {/* Left: Without Memory (Generic / Risky) */}
        <div className="rounded-xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-900/80 p-5 space-y-4 relative group hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <XCircle className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Without Memory (Generic LLM)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
              {withoutMemory.risk} Risk
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Suggested Recommendation
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/60 p-3 rounded-lg border border-white/5">
              &quot;{withoutMemory.recommendation}&quot;
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Potential Operational Pitfall:</span>
            </div>
            <p className="text-[11px] text-rose-200/90 leading-relaxed bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/20">
              {withoutMemory.potentialPitfall}
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-white/5">
            <span>Model Confidence:</span>
            <span className="font-mono font-bold text-slate-300">{withoutMemory.confidence}% (Uncontextualized)</span>
          </div>
        </div>

        {/* Right: With Memory (Hindsight Powered) */}
        <div className="rounded-xl border border-purple-500/50 bg-gradient-to-b from-purple-950/30 via-slate-900/90 to-slate-900/90 p-5 space-y-4 relative group hover:border-purple-400 transition-all shadow-xl shadow-purple-500/10">
          <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1">
                With Hindsight Memory
                <Sparkles className="h-3 w-3 text-purple-400" />
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              {withMemory.risk} Risk
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-purple-300 uppercase tracking-wider block flex items-center justify-between">
              <span>Hindsight Enriched Recommendation</span>
              <span className="text-[10px] text-emerald-400 font-normal">Validated Pattern</span>
            </span>
            <p className="text-xs text-white leading-relaxed font-semibold bg-purple-950/40 p-3 rounded-lg border border-purple-500/30 shadow-inner">
              &quot;{withMemory.recommendation}&quot;
            </p>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Hindsight Contribution Highlight:</span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30">
              {withMemory.contributionHighlight}
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-300 pt-2 border-t border-white/5">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-400" /> Confidence:
            </span>
            <span className="font-mono font-bold text-emerald-400 text-xs">{withMemory.confidence}% (Reinforced by {withMemory.memoriesUsedCount} outages)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
