'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  glowColor?: string;
  className?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = '#3B82F6',
  trend,
  glowColor,
  className,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn('glass-card p-5 relative overflow-hidden', className)}
      style={glowColor ? { boxShadow: `0 0 24px ${glowColor}` } : undefined}
    >
      {/* Background glow orb */}
      {glowColor && (
        <div
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background: glowColor,
            filter: 'blur(24px)',
            opacity: 0.4,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            {title}
          </p>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
          >
            <Icon size={15} style={{ color: iconColor }} />
          </div>
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          <p className="metric-value" style={{ color: 'var(--text-primary)' }}>
            {value}
          </p>
        </motion.div>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {subtitle}
          </p>
        )}

        {/* Trend */}
        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <span
              className="text-xs font-semibold"
              style={{ color: trend.positive ? '#34D399' : '#EF4444' }}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
