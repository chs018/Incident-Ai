'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Terminal,
  ShieldAlert,
  BrainCircuit,
  Eye,
  Info,
} from 'lucide-react';
import { AIInvestigationData, ProbableCause } from '@/types';

interface AIInvestigationPanelProps {
  investigation?: AIInvestigationData;
  isLoading?: boolean;
}

export function AIInvestigationPanel({ investigation, isLoading }: AIInvestigationPanelProps) {
  const [expandedCauseId, setExpandedCauseId] = useState<string | null>('rc-1');
  const [showReasoning, setShowReasoning] = useState<boolean>(true);

  if (isLoading) {
    return (
      <div className="glass-card p-6 space-y-4 animate-pulse border border-purple-500/20 bg-purple-950/10">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-purple-400 animate-spin" size={20} />
          <div className="h-4 w-48 bg-purple-500/20 rounded" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3 w-full bg-slate-800/60 rounded" />
          <div className="h-3 w-5/6 bg-slate-800/60 rounded" />
          <div className="h-3 w-4/6 bg-slate-800/60 rounded" />
        </div>
      </div>
    );
  }

  if (!investigation) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden border border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.12)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border-b border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30">
            <BrainCircuit size={16} className="text-purple-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              AI Incident Investigation
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Senior SRE Mode
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Deep telemetry correlation across logs, metrics, and deployment pipelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-300">
              {investigation.confidenceLevel}% Confidence
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* ── Section 1: Observed Symptoms & Evidence ──────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Symptoms */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider">
              <Eye size={14} />
              <span>Observed Symptoms ({investigation.observedSymptoms.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {investigation.observedSymptoms.map((sym, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-400 font-bold mt-0.5">•</span>
                  <span className="leading-relaxed">{sym}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Evidence */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <FileText size={14} />
              <span>Key Evidence Snippets ({investigation.evidence.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {investigation.evidence.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-2 font-mono text-[11px] bg-black/40 p-1.5 rounded border border-white/[0.05]">
                  <span className="text-amber-400 shrink-0">✔</span>
                  <span className="text-slate-200">{ev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Section 2: Expandable Root Cause Analysis Cards ──────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-purple-400" />
              <span>Probable Root Causes ({investigation.possibleRootCauses.length})</span>
            </h4>
            <span className="text-[11px] text-slate-500">Click card to expand reasoning</span>
          </div>

          <div className="space-y-2.5">
            {investigation.possibleRootCauses.map((cause) => {
              const isExpanded = expandedCauseId === cause.id;
              const riskColor =
                cause.risk === 'Critical'
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : cause.risk === 'High'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30';

              return (
                <div
                  key={cause.id}
                  onClick={() => setExpandedCauseId(isExpanded ? null : cause.id)}
                  className={`rounded-xl border transition-all cursor-pointer overflow-hidden ${
                    isExpanded
                      ? 'bg-gradient-to-r from-purple-950/40 via-slate-900/90 to-indigo-950/40 border-purple-500/50 shadow-md'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full bg-purple-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{cause.title}</span>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${riskColor}`}>
                            {cause.risk} Risk
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{cause.explanation}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] uppercase text-slate-500 font-bold block">Confidence</span>
                        <span className="text-sm font-mono font-extrabold text-emerald-400">{cause.confidence}%</span>
                      </div>
                      {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-4 pb-4 pt-1 border-t border-white/[0.06] space-y-3 bg-black/20"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-purple-300">Detailed Explanation</span>
                          <p className="text-xs text-slate-200 leading-relaxed">{cause.explanation}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-amber-300">Supporting Evidence</span>
                          <div className="flex flex-wrap gap-1.5">
                            {cause.evidence.map((ev, i) => (
                              <span key={i} className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                                🔍 {ev}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-purple-300 text-[11px] uppercase tracking-wider">
                            <Info size={13} />
                            <span>Why the AI Reached This Conclusion</span>
                          </div>
                          <p className="leading-relaxed text-[11px] text-slate-300">{cause.reasoning}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section 3: Metric Correlations & Supporting Logs ─────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Metric Correlations */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Activity size={14} />
              <span>Telemetry Metric Correlations</span>
            </div>
            <div className="space-y-2">
              {investigation.metricCorrelations.map((corr, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/[0.05] text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-200">
                    <span>{corr.metric}</span>
                    <span className="text-red-400 font-mono">{corr.observation}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">⚡ Impact: {corr.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Logs */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Terminal size={14} />
              <span>Supporting Log Anomalies</span>
            </div>
            <div className="space-y-2 font-mono text-[11px]">
              {investigation.supportingLogs.map((log, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-black/60 border border-red-500/20 text-red-300 break-all leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Section 4: Explainable AI Reasoning & Missing Info ───── */}
        <div className="pt-2 border-t border-white/[0.06] space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-purple-200 transition-colors"
            >
              <HelpCircle size={15} />
              <span>Explain AI Investigation Reasoning & Logic</span>
              {showReasoning ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {investigation.missingInformation.length > 0 && (
              <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>{investigation.missingInformation.length} Telemetry Gaps Identified</span>
              </span>
            )}
          </div>

          <AnimatePresence>
            {showReasoning && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/50 to-indigo-950/50 border border-purple-500/30 text-xs text-slate-200 leading-relaxed">
                  <p className="font-semibold text-purple-200 mb-1">🧠 Senior SRE Triage Synthesis:</p>
                  <p>{investigation.reasoning}</p>
                </div>

                {investigation.missingInformation.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <ShieldAlert size={14} />
                      <span>Missing Telemetry / Recommended Next Diagnostic Steps</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-amber-200/90">
                      {investigation.missingInformation.map((info, idx) => (
                        <li key={idx} className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="text-amber-400">➜</span>
                          <span>{info}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
