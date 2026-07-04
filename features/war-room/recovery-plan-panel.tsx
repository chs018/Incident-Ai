'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Activity,
  FileCheck,
  Terminal,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIRecommendationItem, SuggestedCommand } from '@/types';

interface StepItem {
  id: string;
  title: string;
  type: 'immediate' | 'recommended' | 'validation' | 'verification' | 'rollback';
  timeEst: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  probability: string;
  description: string;
  command?: string;
  completed?: boolean;
}

const initialSteps: StepItem[] = [
  {
    id: 'step-1',
    title: 'Rollback deployment version to v4.8.1',
    type: 'immediate',
    timeEst: '~2 mins',
    risk: 'Low',
    probability: '98%',
    description: 'Reverts the unindexed session cache query introduced in deployment v4.8.2 that caused Redis memory fragmentation and connection pool exhaustion.',
    command: 'kubectl rollout undo deployment/payment-api -n prod-us-east-1',
    completed: false,
  },
  {
    id: 'step-2',
    title: 'Force failover & restart Redis Cluster cache nodes',
    type: 'immediate',
    timeEst: '~3 mins',
    risk: 'Low',
    probability: '94%',
    description: 'Clears fragmented volatile memory and promotes healthy read replicas to master shards without dropping existing authenticated sessions.',
    command: 'aws elasticache test-failover --replication-group-id redis-session-prod --node-group-id 0001',
    completed: false,
  },
  {
    id: 'step-3',
    title: 'Increase Redis maxmemory limit to 24GB (ElastiCache r6g.xlarge)',
    type: 'recommended',
    timeEst: '~5 mins',
    risk: 'Low',
    probability: '99%',
    description: 'Provides 2x memory headroom to prevent future OOM evictions during high-concurrency checkout spikes.',
    command: 'terraform apply -target=aws_elasticache_replication_group.session_store -auto-approve',
    completed: false,
  },
  {
    id: 'step-4',
    title: 'Validate upstream connection pool configuration',
    type: 'recommended',
    timeEst: '~1 min',
    risk: 'Low',
    probability: '95%',
    description: 'Verify that max_connections in payment-api application.yml is properly tuned to match Redis socket limits.',
    command: 'cat /etc/config/payment-api/application.yml | grep pool_size',
    completed: false,
  },
  {
    id: 'step-5',
    title: 'Verify endpoint liveness probe health checks',
    type: 'recommended',
    timeEst: '~1 min',
    risk: 'Low',
    probability: '100%',
    description: 'Execute synthetic HTTP GET probes across all 12 EKS pods to confirm 200 OK responses and 0% error rate.',
    command: 'for pod in $(kubectl get pods -l app=payment-api -o name); do kubectl exec $pod -- curl -s -o /dev/null -w "%{http_code}\\n" http://localhost:8080/healthz; done',
    completed: false,
  },
];

interface RecoveryPlanPanelProps {
  recommendations?: AIRecommendationItem[];
  commands?: SuggestedCommand[];
}

