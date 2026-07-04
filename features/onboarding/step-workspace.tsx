'use client';

import { motion } from 'framer-motion';
import { Server, Activity, Database, Cpu, ArrowRight, ArrowLeft, Shield, Sparkles, CheckCircle2, Lock, Terminal } from 'lucide-react';
import { OnboardingFormData, Environment } from './onboarding-types';

interface StepWorkspaceProps {
  formData: OnboardingFormData;
  updateForm: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ENVIRONMENTS: { id: Environment; label: string; badgeColor: string; desc: string }[] = [
  { id: 'production', label: 'Production', badgeColor: '#EF4444', desc: 'Live customer-facing systems & strict SLAs' },
  { id: 'staging', label: 'Staging', badgeColor: '#F59E0B', desc: 'Pre-release environment & QA integration' },
  { id: 'development', label: 'Development', badgeColor: '#10B981', desc: 'Sandbox & experimental AI pipelines' },
];

const INCIDENT_TOOLS = ['PagerDuty', 'Opsgenie', 'ServiceNow', 'Custom Webhooks'];
const MONITORING_TOOLS = ['Datadog', 'Grafana', 'Prometheus', 'New Relic'];
const LOGGING_TOOLS = ['Elastic (ELK)', 'Loki', 'Splunk', 'AWS CloudWatch'];

const AI_PROVIDERS = [
  {
    id: 'Groq',
    label: 'Groq LPU Engine',
    model: 'Llama-3-70b-versatile',
    speed: '800+ tokens/sec',
    status: 'active',
    badge: 'Preselected · Fast',
    color: '#3B82F6',
  },
  {
    id: 'Hindsight',
    label: 'Hindsight AI',
    model: 'Temporal Graph Engine',
    speed: 'Predictive Causal Analysis',
    status: 'soon',
    badge: 'Coming Soon',
    color: '#8B5CF6',
  },
  {
    id: 'cascadeflow',
    label: 'cascadeflow',
    model: 'Multi-Agent Remediation',
    speed: 'Autonomous Runbook Exec',
    status: 'soon',
    badge: 'Coming Soon',
    color: '#10B981',
  },
];

export function StepWorkspace({ formData, updateForm, onNext, onBack }: StepWorkspaceProps) {
  const defaultWsName = formData.orgName ? `${formData.orgName} Ops` : 'Production Ops';
  const currentWsName = formData.workspaceName || defaultWsName;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Configure your Engineering Workspace
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Connect your telemetry stack and select your neural inference engine for automated triage.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Workspace Name & Environment */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Workspace Scope
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Workspace Name
              </label>
              <input
                type="text"
                value={formData.workspaceName}
                onChange={e => updateForm({ workspaceName: e.target.value })}
                placeholder={defaultWsName}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
                style={{
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold block" style={{ color: 'var(--text-secondary)' }}>
                Target Environment
              </label>
              <div className="grid sm:grid-cols-3 gap-2.5">
                {ENVIRONMENTS.map(env => {
                  const isSelected = formData.environment === env.id;
                  return (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => updateForm({ environment: env.id })}
                      className="p-3 rounded-xl flex flex-col items-start gap-1 text-left transition-all border"
                      style={{
                        background: isSelected ? 'rgba(59,130,246,0.12)' : 'var(--bg-overlay)',
                        borderColor: isSelected ? 'rgba(59,130,246,0.4)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {env.label}
                        </span>
                        <div className="w-2 h-2 rounded-full" style={{ background: env.badgeColor }} />
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {env.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Telemetry Tool Stack */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Telemetry & Incident Integrations
            </h3>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Incident Management</label>
                <select
                  value={formData.incidentTool}
                  onChange={e => updateForm({ incidentTool: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {INCIDENT_TOOLS.map(t => <option key={t} value={t} style={{ background: '#0B1120' }}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Monitoring Platform</label>
                <select
                  value={formData.monitoringPlatform}
                  onChange={e => updateForm({ monitoringPlatform: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {MONITORING_TOOLS.map(t => <option key={t} value={t} style={{ background: '#0B1120' }}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Logging Platform</label>
                <select
                  value={formData.loggingPlatform}
                  onChange={e => updateForm({ loggingPlatform: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {LOGGING_TOOLS.map(t => <option key={t} value={t} style={{ background: '#0B1120' }}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* AI Provider Selection */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Neural Inference Engine
            </h3>

            <div className="space-y-2.5">
              {AI_PROVIDERS.map(ai => {
                const isSelected = formData.aiProvider === ai.id;
                const isSoon = ai.status === 'soon';
                return (
                  <button
                    key={ai.id}
                    type="button"
                    onClick={() => !isSoon && updateForm({ aiProvider: ai.id })}
                    disabled={isSoon}
                    className="w-full p-3.5 rounded-xl flex items-center justify-between gap-4 text-left transition-all border relative"
                    style={{
                      background: isSelected ? 'rgba(59,130,246,0.12)' : isSoon ? 'rgba(15,23,42,0.4)' : 'var(--bg-overlay)',
                      borderColor: isSelected ? 'rgba(59,130,246,0.4)' : isSoon ? 'var(--border-subtle)' : 'var(--border-default)',
                      opacity: isSoon ? 0.6 : 1,
                      cursor: isSoon ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${ai.color}18`, border: `1px solid ${ai.color}30` }}
                      >
                        <Cpu size={18} style={{ color: ai.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{ai.label}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              background: isSoon ? 'rgba(148,163,184,0.1)' : 'rgba(59,130,246,0.2)',
                              color: isSoon ? '#94A3B8' : '#60A5FA'
                            }}>
                            {ai.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{ai.model} · <span className="font-mono">{ai.speed}</span></p>
                      </div>
                    </div>

                    {!isSoon && isSelected && (
                      <CheckCircle2 size={18} className="text-blue-400 shrink-0" />
                    )}
                    {isSoon && (
                      <Lock size={15} className="text-slate-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Dashboard Preview Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="space-y-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Command Center Preview
            </span>
            <p className="text-[11px] text-slate-400">
              See how your telemetry tools map into your active war room dashboard.
            </p>
          </div>

          <motion.div
            layout
            className="glass-card p-6 space-y-5 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl"
          >
            {/* Top bar preview */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Terminal size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-white">{currentWsName}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
                  {formData.environment}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Telemetry Active</span>
              </div>
            </div>

            {/* Simulated telemetry routing */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Data Pipeline Routing
              </span>
              
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Activity size={13} className="text-purple-400" /> Monitoring
                  </span>
                  <span className="font-semibold text-white font-mono bg-purple-500/10 text-purple-300 px-2 py-0.5 rounded border border-purple-500/20">
                    {formData.monitoringPlatform}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Database size={13} className="text-amber-400" /> Log Ingestion
                  </span>
                  <span className="font-semibold text-white font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                    {formData.loggingPlatform}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Server size={13} className="text-blue-400" /> On-Call Routing
                  </span>
                  <span className="font-semibold text-white font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                    {formData.incidentTool}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated AI card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                  <Sparkles size={14} className="text-blue-400" />
                  <span>AI Engine Wired</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono">Sub-second RCA</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                All alerts from <strong className="text-white">{formData.monitoringPlatform}</strong> and <strong className="text-white">{formData.loggingPlatform}</strong> will be automatically analyzed by <strong className="text-blue-400">{formData.aiProvider}</strong> before notifying on-call engineers via <strong className="text-white">{formData.incidentTool}</strong>.
              </p>
            </div>
          </motion.div>
        </div>
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

        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
          }}
        >
          <span>Continue to Team Setup</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
