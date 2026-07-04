'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, ArrowRight, CheckCircle2, RefreshCw, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function VerifyEmailContent() {
  const [email, setEmail] = useState('harshini@cloudnova.io');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('pending_verify_email');
      if (saved) setEmail(saved);
    } catch (e) {}
  }, []);

  useEffect(() => {
    inputRefs.current[activeIdx]?.focus();
  }, [activeIdx]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];
      if (otp[idx]) {
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        newOtp[idx - 1] = '';
        setOtp(newOtp);
        setActiveIdx(idx - 1);
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      setActiveIdx(idx - 1);
    } else if (e.key === 'ArrowRight' && idx < 5) {
      setActiveIdx(idx + 1);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) return;

    const newOtp = [...otp];
    if (val.length === 1) {
      newOtp[idx] = val;
      setOtp(newOtp);
      if (idx < 5) setActiveIdx(idx + 1);
    } else if (val.length > 1) {
      // Paste handling
      const pasted = val.slice(0, 6).split('');
      pasted.forEach((char, i) => {
        if (idx + i < 6) newOtp[idx + i] = char;
      });
      setOtp(newOtp);
      setActiveIdx(Math.min(idx + pasted.length, 5));
    }
    setError('');
  };

  const handleResend = async () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);
    await new Promise(r => setTimeout(r, 1000));
    setTimer(45);
    setIsResending(false);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    window.location.href = '/onboarding';
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Ambient background orbs */}
      <div
        className="orb orb-blue"
        style={{ width: 500, height: 500, top: -150, left: '20%', opacity: 0.1 }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 400, height: 400, bottom: -100, right: '20%', opacity: 0.08 }}
      />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Main verification card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 sm:p-10 rounded-3xl glass-card space-y-8 relative z-10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl"
      >
        {/* Top Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)',
                boxShadow: '0 0 24px rgba(59, 130, 246, 0.4)',
              }}
            >
              <Zap size={20} className="text-white" />
            </div>
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
            <Mail size={28} />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Verify your email address
            </h1>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              We&apos;ve sent a 6-digit verification code to <strong className="text-white font-mono">{email}</strong>.
            </p>
          </div>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* 6 Digit Box Grid */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                onFocus={() => setActiveIdx(idx)}
                className="w-12 h-14 sm:w-13 sm:h-16 text-center text-xl font-extrabold font-mono rounded-2xl outline-none transition-all shadow-inner"
                style={{
                  background: 'var(--bg-overlay)',
                  border: `2px solid ${activeIdx === idx ? '#3B82F6' : digit ? 'rgba(59,130,246,0.3)' : 'var(--border-default)'}`,
                  color: 'white',
                  boxShadow: activeIdx === idx ? '0 0 16px rgba(59,130,246,0.25)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Submit CTA */}
          <motion.button
            type="submit"
            disabled={isLoading || otp.join('').length < 6}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:pointer-events-none shadow-lg"
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
                <span>Verifying security token…</span>
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        {/* Resend Code Footer */}
        <div className="pt-4 border-t border-slate-800 flex flex-col items-center justify-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>Didn&apos;t receive the email?</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: timer > 0 ? 'var(--text-muted)' : '#60A5FA' }}
            >
              <RefreshCw size={12} className={isResending ? 'animate-spin' : ''} />
              <span>
                {isResending ? 'Sending…' : timer > 0 ? `Resend in 0:${timer < 10 ? `0${timer}` : timer}` : 'Resend Code'}
              </span>
            </button>
          </div>

          <Link
            href="/signup"
            className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5 text-[11px]"
          >
            <ArrowLeft size={12} />
            <span>Use a different work email</span>
          </Link>
        </div>

        {/* Security badge */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>256-bit SOC2 Type II Encrypted Session</span>
        </div>
      </motion.div>
    </div>
  );
}