export function RecoveryPlanPanel({ recommendations, commands }: RecoveryPlanPanelProps) {
  const [steps, setSteps] = useState<StepItem[]>(initialSteps);
  const [expandedId, setExpandedId] = useState<string | null>('step-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sync dynamic recommendations from AI when available
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      const mapped: StepItem[] = recommendations.map((rec) => ({
        id: rec.id,
        title: rec.title,
        type: rec.category,
        timeEst: rec.timeEst,
        risk: rec.risk,
        probability: `${rec.probability}%`,
        description: `${rec.description} — ${rec.reasoning}`,
        command: rec.command,
        completed: false,
      }));
      setSteps(mapped);
      if (mapped[0]) setExpandedId(mapped[0].id);
    }
  }, [recommendations]);

  const toggleComplete = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleCopy = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const completedCount = steps.filter((s) => s.completed).length;
  const activeCommands = commands || steps.filter(s => s.command).map(s => ({
    id: s.id,
    command: s.command!,
    description: s.title,
    category: 'kubernetes',
    risk: s.risk,
    syntaxLang: 'bash'
  }));

  return (
    <div className="glass-card rounded-2xl border p-5 space-y-6 relative overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
      {/* Top AI Glow */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 shadow-inner">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">AI Suggested Recovery Plan</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25">
                Groq Qwen3-32B Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Automated remediation steps ranked by success probability & SRE confidence
            </p>
          </div>
        </div>

        {/* Progress Counter */}
        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-bold text-slate-300">
            {completedCount} / {steps.length}
          </span>
          <p className="text-[10px] text-slate-500">Steps executed</p>
        </div>
      </div>

      {/* Prediction Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-blue-950/40 border border-purple-500/20">
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <Clock size={11} className="text-blue-400" />
            <span>Est. Resolution</span>
          </span>
          <p className="text-sm font-extrabold text-white font-mono">~6 mins</p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <Activity size={11} className="text-emerald-400" />
            <span>Success Prob.</span>
          </span>
          <p className="text-sm font-extrabold text-emerald-400 font-mono">98.2%</p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <ShieldCheck size={11} className="text-sky-400" />
            <span>Risk Level</span>
          </span>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/25">
            Low Risk
          </span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
            <CheckCircle2 size={11} className="text-purple-400" />
            <span>Business Impact</span>
          </span>
          <p className="text-xs font-semibold text-slate-200 truncate" title="Zero downtime during failover">
            Zero downtime
          </p>
        </div>
      </div>

      {/* Immediate Actions Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>Immediate Mitigations (P0 Critical)</span>
        </div>

        <div className="space-y-2">
          {steps.filter((s) => s.type === 'immediate').map((step) => (
            <div
              key={step.id}
              className={cn(
                'rounded-xl border transition-all overflow-hidden',
                step.completed ? 'bg-emerald-500/[0.04] border-emerald-500/30' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              )}
            >
              <div
                onClick={() => setExpandedId(expandedId === step.id ? null : step.id)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(step.id);
                    }}
                    className={cn(
                      'w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0',
                      step.completed
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'border-slate-600 bg-slate-950 hover:border-slate-400'
                    )}
                  >
                    {step.completed && <Check size={12} strokeWidth={3} />}
                  </button>

                  <div className="min-w-0">
                    <p className={cn('text-xs font-bold truncate transition-colors', step.completed ? 'text-slate-400 line-through' : 'text-white')}>
                      {step.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-mono">{step.timeEst}</span>
                      <span className="text-slate-600">&middot;</span>
                      <span className="text-[10px] font-semibold text-emerald-400 font-mono">Prob: {step.probability}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/20 hidden sm:inline-block">
                    {step.risk} Risk
                  </span>
                  <div className="text-slate-400">
                    {expandedId === step.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </div>
              </div>

              {/* Expandable Explanation & CLI Command */}
              <AnimatePresence>
                {expandedId === step.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t px-3.5 py-3 space-y-2.5 bg-slate-950/60"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {step.description}
                    </p>

                    {step.command && (
                      <div className="p-2.5 rounded-lg glass-card border border-slate-800 flex items-center justify-between gap-2 font-mono text-[11px] text-sky-300">
                        <span className="truncate">{step.command}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(step.command!, step.id)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white shrink-0 transition-colors"
                          title="Copy command"
                        >
                          {copiedId === step.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Follow-up Actions */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <FileCheck size={14} className="text-blue-400" />
          <span>Recommended Follow-up & Verification</span>
        </div>

        <div className="space-y-2">
          {steps.filter((s) => s.type !== 'immediate').map((step) => (
            <div
              key={step.id}
              className={cn(
                'rounded-xl border transition-all overflow-hidden',
                step.completed ? 'bg-emerald-500/[0.04] border-emerald-500/30' : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
              )}
            >
              <div
                onClick={() => setExpandedId(expandedId === step.id ? null : step.id)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(step.id);
                    }}
                    className={cn(
                      'w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0',
                      step.completed
                        ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                        : 'border-slate-600 bg-slate-950 hover:border-slate-400'
                    )}
                  >
                    {step.completed && <Check size={12} strokeWidth={3} />}
                  </button>

                  <div className="min-w-0">
                    <p className={cn('text-xs font-semibold truncate transition-colors', step.completed ? 'text-slate-500 line-through' : 'text-slate-200')}>
                      {step.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-500 font-mono">{step.timeEst}</span>
                      <span className="text-slate-600">&middot;</span>
                      <span className="text-[10px] font-semibold text-emerald-400 font-mono">Prob: {step.probability}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 hidden sm:inline-block">
                    {step.risk} Risk
                  </span>
                  <div className="text-slate-500">
                    {expandedId === step.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </div>
              </div>

              {/* Expandable Explanation & CLI Command */}
              <AnimatePresence>
                {expandedId === step.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t px-3.5 py-3 space-y-2.5 bg-slate-950/60"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.description}
                    </p>

                    {step.command && (
                      <div className="p-2.5 rounded-lg glass-card border border-slate-800 flex items-center justify-between gap-2 font-mono text-[11px] text-sky-300">
                        <span className="truncate">{step.command}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(step.command!, step.id)}
                          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white shrink-0 transition-colors"
                          title="Copy command"
                        >
                          {copiedId === step.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Dedicated Suggested Commands Section */}
      {activeCommands.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
              <Terminal size={14} />
              <span>Suggested Terminal Commands (One-Click Copy)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Syntax: bash / kubectl / sql</span>
          </div>

          <div className="space-y-2">
            {activeCommands.map((cmd) => (
              <div key={cmd.id} className="p-3 rounded-xl glass-card border border-slate-800/90 space-y-1.5 hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-semibold">{cmd.description}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border",
                    cmd.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    cmd.risk === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  )}>
                    {cmd.risk} Risk
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 pt-1">
                  <code className="text-[11px] font-mono text-sky-300 break-all">{cmd.command}</code>
                  <button
                    type="button"
                    onClick={() => handleCopy(cmd.command, cmd.id)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition-colors flex items-center gap-1 text-[10px] font-mono"
                  >
                    {copiedId === cmd.id ? <><Check size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
