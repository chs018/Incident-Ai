'use client';

/**
 * Memory Confidence Badge — Slice 7 Persistent Memory Intelligence (War Room)
 *
 * Scannable telemetry badge displaying Hindsight memory retrieval metrics:
 * vector matches count, average confidence, relevance score, age, and success rate.
 */

import React from 'react';
import { MemoryConfidence } from '@/types';
import { Brain, Sparkles, CheckCircle2, Clock, ShieldCheck, Database } from 'lucide-react';

interface Props {
  confidence?: MemoryConfidence;
}

export function MemoryConfidenceBadge({ confidence }: Props) {
  if (!confidence || confidence.matchesCount === 0) return null;

  return (
    <div className="rounded-xl border border-purple-500/30 glass-card p-4 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
          <Brain className="h-4 w-4 animate-pulse" />
        </div>
        <div>
          <span className="font-bold text-white flex items-center gap-1.5">
            Hindsight Memory Retrieval Active
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-1.5 py-0.5 rounded font-mono">
              {confidence.matchesCount} Vector Matches
            </span>
          </span>
          <span className="text-[11px] text-slate-400 block">
            AI recommendations are contextualized by institutional memory
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-2.5 py-1 rounded-md">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span className="text-slate-400">Avg Relevance:</span>
          <strong className="text-white font-bold">{confidence.relevanceScore}%</strong>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-2.5 py-1 rounded-md">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">Historical Success:</span>
          <strong className="text-emerald-400 font-bold">{confidence.historicalSuccessRate}%</strong>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 border border-white/10 px-2.5 py-1 rounded-md">
          <Clock className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-slate-400">Last Used:</span>
          <strong className="text-slate-200">{new Date(confidence.lastUsedTimestamp).toLocaleDateString()}</strong>
        </div>
      </div>
    </div>
  );
}
