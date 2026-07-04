'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Shield, Activity, Users, Check, AlertCircle, Building2 } from 'lucide-react';
import Link from 'next/link';

const socialProof = [
  { metric: '10×', label: 'Faster Resolution' },
  { metric: '99.99%', label: 'SLA Reliability' },
  { metric: 'SOC2', label: 'Type II Certified' },
];

export function SignupContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strengthScore = [hasMinLength, hasNumber, hasSymbol].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (strengthScore < 2) return;
    setIsLoading(true);
    // Simulate auth — Clerk / Supabase creation goes here
    await new Promise(r => setTimeout(r, 1200));
    // Save email to sessionStorage for verify page
    try {
      sessionStorage.setItem('pending_verify_email', email);
    } catch (err) {}
    window.location.href = '/verify-email';
  };

  return (
    <div
      className="min-h-screen flex relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Background orbs */}
      <div
        className="orb orb-blue"
        style={{ width: 600, height: 600, top: -200, left: -200, opacity: 0.08 }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 400, height: 400, bottom: -150, right: -100, opacity: 0.07 }}
      />

      {/* Left panel — branding & value prop */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative"
        style={{ borderRight: '1px solid var(--border-subtle)' }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg opacity-50" />

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-16 inline-flex">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                boxShadow: '0 0 24px rgba(59, 130, 246, 0.4)',
              }}
            >
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                AI Incident Commander
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Enterprise Platform</p>
            </div>
          </Link>

          {/* Hero text */}
          <div className="space-y-6">
            <h1
              className="text-5xl font-extrabold leading-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              Start resolving
              <br />
              incidents autonomously
              <br />
              <span className="gradient-text-blue">in under 3 minutes</span>
            </h1>
            <p
              className="text-lg leading-relaxed max-w-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              Join Fortune 500 engineering teams using neural inference and real-time telemetry correlation to eliminate downtime.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4 mt-12">
            {[
              { icon: Activity, title: 'Sub-second RCA', text: 'Groq LPU neural inference diagnoses root causes before paging on-call.' },
              { icon: Shield, title: 'Zero-Trust RBAC', text: 'Granular role-based access control with SOC2 Type II compliance.' },
              { icon: Users, title: 'Blameless Culture', text: 'Automated timeline reconstruction and blameless postmortem generation.' },
            ].map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3.5"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <Icon size={16} style={{ color: '#60A5FA' }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{title}</h4>
                  <p className="text-xs leading-relaxed mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative z-10 flex gap-8">
          {socialProof.map((s, i) => (
            <div key={i}>
              <p
                className="text-2xl font-extrabold"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em' }}
              >
                {s.metric}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right panel — signup form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md my-auto py-8"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' }}
            >
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              AI Incident Commander
            </span>
          </div>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
            >
              Create your account
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Already have a workspace?{' '}
              <Link href="/login" className="font-semibold transition-colors hover:underline" style={{ color: '#60A5FA' }}>
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Harshini Shree"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                required
              />
            </div>

            {/* Work Email */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Work Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="harshini@cloudnova.io"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                required
              />
            </div>

            {/* Company Name */}
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="CloudNova Technologies"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: 'var(--bg-overlay)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-2.5 pr-12 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--bg-overlay)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-default)'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1.5 h-1">
                    <div className="flex-1 rounded-full transition-all duration-300"
                      style={{ background: strengthScore >= 1 ? (strengthScore === 1 ? '#EF4444' : strengthScore === 2 ? '#F59E0B' : '#10B981') : 'rgba(148,163,184,0.1)' }} />
                    <div className="flex-1 rounded-full transition-all duration-300"
                      style={{ background: strengthScore >= 2 ? (strengthScore === 2 ? '#F59E0B' : '#10B981') : 'rgba(148,163,184,0.1)' }} />
                    <div className="flex-1 rounded-full transition-all duration-300"
                      style={{ background: strengthScore >= 3 ? '#10B981' : 'rgba(148,163,184,0.1)' }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Check size={10} className={hasMinLength ? 'text-emerald-400' : 'text-slate-600'} /> 8+ chars
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={10} className={hasNumber ? 'text-emerald-400' : 'text-slate-600'} /> Number
                    </span>
                    <span className="flex items-center gap-1">
                      <Check size={10} className={hasSymbol ? 'text-emerald-400' : 'text-slate-600'} /> Symbol
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading || (password.length > 0 && strengthScore < 2)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold mt-4 transition-all disabled:opacity-50 disabled:pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.35)',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                    <path d="M14 8a6 6 0 0 0-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Creating account…
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or join with</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* SSO button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/[0.05]"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <Shield size={16} className="text-blue-400" />
            Sign up with Okta / SAML SSO
          </button>

          <p className="text-center text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
            By creating an account, you agree to our{' '}
            <span className="cursor-pointer" style={{ color: '#60A5FA' }}>Terms of Service</span>
            {' '}and{' '}
            <span className="cursor-pointer" style={{ color: '#60A5FA' }}>Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
