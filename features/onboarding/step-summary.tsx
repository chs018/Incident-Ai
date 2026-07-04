'use client';

import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Building2, Server, Users, Cpu, ArrowRight, ArrowLeft, ShieldCheck, Activity, Award } from 'lucide-react';
import { OnboardingFormData } from './onboarding-types';

interface StepSummaryProps {
  formData: OnboardingFormData;
  onNext: () => void;
  onBack: () => void;
}

export function StepSummary({ formData, onNext, onBack }: StepSummaryProps) {
  const wsName = formData.workspaceName || (formData.orgName ? `${formData.orgName} Ops` : 'Production Ops');

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 size={14} />
          <span>Configuration Complete · 100% Ready</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Workspace Summary
        </h2>
        <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
          Review your baseline architecture before deploying your AI Operations Center.
        </p>
      </div>

      {/* Main Grid: Summary Card + Metrics */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Detailed Configuration Summary (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-7 glass-card p-6 space-y-6 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-xl relative overflow-hidden"
        >
          {/* Top banner */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}
              >
                {formData.orgName ? formData.orgName.substring(0, 2).toUpperCase() : 'AI'}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">{formData.orgName || 'CloudNova Technologies'}</h3>
                <p className="text-xs text-blue-400 font-mono">{wsName} · {formData.environment}</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Enterprise Tenant
            </span>
          </div>

          {/* Config Grid */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} className="text-blue-400" /> Industry & Scale
              </span>
              <p className="font-bold text-slate-200">{formData.industry}</p>
              <p className="text-[11px] text-slate-400">{formData.companySize} employees</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Server size={13} className="text-purple-400" /> Cloud & Region
              </span>
              <p className="font-bold text-slate-200">{formData.cloudProvider}</p>
              <p className="text-[11px] text-slate-400">{formData.region.split(' ')[0]}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Activity size={13} className="text-amber-400" /> Telemetry Stack
              </span>
              <p className="font-bold text-slate-200">{formData.monitoringPlatform} · {formData.loggingPlatform}</p>
              <p className="text-[11px] text-slate-400">Routed to {formData.incidentTool}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/60 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Users size={13} className="text-emerald-400" /> Team Roster
              </span>
              <p className="font-bold text-slate-200">{formData.members?.length || 0} Teammates Invited</p>
              <p className="text-[11px] text-slate-400">Zero-Trust RBAC active</p>
            </div>
          </div>

          {/* AI Provider Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Cpu size={20} className="text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{formData.aiProvider} Neural Engine</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Active</span>
                </h4>
                <p className="text-[11px] text-slate-300">Sub-second RCA & automated runbook execution enabled.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Success Metrics Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="lg:col-span-5 glass-card p-6 space-y-6 border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-xl"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award size={16} className="text-amber-400" />
              <span>System Health Readiness</span>
            </h3>
            <p className="text-xs text-slate-400">All deployment verification checks passed.</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Workspace Ready', value: '100%', status: 'Ready', color: '#34D399', bg: 'rgba(52,211,153,0.1)' },
              { label: 'AI Connected', value: 'Groq LPU', status: 'Ready', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
              { label: 'Incident Engine', value: 'Active', status: 'Ready', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
              { label: 'Dashboard', value: 'Wired', status: 'Ready', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span className="font-semibold text-slate-300">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">{item.value}</span>
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                    style={{ background: item.bg, color: item.color }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
            <span>Estimated Setup Completion: <strong className="text-white">100%</strong></span>
          </div>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-slate-800/60"
          style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>

        <motion.button
          type="button"
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-xs font-extrabold transition-all"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            color: 'white',
            boxShadow: '0 4px 24px rgba(59, 130, 246, 0.45)',
          }}
        >
          <span>Launch Interactive Product Tour</span>
          <ArrowRight size={15} />
        </motion.button>
      </div>
    </div>
  );
}
