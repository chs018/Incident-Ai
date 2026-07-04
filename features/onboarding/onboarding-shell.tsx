'use client';

import { motion } from 'framer-motion';
import { Zap, Check, Clock } from 'lucide-react';
import { STEPS } from './onboarding-types';

interface OnboardingShellProps {
  currentStep: number;
  children: React.ReactNode;
}

export function OnboardingShell({ currentStep, children }: OnboardingShellProps) {
  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const remainingSteps = STEPS.slice(currentStep);
  const remainingSeconds = remainingSteps.reduce((acc, s) => {
    const n = parseInt(s.time);
    return acc + n;
  }, 0);
  const remainingMin = Math.ceil(remainingSeconds / 60);

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'var(--bg-base)', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-200px', left: '-200px',
          width: '700px', height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '-200px', right: '-100px',
          width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Left Panel: Progress sidebar ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex flex-col w-72 shrink-0 p-8 relative"
        style={{ borderRight: '1px solid var(--border-subtle)' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                boxShadow: '0 0 20px rgba(59,130,246,0.35)',
              }}
            >
              <Zap size={17} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                AI Incident Commander
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                Workspace Setup
              </p>
            </div>
          </div>

          {/* Step list */}
          <div className="space-y-1 flex-1">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                  style={{
                    background: isCurrent
                      ? 'rgba(59,130,246,0.1)'
                      : 'transparent',
                    border: isCurrent
                      ? '1px solid rgba(59,130,246,0.2)'
                      : '1px solid transparent',
                  }}
                >
                  {/* Step indicator */}
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-[10px] font-bold"
                    style={{
                      background: isCompleted
                        ? 'rgba(16,185,129,0.15)'
                        : isCurrent
                          ? 'rgba(59,130,246,0.2)'
                          : 'rgba(148,163,184,0.08)',
                      color: isCompleted
                        ? '#34D399'
                        : isCurrent
                          ? '#60A5FA'
                          : 'var(--text-muted)',
                      border: isCompleted
                        ? '1px solid rgba(16,185,129,0.25)'
                        : isCurrent
                          ? '1px solid rgba(59,130,246,0.3)'
                          : '1px solid var(--border-subtle)',
                    }}
                  >
                    {isCompleted ? <Check size={11} /> : idx + 1}
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{
                        color: isCompleted
                          ? '#34D399'
                          : isCurrent
                            ? 'var(--text-primary)'
                            : 'var(--text-muted)',
                      }}
                    >
                      {step.label}
                    </p>
                  </div>

                  {/* Time */}
                  {isCurrent && (
                    <span
                      className="text-[9px] font-mono shrink-0"
                      style={{ color: '#60A5FA' }}
                    >
                      ~{step.time}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Progress bar + time remaining */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Progress
              </span>
              <span className="text-[10px] font-bold" style={{ color: '#60A5FA' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(148,163,184,0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ background: 'linear-gradient(90deg, #3B82F6, #6366F1)' }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} style={{ color: 'var(--text-muted)' }} />
              <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                ~{remainingMin} min remaining
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Right Panel: Step content ─────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Mobile top progress bar */}
        <div
          className="lg:hidden h-1 shrink-0"
          style={{ background: 'rgba(148,163,184,0.08)' }}
        >
          <motion.div
            className="h-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{ background: 'linear-gradient(90deg, #3B82F6, #6366F1)' }}
          />
        </div>

        {/* Mobile logo strip */}
        <div className="lg:hidden flex items-center gap-2.5 px-6 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}
          >
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            AI Incident Commander
          </span>
          <div className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
            Step {currentStep + 1}/{STEPS.length}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 flex items-start justify-center p-6 lg:p-12">
          <div className="w-full max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
