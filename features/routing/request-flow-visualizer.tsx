'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  CheckCircle2,
  Cpu,
  DollarSign,
  ShieldCheck,
  GitBranch,
  Sparkles,
  Database,
  FileText,
  Clock,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';

interface FlowStage {
  id: string;
  stageNum: number;
  title: string;
  subtitle: string;
  detail: string;
  icon: React.ElementType;
  color: string;
  badge: string;
}

const STAGES: FlowStage[] = [
  {
    id: 's1',
    stageNum: 1,
    title: 'User Request',
    subtitle: 'Prompt Ingestion & Tokenizing',
    detail: 'Ingested 3,420 prompt tokens from Payment API Gateway incident triage.',
    icon: FileText,
    color: '#3B82F6',
    badge: '3.4k Tokens',
  },
  {
    id: 's2',
    stageNum: 2,
    title: 'Complexity Analysis',
    subtitle: 'Semantic Triage & Severity Scoring',
    detail: 'Classified as High Complexity multi-service database deadlock and connection pool starvation.',
    icon: Cpu,
    color: '#8B5CF6',
    badge: 'High Complexity',
  },
  {
    id: 's3',
    stageNum: 3,
    title: 'Budget Check',
    subtitle: 'Financial Headroom & Cap Verification',
    detail: 'Daily spend at $12.48 of $50.00 cap (24.9% utilized). Approved for standard reasoning tier.',
    icon: DollarSign,
    color: '#10B981',
    badge: '$37.52 Headroom',
  },
  {
    id: 's4',
    stageNum: 4,
    title: 'Policy Check',
    subtitle: 'SOC2 & ISO27001 Governance Rules',
    detail: 'All 4 mandatory production governance rules passed without triggering degradation.',
    icon: ShieldCheck,
    color: '#06B6D4',
    badge: '4/4 Passed',
  },
  {
    id: 's5',
    stageNum: 5,
    title: 'Model Selection',
    subtitle: 'Optimal SLA & Cost Routing',
    detail: 'Selected Qwen 2.5 32B (Groq LPU) over GPT-4o for 67% faster latency and 78% cost reduction.',
    icon: GitBranch,
    color: '#3B82F6',
    badge: 'Qwen3-32B LPU',
  },
  {
    id: 's6',
    stageNum: 6,
    title: 'Inference Engine',
    subtitle: 'High-Speed LPU Neural Execution',
    detail: 'Streaming inference executed in 1,120ms at 820 tokens/sec without throttling.',
    icon: Zap,
    color: '#F59E0B',
    badge: '1,120ms (820 t/s)',
  },
  {
    id: 's7',
    stageNum: 7,
    title: 'Confidence Evaluation',
    subtitle: 'SLA Quality & Hallucination Check',
    detail: 'Achieved 96% confidence score (exceeding 85% SLA). No reasoning escalation required.',
    icon: Sparkles,
    color: '#10B981',
    badge: '96% Confidence',
  },
  {
    id: 's8',
    stageNum: 8,
    title: 'Memory Update',
    subtitle: 'Hindsight Institutional Indexing',
    detail: 'Vector embeddings and resolution runbooks indexed into Hindsight persistent storage.',
    icon: Database,
    color: '#8B5CF6',
    badge: 'Hindsight Synced',
  },
  {
    id: 's9',
    stageNum: 9,
    title: 'Audit Log',
    subtitle: 'Immutable SOC2 Ledger Recording',
    detail: 'Logged timestamp, user, model, latency, cost ($0.0412), and policy proof to tamper-proof ledger.',
    icon: CheckCircle2,
    color: '#06B6D4',
    badge: 'SOC2 Logged',
  },
];

