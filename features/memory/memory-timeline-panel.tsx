'use client';

/**
 * Memory Timeline Panel — Slice 7 Persistent Memory Intelligence
 *
 * Interactive timeline displaying how operational knowledge evolves from an initial
 * production anomaly through AI analysis, engineer action, reflection, and permanent Hindsight storage.
 */

import React from 'react';
import { getKnowledgeTimeline } from '@/services/memory';
import { Sparkles, CheckCircle2, ShieldAlert, Bot, UserCheck, Brain, ArrowRight, Activity } from 'lucide-react';

export function MemoryTimelinePanel() {
  const events = getKnowledgeTimeline();

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'Incident Created':
        return <ShieldAlert className="h-4 w-4 text-rose-400" />;
      case 'AI Analysis':
        return <Bot className="h-4 w-4 text-blue-400" />;
      case 'Memory Retrieved':
        return <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />;
      case 'Engineer Action':
        return <UserCheck className="h-4 w-4 text-amber-400" />;
      case 'Final Resolution':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'Reflection Generated':
        return <Brain className="h-4 w-4 text-indigo-400" />;
      case 'Memory Stored':
        return <Sparkles className="h-4 w-4 text-purple-400" />;
      default:
        return <Activity className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'Incident Created':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'AI Analysis':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Memory Retrieved':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-semibold shadow-sm shadow-purple-500/20';
      case 'Engineer Action':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Final Resolution':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Reflection Generated':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'Memory Stored':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="rounded-xl border border-white/10 glass-card p-5 shadow-lg backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Institutional Knowledge Lifecycle</h3>
            <p className="text-xs text-slate-400">
              Trace how Hindsight captures telemetry, recalls historical outages, learns from engineer fixes, and indexes permanent vectors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-purple-300 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-lg">
          <span>Lifecycle Speed:</span>
          <strong className="text-white">14 mins total</strong>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative rounded-xl border border-white/10 glass-card p-6 shadow-lg backdrop-blur-md">
        {/* Vertical Line */}
        <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-gradient-to-b from-rose-500 via-purple-500 to-emerald-500 opacity-30" />

        <div className="space-y-8 relative z-10">
          {events.map((ev, idx) => (
            <div key={ev.id} className="flex items-start gap-4 group">
              {/* Icon Circle */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-md group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-300">
                {getStageIcon(ev.stage)}
              </div>

              {/* Event Card */}
              <div className="flex-1 rounded-xl border border-white/5 bg-slate-900/60 p-4 hover:border-white/10 hover:bg-slate-900/90 transition-all duration-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] border ${getStageBadgeColor(ev.stage)}`}>
                      {ev.stage}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {ev.title}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                  {ev.description}
                </p>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    Actor: <strong className="text-slate-200">{ev.actor}</strong>
                  </span>
                  {idx < events.length - 1 && (
                    <span className="flex items-center gap-1 text-purple-400">
                      Next Stage <ArrowRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
