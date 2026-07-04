'use client';

import { motion } from 'framer-motion';
import { Zap, CheckCircle2, Clock, Activity } from 'lucide-react';
import { budgetData } from '@/lib/mock-data/dashboard';
import { AnimatedCounter } from '@/components/ui/animated-counter';

// ─── Budget Widget ────────────────────────────────────────────

function BudgetBar({ spent, total, color }: { spent: number; total: number; color: string }) {
  const pct = Math.min((spent / total) * 100, 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Monthly Budget
        </span>
        <span className="text-[10px] font-bold" style={{ color: pct > 80 ? '#EF4444' : 'var(--text-muted)' }}>
          {pct.toFixed(0)}% used
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(148,163,184,0.1)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="h-full rounded-full"
          style={{
            background: pct > 80
              ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
              : `linear-gradient(90deg, ${color}, ${color}bb)`,
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
          ${spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          ${total.toLocaleString('en-US')} budget
        </span>
      </div>
    </div>
  );
}

export function AIHealthWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="glass-card p-5 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)', boxShadow: '0 0 16px rgba(59,130,246,0.3)' }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>AI Health</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>cascadeflow routing</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="pulse-dot pulse-dot-green" />
          <span className="text-[10px] font-semibold" style={{ color: '#34D399' }}>Operational</span>
        </div>
      </div>

      {/* Groq stats */}
      <div className="space-y-3 mb-5">
        <div
          className="rounded-xl p-3"
          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#60A5FA' }}>
              Groq · Primary
            </span>
            <CheckCircle2 size={11} style={{ color: '#34D399' }} />
          </div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
              Qwen3-32B
            </p>
            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(59,130,246,0.08)', color: '#93C5FD' }}>
              llama-3.3-70b
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Avg latency', value: `${budgetData.avgLatencyMs}ms` },
              { label: 'Success rate', value: `${budgetData.successRate}%` },
              { label: 'Requests today', value: budgetData.requestsToday.toLocaleString() },
              { label: 'Tokens today', value: `${(budgetData.tokensToday / 1_000_000).toFixed(1)}M` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[9px] uppercase tracking-wider mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="text-xs font-bold font-mono" style={{ color: 'var(--text-primary)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Budget */}
        <BudgetBar
          spent={budgetData.monthlySpend}
          total={budgetData.monthlyBudget}
          color="#8B5CF6"
        />

        <div className="flex items-center justify-between py-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Today's spend</span>
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            ${budgetData.todaySpend.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Est. monthly cost</span>
          <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            ${(budgetData.todaySpend * 30).toFixed(0)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Avg cost / incident</span>
          <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
            ${budgetData.avgCostPerIncident.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Future integrations */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>
          Future Routes
        </p>
        {[
          { name: 'Hindsight', desc: 'Long-term memory', color: '#8B5CF6' },
          { name: 'cascadeflow', desc: 'Model orchestration', color: '#06B6D4' },
        ].map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: 'rgba(148,163,184,0.04)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: item.color, opacity: 0.5 }}
              />
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {item.name}
              </span>
              <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>· {item.desc}</span>
            </div>
            <span
              className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ background: `${item.color}10`, color: item.color }}
            >
              Soon
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
