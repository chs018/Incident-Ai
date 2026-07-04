'use client';

import { motion } from 'framer-motion';
import { LucideIcon, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  features: string[];
  integrationNote?: string;
}

export function PlaceholderPage({
  icon: Icon,
  title,
  subtitle,
  description,
  accentColor,
  features,
  integrationNote,
}: PlaceholderPageProps) {
  return (
    <div className="p-6 max-w-[800px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-10 text-center relative overflow-hidden mt-8"
      >
        {/* Background orbs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: accentColor, filter: 'blur(80px)', opacity: 0.08 }}
        />

        {/* Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 relative"
          style={{
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}30`,
          }}
        >
          <Icon size={36} style={{ color: accentColor }} />
          <Sparkles
            size={14}
            className="absolute -top-2 -right-2"
            style={{ color: accentColor, opacity: 0.8 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
              border: `1px solid ${accentColor}30`,
            }}
          >
            {subtitle}
          </span>

          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            {title}
          </h1>

          <p
            className="text-base leading-relaxed max-w-lg mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        </motion.div>

        {/* Feature list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-left space-y-3 max-w-md mx-auto"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.06 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0"
                style={{ color: accentColor }}
              />
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {feature}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Integration note */}
        {integrationNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 px-4 py-3 rounded-lg text-sm"
            style={{
              background: 'rgba(148, 163, 184, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            🔌 {integrationNote}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