export function RequestFlowVisualizer() {
  const [activeStage, setActiveStage] = useState<number>(0); // 0 = idle, 1..9 = running/done
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedStageDetail, setSelectedStageDetail] = useState<FlowStage | null>(STAGES[4]); // default to Model Selection

  const startSimulation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStage(1);
  };

  useEffect(() => {
    if (!isRunning) return;
    if (activeStage >= STAGES.length) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setActiveStage((prev) => prev + 1);
      if (activeStage <= STAGES.length) {
        setSelectedStageDetail(STAGES[activeStage - 1]);
      }
    }, 600); // 600ms per stage

    return () => clearTimeout(timer);
  }, [isRunning, activeStage]);

  return (
    <div className="p-6 rounded-2xl glass-card shadow-xl overflow-x-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: '#06B6D4' }} />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#06B6D4' }}>
              Runtime Orchestration Pipeline
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">AI Request Flow Visualization</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Every AI request is intercepted, evaluated, and governed through a 9-stage execution flow before reaching the user.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={startSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
            style={{
              background: isRunning ? 'rgba(100, 116, 139, 0.3)' : 'linear-gradient(135deg, #06B6D4, #3B82F6)',
              color: '#ffffff',
              cursor: isRunning ? 'not-allowed' : 'pointer',
            }}
          >
            {isRunning ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Executing Pipeline ({activeStage}/9)...</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-current" />
                <span>Simulate Live Request</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* 9-Stage Horizontal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-9 gap-3 mb-8">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isDone = activeStage > stage.stageNum || (!isRunning && activeStage === STAGES.length);
          const isCurrent = activeStage === stage.stageNum && isRunning;
          const isSelected = selectedStageDetail?.id === stage.id;

          return (
            <motion.div
              key={stage.id}
              whileHover={{ y: -3 }}
              onClick={() => setSelectedStageDetail(stage)}
              className="relative p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between"
              style={{
                background: isCurrent
                  ? 'rgba(6, 182, 212, 0.15)'
                  : isSelected
                  ? 'rgba(59, 130, 246, 0.1)'
                  : 'var(--bg-surface)',
                borderColor: isCurrent
                  ? '#06B6D4'
                  : isSelected
                  ? '#3B82F6'
                  : isDone
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'var(--border-subtle)',
                boxShadow: isCurrent ? '0 0 20px rgba(6, 182, 212, 0.3)' : 'none',
              }}
            >
              {/* Stage number & status */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-[10px] font-extrabold px-1.5 py-0.5 rounded"
                  style={{
                    background: isDone ? 'rgba(16, 185, 129, 0.2)' : isCurrent ? 'rgba(6, 182, 212, 0.2)' : 'rgba(148, 163, 184, 0.1)',
                    color: isDone ? '#10B981' : isCurrent ? '#06B6D4' : '#94A3B8',
                  }}
                >
                  STAGE 0{stage.stageNum}
                </span>

                {isDone ? (
                  <CheckCircle2 size={13} style={{ color: '#10B981' }} />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ background: '#06B6D4' }} />
                ) : (
                  <Icon size={13} style={{ color: stage.color }} />
                )}
              </div>

              {/* Title */}
              <div className="my-1">
                <p className="text-xs font-bold text-slate-100 line-clamp-1">{stage.title}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{stage.subtitle}</p>
              </div>

              {/* Badge */}
              <div className="mt-3 pt-2 border-t border-slate-800/80">
                <span
                  className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded w-full text-center truncate"
                  style={{
                    background: `${stage.color}15`,
                    color: stage.color,
                    border: `1px solid ${stage.color}30`,
                  }}
                >
                  {stage.badge}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected Stage Explainability Panel */}
      <AnimatePresence mode="wait">
        {selectedStageDetail && (
          <motion.div
            key={selectedStageDetail.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 rounded-xl border bg-slate-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            style={{ borderColor: selectedStageDetail.color }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${selectedStageDetail.color}20`, border: `1px solid ${selectedStageDetail.color}40` }}
              >
                <selectedStageDetail.icon size={22} style={{ color: selectedStageDetail.color }} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{ background: `${selectedStageDetail.color}20`, color: selectedStageDetail.color }}
                  >
                    Stage {selectedStageDetail.stageNum} of 9
                  </span>
                  <span className="text-xs font-bold text-slate-200">· {selectedStageDetail.title}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">{selectedStageDetail.subtitle}</h3>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">{selectedStageDetail.detail}</p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mb-1">Governance Status</span>
              <span
                className="text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.3)' }}
              >
                <CheckCircle2 size={13} />
                <span>Verified & Approved</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
