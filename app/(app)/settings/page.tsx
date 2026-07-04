import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Settings' };

export default function SettingsPage() {
  const sections = [
    { title: 'General', desc: 'Organization name, timezone, and display preferences' },
    { title: 'Notifications', desc: 'Alert channels, escalation thresholds, and quiet hours' },
    { title: 'AI Configuration', desc: 'Model preferences, token budgets, and analysis thresholds' },
    { title: 'Security', desc: 'SSO, MFA, audit logs, and API key management' },
    { title: 'Billing', desc: 'Subscription plan, usage, and payment methods' },
  ];

  return (
    <div className="p-6 max-w-[800px] mx-auto space-y-3">
      <h1 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Settings</h1>
      {sections.map((s, i) => (
        <div key={i} className="glass-card px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{s.title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-muted)' }}>
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      ))}
    </div>
  );
}
