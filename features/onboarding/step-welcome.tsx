'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, ShieldCheck, ArrowRight, BookOpen, Layers, Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';

interface StepWelcomeProps {
  onNext: () => void;
}

const features = [
  {
    icon: Brain,
    title: 'Persistent AI Memory',
    description: 'Captures organizational knowledge, historical runbooks, and past resolutions into an evolving neural vector database.',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.22)',
    badge: 'Core Engine',
  },
  {
    icon: Sparkles,
    title: 'Intelligent Incident Analysis',
    description: 'Groq-powered Llama-3 neural processing for sub-second root cause diagnosis and automated blast-radius mapping.',
    color: '#8B5CF6',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.22)',
    badge: 'Groq Powered',
  },
  {
    icon: ShieldCheck,
    title: 'Runtime Intelligence',
    description: 'Autonomous self-healing workflows, live telemetry correlation across Datadog/Prometheus, and smart on-call routing.',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.22)',
    badge: 'Self-Healing',
  },
];

export function StepWelcome({ onNext }: StepWelcomeProps) {
  const [showLearnMore, setShowLearnMore] = useState(false);

  return (
    <div className="space-y-8 relative">
      {/* Floating ambient glow specifically for welcome */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-12 -left-12 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)' }}
      />

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center sm:text-left space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }}>
          <Sparkles size={13} className="animate-pulse" />
          <span>Enterprise AI Setup · Fortune 500 Ready</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Welcome to <span className="gradient-text-blue">AI Incident Commander</span>
        </h1>
        
        <p className="text-sm sm:text-base max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Let's configure your AI-powered incident response workspace. In the next few steps, we'll set up your organization, integrate your telemetry tools, and onboard your engineering team.
        </p>
      </motion.div>

      {/* Feature Cards Grid */}
      <div className="grid sm:grid-cols-3 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.15 + idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card p-5 flex flex-col justify-between relative overflow-hidden group transition-all"
              style={{ border: `1px solid ${feat.border}` }}
            >
              {/* Subtle top glow on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: feat.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: feat.bg, border: `1px solid ${feat.border}` }}
                  >
                    <Icon size={20} style={{ color: feat.color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ background: 'rgba(148,163,184,0.1)', color: 'var(--text-muted)' }}
                  >
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center gap-1.5 text-[11px] font-semibold"
                style={{ borderColor: 'var(--border-subtle)', color: feat.color }}>
                <span>Active module</span>
                <CheckCircle size={12} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Learn More Modal / Drawer */}
      <AnimatePresence>
        {showLearnMore && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-5 space-y-3 bg-gradient-to-br from-blue-950/20 to-purple-950/20"
              style={{ border: '1px solid rgba(96,165,250,0.2)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#60A5FA' }}>
                  <BookOpen size={16} />
                  <span>Why AI Incident Commander is Different</span>
                </div>
                <button
                  onClick={() => setShowLearnMore(false)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Close ×
                </button>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                Unlike traditional monitoring dashboards that flood you with alerts, AI Incident Commander acts as an autonomous Staff Engineer. It continuously ingests logs from Datadog and Elastic, maps dependencies in real-time, and generates actionable, blameless mitigation steps within 3 seconds of incident detection.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-blue-400">99.99% SLA</div>
                  <div className="text-[10px] text-slate-400">Carrier-grade reliability</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-purple-400">10× Faster</div>
                  <div className="text-[10px] text-slate-400">MTTR reduction</div>
                </div>
                <div className="p-2.5 rounded-lg bg-black/30 border border-slate-800 text-center">
                  <div className="text-xs font-bold text-emerald-400">Zero Trust</div>
                  <div className="text-[10px] text-slate-400">SOC2 Type II compliant</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          <Activity size={14} className="text-emerald-400" />
          <span>Estimated setup time: <strong className="text-slate-300 font-semibold">2–3 minutes</strong></span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setShowLearnMore(!showLearnMore)}
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-slate-800/60"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            {showLearnMore ? 'Hide Details' : 'Learn More'}
          </button>

          <motion.button
            type="button"
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
            }}
          >
            <span>Get Started</span>
            <ArrowRight size={15} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function CheckCircle({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
