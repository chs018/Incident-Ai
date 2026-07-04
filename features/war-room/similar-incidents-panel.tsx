'use client';

/**
 * Similar Incidents Panel — Slice 7 Persistent Memory Intelligence (War Room)
 *
 * Displays historical outages retrieved from Hindsight persistent memory with
 * vector similarity scores, verified remediation runbooks, and one-click reuse.
 */

import React, { useState } from 'react';
import { HistoricalMemory, Incident } from '@/types';
import { Brain, Sparkles, CheckCircle2, Clock, ExternalLink, ArrowUpRight, ShieldCheck, User } from 'lucide-react';

interface Props {
  incidents?: HistoricalMemory[];
  onReuseRecovery?: (resolution: string) => void;
}

export function SimilarIncidentsPanel({ incidents = [], onReuseRecovery }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reusedId, setReusedId] = useState<string | null>(null);

  if (incidents.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 glass-card p-5 shadow-lg backdrop-blur-md text-center text-slate-400 space-y-2">
        <Brain className="h-8 w-8 text-slate-500 mx-auto animate-pulse" />
        <h4 className="text-sm font-semibold text-white">Querying Hindsight Memory...</h4>
        <p className="text-xs">No historical outage vectors matched yet for this service.</p>
      </div>
    );
  }

  const handleReuse = (mem: HistoricalMemory) => {
    setReusedId(mem.id);
    if (onReuseRecovery) {
      onReuseRecovery(mem.resolution);
    }
    setTimeout(() => setReusedId(null), 3000);
  };

  const getBadgeColor = (badge: HistoricalMemory['relevanceBadge']) => {
    switch (badge) {
      case 'Exact Pattern':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';
      case 'High Similarity':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold';
      case 'Related Service':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="rounded-xl border border-purple-500/30 bg-gradient-to-b from-[#161B26]/90 to-[#121620]/90 p-5 shadow-xl backdrop-blur-md space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              Hindsight Similar Incidents
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                {incidents.length} Found
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Vector pattern retrieval from institutional memory
            </p>
          </div>
        </div>

        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
          <Sparkles className="h-3 w-3" /> Auto-Matched
        </span>
      </div>

      {/* List of Similar Memories */}
      <div className="space-y-3">
        {incidents.map((mem) => {
          const isSelected = selectedId === mem.id;
          const isReused = reusedId === mem.id;

          return (
            <div
              key={mem.id}
              onClick={() => setSelectedId(isSelected ? null : mem.id)}
              className={`rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? 'border-purple-500/60 bg-gradient-to-r from-purple-950/30 via-slate-900/90 to-slate-900/90 shadow-lg shadow-purple-500/10'
                  : 'border-white/10 bg-slate-900/60 hover:border-white/20 hover:bg-slate-900/90'
              }`}
            >
              <div className="p-4 space-y-3">
                {/* Top bar: Similarity badge & title */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] border flex items-center gap-1 ${getBadgeColor(mem.relevanceBadge)}`}>
                        <Sparkles className="h-2.5 w-2.5" />
                        {mem.relevanceBadge} ({mem.similarityScore}%)
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {mem.incidentId}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                      {mem.title}
                    </h4>
                  </div>

                  <div className="text-right shrink-0 text-[11px]">
                    <span className="block font-semibold text-emerald-400">
                      {mem.recoverySuccessRate}% Success
                    </span>
                    <span className="text-slate-400 font-mono">
                      MTTR: {mem.timeToResolution}m
                    </span>
                  </div>
                </div>

                {/* Similarity Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>Vector distance match</span>
                    <span className="text-purple-300 font-semibold">{mem.similarityScore}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      style={{ width: `${mem.similarityScore}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="pt-3 border-t border-white/10 space-y-3 text-xs bg-slate-950/50 -mx-4 -mb-4 p-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <span className="font-semibold text-rose-400 block uppercase tracking-wider text-[10px]">
                        Historical Root Cause
                      </span>
                      <p className="text-slate-200 leading-relaxed">
                        {mem.rootCause}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-emerald-400 block uppercase tracking-wider text-[10px]">
                        Verified Remediation Applied
                      </span>
                      <p className="text-slate-200 leading-relaxed font-medium">
                        {mem.resolution}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 text-purple-400" />
                        SME: <strong className="text-slate-200">{mem.engineer.name}</strong>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReuse(mem);
                          }}
                          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                            isReused
                              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                              : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-500/20'
                          }`}
                        >
                          {isReused ? (
                            <>
                              <ShieldCheck className="h-3.5 w-3.5" /> Applied to Recovery Plan!
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="h-3.5 w-3.5" /> Reuse Recovery Runbook
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
