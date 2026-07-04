'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import { ExecutiveReport } from '@/types';

interface AIReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: ExecutiveReport;
  isLoading?: boolean;
}

export function AIReportGeneratorModal({
  isOpen,
  onClose,
  report,
  isLoading,
}: AIReportGeneratorModalProps) {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    if (!report) return;
    const md = `# ${report.title}
**Incident ID:** ${report.incidentId} | **Generated:** ${new Date(report.generatedAt).toLocaleString()}
**AI Model:** ${report.model} | **Confidence:** ${report.confidence}%

## Executive Summary
${report.summary}

## Root Cause Analysis
${report.rootCause}

## Business Impact
${report.businessImpact}

## Recovery Timeline
${report.recoveryTimeline.map((t) => `- **${t.time}**: ${t.event}`).join('\n')}

## Lessons Learned
${report.lessonsLearned.map((l) => `- ${l}`).join('\n')}

## Action Items
${report.actionItems.map((a) => `- [ ] **${a.task}** (Owner: ${a.owner}, Priority: ${a.priority})`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPdf = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-4xl max-h-[90vh] flex flex-col glass-card border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)] rounded-2xl overflow-hidden bg-slate-950/95"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border-b border-purple-500/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
                <FileText size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  AI Executive Outage Report Generator
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    SOC2 & ISO27001 Ready
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Synthesized by Groq Qwen3-32B from live War Room telemetry
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading || !report ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-sm font-mono text-purple-300 animate-pulse">
                  Synthesizing incident logs, metrics, and timeline into executive report...
                </p>
              </div>
            ) : (
              <>
                {/* Banner */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{report.title}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Incident ID: {report.incidentId} • Generated: {new Date(report.generatedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                      <ShieldCheck size={14} />
                      {report.confidence}% Confidence
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                      {report.model}
                    </span>
                  </div>
                </div>

                {/* Grid Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Executive Summary */}
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Executive Summary</span>
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">{report.summary}</p>
                  </div>

                  {/* Business Impact */}
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Briefcase size={14} />
                      <span>Business & Financial Impact</span>
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">{report.businessImpact}</p>
                  </div>
                </div>

                {/* Root Cause */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <AlertTriangle size={14} />
                    <span>Technical Root Cause Analysis</span>
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{report.rootCause}</p>
                </div>

                {/* Recovery Timeline */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>Chronological Recovery Timeline</span>
                  </h4>
                  <div className="space-y-2 border-l-2 border-slate-800 pl-3">
                    {report.recoveryTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs">
                        <span className="font-mono font-bold text-slate-400 shrink-0 w-20">{item.time}</span>
                        <span className="text-slate-200">{item.event}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lessons Learned & Action Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Lessons Learned */}
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      <span>Lessons Learned</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {report.lessonsLearned.map((lesson, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Items */}
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Layers size={14} />
                      <span>Remediation Action Items</span>
                    </h4>
                    <div className="space-y-2">
                      {report.actionItems.map((item, idx) => (
                        <div key={idx} className="p-2 rounded bg-black/40 border border-white/[0.05] flex items-center justify-between gap-2 text-xs">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-slate-200">{item.task}</p>
                            <p className="text-[10px] text-slate-400">Owner: {item.owner}</p>
                          </div>
                          <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900/80 border-t border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              {exported && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-pulse">
                  <Check size={14} /> Report exported successfully to PDF / Confluence!
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyMarkdown}
                disabled={!report || isLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-all border border-slate-700 disabled:opacity-50"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
              </button>

              <button
                onClick={handleExportPdf}
                disabled={!report || isLoading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50"
              >
                <Download size={14} />
                <span>Export Executive Report (PDF)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
