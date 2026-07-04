'use client';

import { motion } from 'framer-motion';
import { Sliders, Moon, Sun, Bell, Globe, DollarSign, Calendar, Sparkles, ArrowRight, ArrowLeft, Check, LayoutGrid } from 'lucide-react';
import { OnboardingFormData, DashboardDensity, NotificationPreference } from './onboarding-types';

interface StepPreferencesProps {
  formData: OnboardingFormData;
  updateForm: (updates: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DENSITIES: { id: DashboardDensity; label: string; desc: string }[] = [
  { id: 'compact', label: 'Compact', desc: 'High-density table rows · SRE War Room focus' },
  { id: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing & visual KPI hierarchy (Recommended)' },
  { id: 'expanded', label: 'Expanded', desc: 'Large charts & executive summary cards' },
];

const NOTIFICATIONS: { id: NotificationPreference; label: string; desc: string }[] = [
  { id: 'critical', label: 'Critical Only', desc: 'Instant PagerDuty & SMS alerts for SEV-1 / SEV-2' },
  { id: 'all', label: 'All Incidents', desc: 'Real-time feed notifications for all severity levels' },
  { id: 'daily', label: 'Daily Summary', desc: 'Digest email at 8:00 AM UTC with AI recommendations' },
];

const DATE_FORMATS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];
const CURRENCIES = ['USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'INR (₹)'];

export function StepPreferences({ formData, updateForm, onNext, onBack }: StepPreferencesProps) {
  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Personalize your Workspace
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          Configure interface density, notification thresholds, and AI automation behaviors.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Preferences Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dashboard Density */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <LayoutGrid size={14} className="text-blue-400" />
              <span>Dashboard Density</span>
            </h3>

            <div className="grid sm:grid-cols-3 gap-3">
              {DENSITIES.map(d => {
                const isSelected = formData.dashboardDensity === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => updateForm({ dashboardDensity: d.id })}
                    className="p-3.5 rounded-xl flex flex-col items-start gap-1 text-left transition-all border relative"
                    style={{
                      background: isSelected ? 'rgba(59,130,246,0.12)' : 'var(--bg-overlay)',
                      borderColor: isSelected ? 'rgba(59,130,246,0.4)' : 'var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                        {d.label}
                      </span>
                      {isSelected && <Check size={14} className="text-blue-400" />}
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {d.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme & Notifications */}
          <div className="glass-card p-5 space-y-5">
            {/* Theme */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Moon size={14} className="text-purple-400" />
                <span>Interface Theme</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  className="p-3 rounded-xl flex items-center justify-between border"
                  style={{ background: 'rgba(59,130,246,0.12)', borderColor: 'rgba(59,130,246,0.4)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Moon size={16} className="text-blue-400" />
                    <span className="text-xs font-bold text-white">Dark Enterprise (Active)</span>
                  </div>
                  <Check size={14} className="text-blue-400" />
                </button>

                <button
                  type="button"
                  disabled
                  className="p-3 rounded-xl flex items-center justify-between border opacity-50 cursor-not-allowed"
                  style={{ background: 'var(--bg-overlay)', borderColor: 'var(--border-subtle)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <Sun size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-300">Light Mode</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    Coming Soon
                  </span>
                </button>
              </div>
            </div>

            <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} />

            {/* Notifications */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Bell size={14} className="text-amber-400" />
                <span>Notification Thresholds</span>
              </h3>
              <div className="grid sm:grid-cols-3 gap-3">
                {NOTIFICATIONS.map(n => {
                  const isSelected = formData.notifications === n.id;
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => updateForm({ notifications: n.id })}
                      className="p-3 rounded-xl flex flex-col items-start gap-1 text-left transition-all border relative"
                      style={{
                        background: isSelected ? 'rgba(245,158,11,0.12)' : 'var(--bg-overlay)',
                        borderColor: isSelected ? 'rgba(245,158,11,0.4)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                          {n.label}
                        </span>
                        {isSelected && <Check size={14} className="text-amber-400" />}
                      </div>
                      <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {n.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Localization & AI Toggle */}
          <div className="glass-card p-5 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" /> Date Format
                </label>
                <select
                  value={formData.dateFormat}
                  onChange={e => updateForm({ dateFormat: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {DATE_FORMATS.map(f => <option key={f} value={f} style={{ background: '#0B1120' }}>{f}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <DollarSign size={13} className="text-slate-400" /> Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={e => updateForm({ currency: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-xs outline-none"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--border-default)', color: 'white' }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c} style={{ background: '#0B1120' }}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="h-px w-full" style={{ background: 'var(--border-subtle)' }} />

            {/* AI Recommendations Toggle */}
            <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={16} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Enable AI Recommendations</h4>
                  <p className="text-[11px] text-slate-400">
                    Automatically generate mitigation runbooks and root-cause summaries in the Command Center.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => updateForm({ aiRecommendations: !formData.aiRecommendations })}
                className="w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0"
                style={{
                  background: formData.aiRecommendations ? '#3B82F6' : 'var(--bg-muted)',
                }}
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-md"
                  animate={{ x: formData.aiRecommendations ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Summary Preview (4 cols) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="space-y-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace Profile
            </span>
            <p className="text-[11px] text-slate-400">
              Your personalized interface summary.
            </p>
          </div>

          <div className="glass-card p-5 space-y-4 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400">Density</span>
              <span className="font-bold text-white capitalize">{formData.dashboardDensity}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400">Theme</span>
              <span className="font-bold text-blue-400">Dark Enterprise</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400">Alerts</span>
              <span className="font-bold text-amber-400 capitalize">{formData.notifications}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-slate-400">AI Automation</span>
              <span className={`font-bold ${formData.aiRecommendations ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.aiRecommendations ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Currency / Date</span>
              <span className="font-semibold text-slate-300">{formData.currency.split(' ')[0]} · {formData.dateFormat}</span>
            </div>
          </div>
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
          <span>Review Summary</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
