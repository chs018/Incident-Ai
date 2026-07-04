'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle, Flame, CheckCircle2, Clock,
  Brain, Database, DollarSign, TrendingUp,
  BellRing, Zap,
  LucideIcon,
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { dashboardMetrics } from '@/lib/mock-data/incidents';
import { kpiSparklines, budgetData } from '@/lib/mock-data/dashboard';

// ─── Inline Mini Sparkline ────────────────────────────────────

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const last = pts[pts.length - 1].split(',');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <polygon
        points={`0,${h} ${polyline} ${w},${h}`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last dot */}
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────

interface KPICardProps {
  title: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  subtitle: string;
  trend: number;
  trendPositive: boolean;
  sparkline: number[];
  icon: LucideIcon;
  iconColor: string;
  glowColor?: string;
  delay?: number;
  isComing?: boolean;
}

function KPICard({
  title, value, decimals = 0, prefix = '', suffix = '',
  subtitle, trend, trendPositive, sparkline,
  icon: Icon, iconColor, glowColor, delay = 0, isComing = false,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card p-5 relative overflow-hidden cursor-default"
      style={glowColor ? { boxShadow: `0 0 28px ${glowColor}` } : undefined}
    >
      {/* Background accent orb */}
      {glowColor && (
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: glowColor, filter: 'blur(28px)', opacity: 0.35 }}
        />
      )}

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {title}
            </p>
            {isComing ? (
              <span
                className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                coming soon
              </span>
            ) : null}
          </div>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
            style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}28` }}
          >
            <Icon size={15} style={{ color: iconColor }} />
          </div>
        </div>

        {/* Value */}
        <div className="mb-1">
          <span
            className="font-extrabold"
            style={{ fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}
          >
            {isComing ? (
              <span style={{ color: 'var(--text-muted)' }}>—</span>
            ) : (
              <AnimatedCounter
                target={value}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                duration={1000}
              />
            )}
          </span>
        </div>

        {/* Subtitle + trend */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
          {!isComing && (
            <span
              className="text-[10px] font-bold flex items-center gap-0.5"
              style={{ color: trendPositive ? '#34D399' : '#EF4444' }}
            >
              {trendPositive ? '↑' : '↓'}{Math.abs(trend)}%
            </span>
          )}
        </div>

        {/* Sparkline */}
        {!isComing && (
          <MiniSparkline data={sparkline} color={iconColor} />
        )}
      </div>
    </motion.div>
  );
}

// ─── KPI Grid ─────────────────────────────────────────────────

export function KPICards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <KPICard
        title="Active Incidents"
        value={dashboardMetrics.activeIncidents}
        subtitle={`${dashboardMetrics.p0Count} critical · ${dashboardMetrics.p1Count} high`}
        trend={-12} trendPositive={true}
        sparkline={kpiSparklines.activeIncidents}
        icon={AlertTriangle} iconColor="#EF4444"
        glowColor="rgba(239,68,68,0.06)"
        delay={0.05}
      />
      <KPICard
        title="Critical P0/P1"
        value={dashboardMetrics.p0Count + dashboardMetrics.p1Count}
        subtitle="Requires immediate action"
        trend={-8} trendPositive={true}
        sparkline={kpiSparklines.criticalIncidents}
        icon={Flame} iconColor="#F97316"
        delay={0.1}
      />
      <KPICard
        title="Resolved Today"
        value={dashboardMetrics.resolvedThisWeek}
        subtitle="Avg MTTR 106 min"
        trend={24} trendPositive={true}
        sparkline={kpiSparklines.resolvedToday}
        icon={CheckCircle2} iconColor="#10B981"
        glowColor="rgba(16,185,129,0.05)"
        delay={0.15}
      />
      <KPICard
        title="Open Alerts"
        value={dashboardMetrics.activeIncidents + 7}
        subtitle="Across all services"
        trend={5} trendPositive={false}
        sparkline={[4, 7, 5, 9, 8, 11, 10, 13, 11, 10]}
        icon={BellRing} iconColor="#06B6D4"
        delay={0.18}
      />
      <KPICard
        title="Avg MTTR"
        value={dashboardMetrics.mttr}
        suffix=" min"
        subtitle="Mean time to resolve"
        trend={18} trendPositive={true}
        sparkline={kpiSparklines.mttr}
        icon={Clock} iconColor="#F59E0B"
        delay={0.2}
      />
      <KPICard
        title="AI Accuracy"
        value={96}
        suffix="%"
        subtitle="Root cause confidence avg"
        trend={3} trendPositive={true}
        sparkline={kpiSparklines.aiAccuracy}
        icon={Brain} iconColor="#8B5CF6"
        delay={0.25}
      />
      <KPICard
        title="Memory Hit Rate"
        value={0}
        subtitle="Powered by Hindsight"
        trend={0} trendPositive={true}
        sparkline={[0, 0, 0, 0, 0, 0, 0]}
        icon={Database} iconColor="#06B6D4"
        delay={0.3}
        isComing
      />
      <KPICard
        title="Model Routing Eff."
        value={0}
        subtitle="Powered by cascadeflow"
        trend={0} trendPositive={true}
        sparkline={[0, 0, 0, 0, 0, 0, 0]}
        icon={Zap} iconColor="#F59E0B"
        delay={0.32}
        isComing
      />
      <KPICard
        title="AI Budget Used"
        value={budgetData.monthlySpend}
        decimals={0}
        prefix="$"
        subtitle={`of $${budgetData.monthlyBudget.toLocaleString()} monthly`}
        trend={14} trendPositive={false}
        sparkline={kpiSparklines.aiBudget}
        icon={DollarSign} iconColor="#A78BFA"
        delay={0.35}
      />
      <KPICard
        title="Today's AI Cost"
        value={budgetData.todaySpend}
        decimals={2}
        prefix="$"
        subtitle={`${budgetData.requestsToday.toLocaleString()} requests`}
        trend={12} trendPositive={false}
        sparkline={kpiSparklines.todayCost}
        icon={TrendingUp} iconColor="#3B82F6"
        delay={0.4}
      />
    </div>
  );
}
