'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Upload, Cloud, Globe, Clock, ArrowRight, ArrowLeft, Shield, CheckCircle2, Server, Award } from 'lucide-react';
import { OnboardingFormData, CloudProvider } from './onboarding-types';

interface StepOrganizationProps {
  formData: OnboardingFormData;
  updateForm: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDUSTRIES = [
  'Technology', 'Finance', 'Healthcare', 'Retail',
  'Education', 'Manufacturing', 'Government',
];

const SIZES = [
  '1–10', '11–50', '51–200', '201–1000', '1000+',
];

const CLOUD_PROVIDERS: { id: CloudProvider; label: string; iconColor: string; desc: string }[] = [
  { id: 'AWS', label: 'AWS', iconColor: '#F59E0B', desc: 'Amazon Web Services' },
  { id: 'Azure', label: 'Azure', iconColor: '#3B82F6', desc: 'Microsoft Azure' },
  { id: 'Google Cloud', label: 'Google Cloud', iconColor: '#EF4444', desc: 'Google Cloud Platform' },
  { id: 'Hybrid', label: 'Hybrid Cloud', iconColor: '#8B5CF6', desc: 'Multi-cloud & Edge' },
  { id: 'On-Premise', label: 'On-Premise', iconColor: '#10B981', desc: 'Private Datacenter' },
];

const REGIONS = [
  'US East (us-east-1)', 'US West (us-west-2)',
  'Europe (eu-west-1)', 'Asia Pacific (ap-southeast-1)',
  'India (ap-south-1)',
];

const TIMEZONES = [
  'UTC−8:00 (PST)', 'UTC−5:00 (EST)', 'UTC+0:00 (GMT)',
  'UTC+1:00 (CET)', 'UTC+5:30 (IST)', 'UTC+8:00 (SGT)', 'UTC+9:00 (JST)',
];

const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Hindi'];

export function StepOrganization({ formData, updateForm, onNext, onBack }: StepOrganizationProps) {
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleLogoClick = () => {
    // Simulate logo upload
    setLogoUploaded(true);
  };

  const isFormValid = formData.orgName.trim().length > 0;

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Create your Organization
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Define your company structure, cloud infrastructure, and operational baseline.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Org Name & Logo Upload */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Company Identity
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Logo Box */}
              <button
                type="button"
                onClick={handleLogoClick}
                className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center gap-1 shrink-0 border transition-all hover:scale-105 group"
                style={{
                  background: logoUploaded ? 'rgba(59,130,246,0.15)' : 'var(--bg-overlay)',
                  borderColor: logoUploaded ? 'rgba(59,130,246,0.4)' : 'var(--border-default)',
                }}
              >
                {logoUploaded ? (
                  <>
                    <Award size={20} className="text-blue-400" />
                    <span className="text-[9px] font-bold text-blue-300">Uploaded</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <span className="text-[9px] text-slate-400">Logo</span>
                  </>
                )}
              </button>

              {/* Org Name Input */}
              <div className="flex-1 w-full space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Organization Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={e => updateForm({ orgName: e.target.value })}
                  placeholder="e.g. CloudNova Technologies"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs outline-none transition-all"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                  required
                />
                <p className="text-[10px] text-slate-500">
                  This will be used for your workspace subdomain and automated notifications.
                </p>
              </div>
            </div>

            {/* Industry & Size */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={e => updateForm({ industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none transition-all cursor-pointer"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind} style={{ background: '#0B1120' }}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={e => updateForm({ companySize: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs outline-none transition-all cursor-pointer"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {SIZES.map(sz => (
                    <option key={sz} value={sz} style={{ background: '#0B1120' }}>{sz} employees</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Cloud Provider Selection */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Primary Cloud Provider
            </h3>
            <div className="grid sm:grid-cols-3 gap-2.5">
              {CLOUD_PROVIDERS.map(prov => {
                const isSelected = formData.cloudProvider === prov.id;
                return (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => updateForm({ cloudProvider: prov.id })}
                    className="p-3 rounded-xl flex flex-col items-start gap-1 text-left transition-all relative border"
                    style={{
                      background: isSelected ? 'rgba(59,130,246,0.12)' : 'var(--bg-overlay)',
                      borderColor: isSelected ? 'rgba(59,130,246,0.4)' : 'var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {prov.label}
                      </span>
                      <div className="w-2 h-2 rounded-full" style={{ background: prov.iconColor }} />
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {prov.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region, Timezone & Language */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Localization & Region
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Primary Region</label>
                <select
                  value={formData.region}
                  onChange={e => updateForm({ region: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {REGIONS.map(r => <option key={r} value={r} style={{ background: '#0B1120' }}>{r}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={e => updateForm({ timezone: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {TIMEZONES.map(t => <option key={t} value={t} style={{ background: '#0B1120' }}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">Language</label>
                <select
                  value={formData.language}
                  onChange={e => updateForm({ language: e.target.value })}
                  className="w-full px-2.5 py-2 rounded-lg text-[11px] outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {LANGUAGES.map(l => <option key={l} value={l} style={{ background: '#0B1120' }}>{l}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Organization Preview Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="space-y-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live Organization Preview
            </span>
            <p className="text-[11px] text-slate-400">
              This card reflects your real-time configuration as you type.
            </p>
          </div>

          <motion.div
            layout
            className="glass-card p-6 space-y-5 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl"
          >
            {/* Top decorative badge */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-inner"
                  style={{ background: 'linear-gradient(135deg, #3B82F6, #6366F1)' }}
                >
                  {formData.orgName ? formData.orgName.substring(0, 2).toUpperCase() : 'AI'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white truncate max-w-[180px]">
                    {formData.orgName || 'Your Organization'}
                  </h4>
                  <p className="text-[11px] text-blue-400 font-mono">
                    {formData.orgName
                      ? `${formData.orgName.toLowerCase().replace(/[^a-z0-9]/g, '')}.aiops.io`
                      : 'subdomain.aiops.io'}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>

            {/* Config summary pills */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">Industry</span>
                <span className="font-semibold text-slate-200">{formData.industry}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">Scale</span>
                <span className="font-semibold text-slate-200">{formData.companySize} seats</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">Cloud Baseline</span>
                <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Cloud size={13} className="text-blue-400" />
                  {formData.cloudProvider}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">Region</span>
                <span className="font-semibold text-slate-200 truncate block">
                  {formData.region.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* AI Security status */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-center gap-3">
              <Shield size={18} className="text-blue-400 shrink-0" />
              <div className="text-[11px]">
                <p className="font-semibold text-blue-200">Enterprise Tenant Isolation</p>
                <p className="text-slate-400">SOC2 compliant encryption enabled for {formData.region.split(' ')[0]}.</p>
              </div>
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
          disabled={!isFormValid}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-40 disabled:pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
          }}
        >
          <span>Continue to Workspace</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
