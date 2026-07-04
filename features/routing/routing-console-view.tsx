'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  Layers,
  ShieldCheck,
  FileText,
  Cpu,
  Zap,
  Sparkles,
  Activity,
  CheckCircle2,
  DollarSign,
  Clock,
} from 'lucide-react';
import { RequestFlowVisualizer } from './request-flow-visualizer';
import { ModelRoutingDashboard } from './model-routing-dashboard';
import { BudgetPolicyManager } from './budget-policy-manager';
import { ObservabilityAuditPanel } from './observability-audit-panel';

export function RoutingConsoleView() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'routing' | 'governance' | 'audit'>('pipeline');

  const tabs = [
    { id: 'pipeline', label: 'Execution Pipeline', icon: Layers, badge: '9-Stage Flow', color: '#06B6D4' },
    { id: 'routing', label: 'Dynamic Model Routing', icon: GitBranch, badge: 'LPU Neural Engine', color: '#3B82F6' },
    { id: 'governance', label: 'Budget & Policy Controls', icon: ShieldCheck, badge: 'SOC2 Compliant', color: '#10B981' },
    { id: 'audit', label: 'Observability & Audit Ledger', icon: FileText, badge: 'Immutable Trail', color: '#8B5CF6' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl relative overflow-hidden glass-card shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                <Sparkles size={11} />
                <span>Vertical Slice 8 — Enterprise AI Governance</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">powered by cascadeflow™</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Runtime Intelligence & AI Governance Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl leading-relaxed">
              Centralized mission control for AI request orchestration. Enforces daily budget caps, multi-model SLA routing across Groq LPU, and immutable SOC2 compliance logging without bypassing existing SRE workflows.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Zap size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg LPU Latency</span>
                <span className="text-sm font-extrabold text-white">1,120 ms</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <DollarSign size={20} />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Cost / Outage</span>
                <span className="text-sm font-extrabold text-white">$0.0380</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id as any)}
              className="px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2.5 shrink-0 relative"
              style={{
                background: isActive ? `${tab.color}15` : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                border: `1px solid ${isActive ? tab.color : 'transparent'}`,
              }}
            >
              <Icon size={16} style={{ color: isActive ? tab.color : 'var(--text-muted)' }} />
              <span>{tab.label}</span>
              <span
                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? tab.color : 'rgba(100, 116, 139, 0.2)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {tab.badge}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                  style={{ background: tab.color }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'pipeline' && <RequestFlowVisualizer />}
          {activeTab === 'routing' && <ModelRoutingDashboard />}
          {activeTab === 'governance' && <BudgetPolicyManager />}
          {activeTab === 'audit' && <ObservabilityAuditPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
