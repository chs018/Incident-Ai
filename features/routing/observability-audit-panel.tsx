'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  TrendingDown,
  TrendingUp,
  FileText,
  User,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import {
  getAuditLogs,
  getRuntimeAlerts,
  getCostOptimizationStats,
  getLatencyMetrics,
  dismissAlert,
  AuditLogEntry,
  RuntimeAlert,
} from '@/services/cascadeflow';

export function ObservabilityAuditPanel() {
  const [logs, setLogs] = useState<AuditLogEntry[]>(getAuditLogs());
  const [alerts, setAlerts] = useState<RuntimeAlert[]>(getRuntimeAlerts());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDecision, setFilterDecision] = useState<string>('all');

  const roi = getCostOptimizationStats();
  const latency = getLatencyMetrics();

  const handleDismissAlert = (id: string) => {
    const updated = dismissAlert(id);
    setAlerts([...updated]);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.incidentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.incidentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterDecision === 'all' || l.policyDecision === filterDecision;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Section: Before/After ROI & Performance Comparison */}
      <div className="p-6 rounded-2xl glass-card shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#8B5CF6' }} />
              <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Enterprise ROI & Latency Benchmarks
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Before vs. After cascadeflow Runtime Optimization</h3>
            <p className="text-xs text-slate-400">
              Dynamic model routing across Groq LPU and Llama models eliminates OpenAI latency penalties and unnecessary token billing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', border: '1px solid rgba(139, 92, 246, 0.3)' }}
            >
              <Sparkles size={14} />
              <span>Annual Savings: ${roi.totalDollarsSavedUsd.toLocaleString()} / yr</span>
            </span>
          </div>
        </div>

        {/* 3 Benchmark Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Cost Optimization */}
          <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Cost Per Incident Analysis
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-white">${roi.afterCascadeFlow.averageCostUsd.toFixed(4)}</span>
                <span className="text-xs text-slate-500 line-through">${roi.beforeCascadeFlow.averageCostUsd.toFixed(4)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <TrendingDown size={14} />
                <span>{roi.costSavedPercent}% Cost Reduction</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                LPU Routing
              </span>
            </div>
          </div>

          {/* Card 2: Latency Acceleration */}
          <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Average Response Time (MTTR Impact)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-cyan-300">{roi.afterCascadeFlow.averageLatencyMs} ms</span>
                <span className="text-xs text-slate-500 line-through">{roi.beforeCascadeFlow.averageLatencyMs} ms</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                <TrendingDown size={14} />
                <span>{roi.latencyImprovementPercent}% Faster Latency</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                Groq Neural Engine
              </span>
            </div>
          </div>

          {/* Card 3: Engineering Hours Saved */}
          <div className="p-5 rounded-xl border bg-slate-900/60 border-slate-800/80 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Engineering Wait Time Saved
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-purple-300">{roi.totalHoursSaved.toLocaleString()} hrs</span>
                <span className="text-xs text-slate-400">/ year across team</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ArrowUpRight size={14} />
                <span>3.2x Productivity Multiplier</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-800 px-2 py-0.5 rounded">
                SRE Velocity
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Runtime Alerts Feed */}
      {alerts.filter((a) => !a.resolved).length > 0 && (
        <div
          className="p-6 rounded-2xl glass-card shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-400" />
              <span>Active Runtime Governance Alerts</span>
            </h3>
            <span className="text-xs font-bold text-amber-400">
              {alerts.filter((a) => !a.resolved).length} Unresolved
            </span>
          </div>

          <div className="space-y-3">
            {alerts
              .filter((a) => !a.resolved)
              .map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl border bg-slate-900/80 border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{alert.title}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({alert.timestamp})</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">{alert.message}</p>
                      {alert.actionableText && (
                        <p className="text-[11px] font-semibold text-amber-300 mt-1">💡 Action: {alert.actionableText}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismissAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                  >
                    <Check size={14} className="text-emerald-400" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Bottom Section: Immutable Audit Ledger */}
      <div className="p-6 rounded-2xl glass-card shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FileText size={18} className="text-cyan-400" />
              <span>Immutable SOC2 & ISO27001 AI Governance Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">
              Every token, latency SLA, model selection, and policy proof is logged to a tamper-proof enterprise audit trail.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search incident, user, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56"
              />
            </div>

            <select
              value={filterDecision}
              onChange={(e) => setFilterDecision(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Policy Decisions</option>
              <option value="Approved">Approved</option>
              <option value="Escalated">Escalated</option>
              <option value="Fallback Activated">Fallback Activated</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Timestamp & ID</th>
                <th className="pb-3">User & Role</th>
                <th className="pb-3">Incident Outage Target</th>
                <th className="pb-3">Routed Model Endpoint</th>
                <th className="pb-3">Latency SLA</th>
                <th className="pb-3">Tokens & Cost</th>
                <th className="pb-3 text-right pr-2">Policy Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 pl-2">
                    <span className="font-mono text-slate-300 font-bold block">{log.id}</span>
                    <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-semibold text-slate-200 block">{log.user}</span>
                    <span className="text-[10px] text-slate-400">{log.userRole}</span>
                  </td>
                  <td className="py-3 max-w-xs">
                    <span className="font-bold text-slate-100 truncate block">{log.incidentTitle}</span>
                    <span className="text-[10px] font-mono text-cyan-400">{log.incidentId}</span>
                  </td>
                  <td className="py-3">
                    <span className="font-semibold text-slate-200 block">{log.selectedModel}</span>
                    <span className="text-[10px] text-slate-400">Confidence: {log.confidence}%</span>
                  </td>
                  <td className="py-3">
                    <span
                      className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
                      style={{
                        background: log.latencyMs < 1500 ? 'rgba(6, 182, 212, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: log.latencyMs < 1500 ? '#06B6D4' : '#F59E0B',
                      }}
                    >
                      {log.latencyMs} ms
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="font-mono text-slate-200 block">{log.tokens.toLocaleString()} tok</span>
                    <span className="text-[10px] font-mono text-emerald-400">${log.costUsd.toFixed(4)}</span>
                  </td>
                  <td className="py-3 text-right pr-2">
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide"
                      style={{
                        background:
                          log.policyDecision === 'Approved'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : log.policyDecision === 'Escalated'
                            ? 'rgba(139, 92, 246, 0.15)'
                            : 'rgba(245, 158, 11, 0.15)',
                        color:
                          log.policyDecision === 'Approved'
                            ? '#10B981'
                            : log.policyDecision === 'Escalated'
                            ? '#8B5CF6'
                            : '#F59E0B',
                        border: `1px solid ${
                          log.policyDecision === 'Approved'
                            ? 'rgba(16, 185, 129, 0.3)'
                            : log.policyDecision === 'Escalated'
                            ? 'rgba(139, 92, 246, 0.3)'
                            : 'rgba(245, 158, 11, 0.3)'
                        }`,
                      }}
                    >
                      {log.policyDecision}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
