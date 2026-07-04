'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Cpu,
  Sparkles,
  ArrowRight,
  Layers,
  Zap,
  Server,
  ShieldAlert,
} from 'lucide-react';
import { MODEL_REGISTRY } from '@/services/cascadeflow';

export function ModelRoutingDashboard() {
  const [selectedRouteRule, setSelectedRouteRule] = useState<string>('rule-root-cause');

  const routingRules = [
    {
      id: 'rule-summary',
      name: 'Simple Log Summary & Fast Triage',
      trigger: 'Task Type: log_summary | Complexity: Low/Medium',
      routedModel: 'Llama 3.1 8B Instant (Groq LPU)',
      latencySla: '< 500ms',
      costTier: '$0.05 / M tokens',
      rationale: 'Routes high-volume log formatting to lightweight LPU model for sub-500ms response at 92% cost savings.',
      color: '#10B981',
    },
    {
      id: 'rule-root-cause',
      name: 'Multi-Service Root Cause Analysis',
      trigger: 'Task Type: root_cause_analysis | Severity: High/Critical',
      routedModel: 'Qwen 2.5 32B (Groq LPU)',
      latencySla: '< 1,200ms',
      costTier: '$0.59 / M tokens',
      rationale: 'Primary workhorse routing. Leverages 32B analytical reasoning on Groq LPU for deep telemetry correlation without OpenAI latency penalties.',
      color: '#06B6D4',
    },
    {
      id: 'rule-exec-report',
      name: 'Formal Executive Report & SOC2 Postmortem',
      trigger: 'Task Type: executive_report | Require High Confidence: True',
      routedModel: 'GPT-4o Enterprise / GPT-OSS 120B',
      latencySla: '< 3,200ms',
      costTier: '$2.50 / M tokens',
      rationale: 'Escalates to heavyweight multimodal foundation models when formal executive formatting and regulatory compliance are required.',
      color: '#8B5CF6',
    },
    {
      id: 'rule-local-fallback',
      name: 'Zero-Cost Local Ollama Failover',
      trigger: 'Condition: Daily Budget > 90% OR Cloud Provider Degradation',
      routedModel: 'Mistral 7B (Local Ollama)',
      latencySla: '< 800ms',
      costTier: '$0.00 (On-Premise)',
      rationale: 'Autonomous graceful degradation. Protects engineering workflow from cloud billing caps or network outages.',
      color: '#F59E0B',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section: Active Routing Decision Overview */}
      <div className="p-6 rounded-2xl glass-card shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#06B6D4' }} />
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Live Runtime Decision Telemetry
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Most Recent Triage Routing: Payment API Outage</h3>
            <p className="text-xs text-slate-400">
              Request ID: <span className="font-mono text-slate-300">req-894210</span> · Evaluated against 8 available models in 4ms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', border: '1px solid rgba(6, 182, 212, 0.3)' }}
            >
              <Zap size={14} />
              <span>SLA Compliance: 100%</span>
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Selected Model vs Alternative Models */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Selected Model Card (7 cols) */}
          <div className="lg:col-span-7 p-5 rounded-xl glass-card relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  SELECTED OPTIMAL MODEL
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  <span>Approved by Policy Engine</span>
                </span>
              </div>

              <h4 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Qwen 2.5 32B (Groq LPU)</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">qwen-2.5-32b</span>
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                High-speed analytical reasoning engine optimized for Site Reliability & DevOps root cause triage.
              </p>

              {/* Rationale Box */}
              <div className="mt-4 p-3 rounded-lg bg-slate-900/90 border border-cyan-500/30">
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-0.5">Why This Model Was Selected</p>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Selected Qwen 2.5 32B as optimal workhorse for SRE analytical precision and sub-second LPU latency. Avoided GPT-4o to prevent 3,200ms latency penalty while achieving 96% confidence.
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-3 mt-6 pt-4 border-t border-cyan-500/20">
              <div>
                <span className="text-[10px] text-slate-400 block">Confidence</span>
                <span className="text-sm font-extrabold text-emerald-400">96.0%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Actual Latency</span>
                <span className="text-sm font-extrabold text-cyan-300">1,120 ms</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Total Tokens</span>
                <span className="text-sm font-extrabold text-slate-200">3,420</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Actual Cost</span>
                <span className="text-sm font-extrabold text-purple-300">$0.0412</span>
              </div>
            </div>
          </div>

          {/* Right: Alternative Models Considered (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Alternative Models Evaluated & Rejected
            </h4>

            {[
              {
                name: 'GPT-4o Enterprise',
                provider: 'OpenAI',
                reason: 'Excessive latency (3,200ms vs 1,120ms SLA target) and 6.2x higher token cost for standard triage.',
                tier: 'Reasoning Tier',
                color: '#F59E0B',
              },
              {
                name: 'Llama 3.1 8B Instant',
                provider: 'Groq LPU',
                reason: 'Rejected: Insufficient reasoning capacity for High Complexity multi-service database deadlock.',
                tier: 'Lightweight Tier',
                color: '#EF4444',
              },
              {
                name: 'Claude 3.5 Sonnet',
                provider: 'Anthropic',
                reason: 'Not optimal price/performance match; reserved for code generation and CI/CD pipeline patches.',
                tier: 'Reasoning Tier',
                color: '#EC4899',
              },
            ].map((alt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border bg-slate-900/60 border-slate-800/80 flex items-start gap-3"
              >
                <div className="mt-0.5 text-red-400 shrink-0">
                  <XCircle size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-200 truncate">{alt.name}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {alt.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{alt.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Configurable Dynamic Routing Rules */}
      <div className="p-6 rounded-2xl glass-card shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers size={18} className="text-purple-400" />
              <span>Configurable Dynamic Routing Rules</span>
            </h3>
            <p className="text-xs text-slate-400">
              cascadeflow automatically maps incoming prompt complexity and SLA constraints to the optimal model tier.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {routingRules.map((rule) => {
            const isSelected = selectedRouteRule === rule.id;
            return (
              <motion.div
                key={rule.id}
                whileHover={{ y: -3 }}
                onClick={() => setSelectedRouteRule(rule.id)}
                className="p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between"
                style={{
                  background: isSelected ? 'var(--primary-glow)' : 'var(--glass-bg)',
                  borderColor: isSelected ? '#8B5CF6' : 'var(--border-subtle)',
                  boxShadow: isSelected ? '0 0 20px rgba(139, 92, 246, 0.2)' : 'none',
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded"
                      style={{ background: `${rule.color}20`, color: rule.color }}
                    >
                      RULE ACTIVE
                    </span>
                    <GitBranch size={14} style={{ color: rule.color }} />
                  </div>

                  <h4 className="text-sm font-bold text-slate-100 mt-2">{rule.name}</h4>
                  <p className="text-[11px] font-mono text-slate-400 mt-1 bg-slate-900/80 p-1.5 rounded border border-slate-800">
                    {rule.trigger}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 uppercase block mb-0.5">Target Model Endpoint</span>
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <ArrowRight size={12} style={{ color: rule.color }} />
                      <span>{rule.routedModel}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">SLA: <strong className="text-slate-200">{rule.latencySla}</strong></span>
                  <span className="text-slate-400">Cost: <strong className="text-slate-200">{rule.costTier}</strong></span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rationale Footer for Selected Rule */}
        {selectedRouteRule && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-purple-400 shrink-0" />
              <p className="text-xs text-slate-200">
                <strong>Rule Rationale:</strong> {routingRules.find((r) => r.id === selectedRouteRule)?.rationale}
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider shrink-0 ml-4">
              Enforced by cascadeflow
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
