'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  ToggleLeft,
  ToggleRight,
  Sliders,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  Info,
} from 'lucide-react';
import { getBudgetStatus, getPolicies, togglePolicy, BudgetStatus, PolicyRule } from '@/services/cascadeflow';

export function BudgetPolicyManager() {
  const [budget, setBudget] = useState<BudgetStatus>(getBudgetStatus());
  const [policies, setPolicies] = useState<PolicyRule[]>(getPolicies());
  const [degradationMode, setDegradationMode] = useState<'fallback_lightweight' | 'throttle' | 'ollama_local'>('fallback_lightweight');
  const [isSaving, setIsSaving] = useState(false);

  const handleTogglePolicy = (id: string) => {
    const updated = togglePolicy(id);
    setPolicies([...updated]);
  };

  const handleSavePolicy = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Top Section: Live Spend Meters */}
      <div className="p-6 rounded-2xl glass-card shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Financial Governance & Cost Controls
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">Enterprise AI Spend Meters</h3>
            <p className="text-xs text-slate-400">
              Real-time expenditure tracking with automated financial safeguards and graceful degradation thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="text-xs font-extrabold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              <CheckCircle2 size={14} />
              <span>Budget Headroom: ${budget.budgetRemainingUsd.toLocaleString()} / mo</span>
            </span>
          </div>
        </div>

        {/* 4 Spend Meters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Today Spend / Daily Cap',
              value: `$${budget.todaySpendUsd.toFixed(2)}`,
              sub: `of $${budget.dailyBudgetUsd.toFixed(2)} limit`,
              percent: (budget.todaySpendUsd / budget.dailyBudgetUsd) * 100,
              color: '#10B981',
            },
            {
              label: 'Monthly Spend / Monthly Cap',
              value: `$${budget.monthlySpendUsd.toFixed(2)}`,
              sub: `of $${budget.monthlyBudgetUsd.toLocaleString()} budget`,
              percent: (budget.monthlySpendUsd / budget.monthlyBudgetUsd) * 100,
              color: '#3B82F6',
            },
            {
              label: 'Avg Cost Per Incident',
              value: `$${budget.averageCostPerIncidentUsd.toFixed(4)}`,
              sub: 'Target: < $0.1000 / outage',
              percent: 45,
              color: '#8B5CF6',
            },
            {
              label: 'Forecasted Monthly Spend',
              value: `$${budget.forecastedMonthlySpendUsd.toFixed(2)}`,
              sub: '22.8% below budget cap',
              percent: (budget.forecastedMonthlySpendUsd / budget.monthlyBudgetUsd) * 100,
              color: '#06B6D4',
            },
          ].map((meter, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border bg-slate-900/60 border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-medium text-slate-400 block mb-1">{meter.label}</span>
                <span className="text-xl font-extrabold text-white block">{meter.value}</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">{meter.sub}</span>
              </div>

              <div className="mt-4">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, meter.percent)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: meter.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Graceful Degradation Toggle Banner */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders size={20} className="text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-100">Automated Graceful Degradation Policy</h4>
              <p className="text-xs text-slate-300">
                When daily spend reaches 90% ($45.00), how should cascadeflow handle incoming SRE requests?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {[
              { id: 'fallback_lightweight', label: 'Fallback to Llama 8B' },
              { id: 'ollama_local', label: 'Failover to Local Ollama' },
              { id: 'throttle', label: 'Throttle Non-P0 Queries' },
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setDegradationMode(mode.id as any)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 md:flex-initial"
                style={{
                  background: degradationMode === mode.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.8)',
                  color: degradationMode === mode.id ? '#10B981' : '#94A3B8',
                  border: `1px solid ${degradationMode === mode.id ? '#10B981' : 'transparent'}`,
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Configurable Governance Rules */}
      <div className="p-6 rounded-2xl glass-card shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-400" />
              <span>Active Governance & Compliance Rules</span>
            </h3>
            <p className="text-xs text-slate-400">
              Toggle runtime policies enforced prior to LLM inference. All changes take effect immediately across all services.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSavePolicy}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            style={{
              background: isSaving ? 'rgba(100, 116, 139, 0.3)' : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              color: '#ffffff',
            }}
          >
            {isSaving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Syncing Policies...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} />
                <span>Save Governance Changes</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {policies.map((pol) => (
            <div
              key={pol.id}
              className="p-4 rounded-xl border transition-all flex items-start justify-between gap-4"
              style={{
                background: pol.enabled ? 'rgba(59, 130, 246, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                borderColor: pol.enabled ? 'rgba(59, 130, 246, 0.3)' : 'var(--border-subtle)',
              }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      background: pol.enabled ? 'rgba(59, 130, 246, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                      color: pol.enabled ? '#3B82F6' : '#94A3B8',
                    }}
                  >
                    {pol.category.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-slate-100">{pol.name}</span>
                </div>

                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{pol.description}</p>
                <div className="mt-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 inline-block">
                  Expression: {pol.ruleExpression}
                </div>
              </div>

              <button
                onClick={() => handleTogglePolicy(pol.id)}
                className="shrink-0 mt-1 focus:outline-none"
                title={pol.enabled ? 'Disable Policy' : 'Enable Policy'}
              >
                {pol.enabled ? (
                  <ToggleRight size={28} className="text-blue-400 transition-all cursor-pointer hover:scale-110" />
                ) : (
                  <ToggleLeft size={28} className="text-slate-600 transition-all cursor-pointer hover:scale-110" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
