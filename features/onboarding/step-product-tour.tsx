'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, ArrowRight, ArrowLeft, X, Compass, Search, Bell, Cpu, Activity, Layers, DollarSign, Award, Rocket, Shield } from 'lucide-react';
import Link from 'next/link';
import { OnboardingFormData } from './onboarding-types';

interface StepProductTourProps {
  formData: OnboardingFormData;
}

const TOUR_STEPS = [
  {
    title: 'Sidebar Navigation',
    description: 'Explore your active War Room, Neural Routing, Persistent Memory, and Operational Analytics modules.',
    icon: Layers,
    color: '#3B82F6',
    position: 'Left Dock',
  },
  {
    title: 'Command-K Neural Lookup',
    description: 'Sub-second AI semantic search across incident timelines, logs, postmortems, and team runbooks.',
    icon: Search,
    color: '#8B5CF6',
    position: 'Top Header',
  },
  {
    title: 'Real-time SEV Alert Feed',
    description: 'Instant PagerDuty, Datadog, and SMS alert aggregation with automated severity triage.',
    icon: Bell,
    color: '#F59E0B',
    position: 'Top Right',
  },
  {
    title: 'Groq LPU Health & Status',
    description: 'Real-time telemetry and inference latency tracking for sub-second root cause diagnosis.',
    icon: Cpu,
    color: '#10B981',
    position: 'Header Bar',
  },
  {
    title: 'Live Active Incidents Table',
    description: 'Real-time active SEV-1 / SEV-2 triage with automated blast-radius mapping and 1-click mitigation.',
    icon: Activity,
    color: '#EF4444',
    position: 'Main Feed',
  },
  {
    title: 'Workspace Switcher',
    description: 'Seamlessly toggle between Production, Staging, and Development operational environments.',
    icon: Compass,
    color: '#06B6D4',
    position: 'Top Left',
  },
  {
    title: 'AI Budget & Spend Cap',
    description: 'Live token burn rate tracking, daily spend trends, and monthly enterprise budget caps.',
    icon: DollarSign,
    color: '#A78BFA',
    position: 'Sidebar Bottom',
  },
];

export function StepProductTour({ formData }: StepProductTourProps) {
  const [tourIndex, setTourIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = TOUR_STEPS[tourIndex];
  const Icon = currentStep?.icon || Sparkles;

  const handleNextStep = () => {
    if (tourIndex < TOUR_STEPS.length - 1) {
      setTourIndex(tourIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleSkipTour = () => {
    setIsCompleted(true);
  };

  if (isCompleted) {
    return (
      <div className="text-center space-y-8 py-6 relative">
        {/* Confetti / Glow simulation */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-2 relative"
          style={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.5)',
          }}
        >
          <Award size={40} className="text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 size={14} />
            <span>Workspace Successfully Created</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Your AI Operations Center is ready.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Welcome aboard, <strong className="text-white">{formData.orgName || 'CloudNova Technologies'}</strong>. Your telemetry pipelines are wired, your team is invited, and the <strong className="text-blue-400">{formData.aiProvider}</strong> neural engine is standing by.
          </p>
        </motion.div>

        {/* Quick specs pill box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3 max-w-lg mx-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs"
        >
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">Environment</span>
            <span className="font-bold text-red-400 capitalize">{formData.environment}</span>
          </div>
          <div className="text-center border-x border-slate-800">
            <span className="text-[10px] text-slate-400 block mb-0.5">Cloud</span>
            <span className="font-bold text-white">{formData.cloudProvider}</span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">AI Engine</span>
            <span className="font-bold text-blue-400">{formData.aiProvider}</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/war-room"
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-semibold transition-all hover:bg-slate-800/80 text-center"
            style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
          >
            Explore War Room
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs font-extrabold transition-all"
            style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
              color: 'white',
              boxShadow: '0 4px 24px rgba(59, 130, 246, 0.45)',
            }}
          >
            <Rocket size={16} />
            <span>Go to Command Center</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Compass size={12} />
            <span>Interactive Walkthrough</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Product Tour
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSkipTour}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span>Skip Tour</span>
          <X size={14} />
        </button>
      </div>

      {/* Simulated UI Backdrop with Highlighted Tooltip Card */}
      <div className="glass-card p-8 min-h-[340px] flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl">
        {/* Background grid simulation */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59,130,246,0.3) 0%, transparent 80%)`,
          }}
        />

        {/* Step indicator pills */}
        <div className="flex items-center gap-2 mb-6 relative z-10">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === tourIndex ? 24 : 8,
                background: i === tourIndex ? '#60A5FA' : 'rgba(148,163,184,0.2)',
              }}
            />
          ))}
        </div>

        {/* Main Floating Tooltip Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tourIndex}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg p-6 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-4 relative z-10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${currentStep.color}18`, border: `1px solid ${currentStep.color}30` }}
                >
                  <Icon size={20} style={{ color: currentStep.color }} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Landmark {tourIndex + 1} of {TOUR_STEPS.length} · {currentStep.position}
                  </span>
                  <h3 className="text-base font-bold text-white">{currentStep.title}</h3>
                </div>
              </div>

              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {tourIndex + 1}/{TOUR_STEPS.length}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStep.description}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-[10px] text-slate-500">
                Click next to explore the next landmark
              </span>
              <button
                type="button"
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                  color: 'white',
                  boxShadow: '0 2px 12px rgba(59, 130, 246, 0.35)',
                }}
              >
                <span>{tourIndex < TOUR_STEPS.length - 1 ? 'Next Landmark' : 'Finish Tour'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          type="button"
          onClick={() => tourIndex > 0 && setTourIndex(tourIndex - 1)}
          disabled={tourIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-slate-800/60 disabled:opacity-40 disabled:pointer-events-none"
          style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={14} />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleSkipTour}
          className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
        >
          Skip to Dashboard →
        </button>
      </div>
    </div>
  );
}
