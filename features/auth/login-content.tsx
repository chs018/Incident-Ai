'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Shield, Activity, Users } from 'lucide-react';
import Link from 'next/link';

const socialProof = [
  { metric: '99.9%', label: 'Uptime SLA' },
  { metric: '<3m', label: 'Avg MTTD' },
  { metric: '500+', label: 'Enterprise Teams' },
];

export function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('harshini@cloudnova.io');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth — Clerk integration goes here
    await new Promise(r => setTimeout(r, 1200));
    window.location.href = '/dashboard';
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

      {/* Left panel — branding */}
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
          <div className="flex items-center gap-3 mb-16">
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
          </div>

          {/* Hero text */}
          <div className="space-y-6">
            <h1
              className="text-5xl font-extrabold leading-tight"
              style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
            >
              Resolve incidents
              <br />
              <span className="gradient-text-blue">10× faster</span>
              <br />
              with AI
            </h1>
            <p
              className="text-lg leading-relaxed max-w-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              AI-powered incident analysis, intelligent triage, and automated recovery — purpose-built for SRE and Platform Engineering teams.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4 mt-12">
            {[
              { icon: Activity, text: 'Real-time incident detection and AI-powered root cause analysis' },
              { icon: Shield, text: 'Blameless postmortem generation and knowledge preservation' },
              { icon: Users, text: 'Intelligent on-call routing and team coordination' },
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.2)' }}
                >
                  <Icon size={14} style={{ color: '#60A5FA' }} />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {text}
                </p>
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

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
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

          <h2
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Welcome back
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            Sign in to your workspace to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-xs font-semibold mb-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="harshini@cloudnova.io"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
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
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs transition-colors"
                  style={{ color: '#60A5FA' }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
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
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold mt-2 transition-all disabled:opacity-70"
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
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-subtle)' }} />
          </div>

          {/* SSO button */}
          <button
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/[0.05]"
            style={{
              background: 'var(--bg-overlay)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)',
            }}
          >
            <Shield size={16} />
            Sign in with SSO
          </button>

          <p className="text-center text-xs mt-8" style={{ color: 'var(--text-muted)' }}>
            By signing in, you agree to our{' '}
            <span className="cursor-pointer" style={{ color: '#60A5FA' }}>Terms of Service</span>
            {' '}and{' '}
            <span className="cursor-pointer" style={{ color: '#60A5FA' }}>Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
