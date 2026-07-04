'use client';

/**
 * Charts Section — Dashboard Extension
 * Six Recharts-powered charts displaying 30-day operational trends.
 * All data is mock. Replace data[] props with TanStack Query hooks when backend is ready.
 */

import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, BarChart2, Activity, Cpu, Brain, Calendar, DollarSign } from 'lucide-react';

// ─── Shared tooltip style ──────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--border-default)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
    fontSize: '11px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
    padding: '8px 12px',
    backdropFilter: 'blur(12px)',
  },
  itemStyle: { color: '#94A3B8' },
  labelStyle: { color: '#F1F5F9', fontWeight: 600, marginBottom: 4 },
  cursor: { stroke: 'rgba(148,163,184,0.06)', strokeWidth: 20 },
};

// ─── Generate 30-day date labels ──────────────────────────────

function gen30Days() {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return days;
}

const DAYS = gen30Days();

// ─── Mock Data Generators ─────────────────────────────────────

function seeded(seed: number, min: number, max: number) {
  const r = Math.sin(seed * 9301 + 49297) * 233280;
  const frac = r - Math.floor(r);
  return Math.round(min + frac * (max - min));
}

const incidentTrendData = DAYS.map((date, i) => ({
  date,
  critical: seeded(i, 0, 3),
  high: seeded(i + 10, 1, 6),
  medium: seeded(i + 20, 2, 8),
  total: seeded(i, 3, 17),
}));

const mttrTrendData = DAYS.map((date, i) => ({
  date,
  mttr: seeded(i + 5, 60, 240),
  target: 120,
}));

const distributionData = [
  { name: 'Critical', value: 14, color: '#EF4444' },
  { name: 'High', value: 31, color: '#F97316' },
  { name: 'Medium', value: 48, color: '#F59E0B' },
  { name: 'Low', value: 23, color: '#10B981' },
];

const serviceHealthData = DAYS.slice(-14).map((date, i) => ({
  date,
  'payment-api': seeded(i + 1, 82, 100),
  'auth-service': seeded(i + 11, 95, 100),
  'analytics-db': seeded(i + 21, 70, 99),
}));

const aiUsageData = DAYS.slice(-14).map((date, i) => ({
  date,
  requests: seeded(i + 3, 80, 350),
  tokens: seeded(i + 7, 50000, 200000),
}));

const dailyVolumeData = DAYS.slice(-7).map((date, i) => ({
  date,
  opened: seeded(i + 4, 3, 12),
  resolved: seeded(i + 14, 2, 11),
}));

const costTrendData = DAYS.map((date, i) => ({
  date,
  spend: parseFloat((seeded(i + 8, 28, 85) + seeded(i, 0, 15) * 0.1).toFixed(2)),
  budget: 66.67, // $2000/month / 30 days
}));

// ─── Chart Card Wrapper ───────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  delay,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
          style={{ background: `${iconColor}14`, border: `1px solid ${iconColor}22` }}
        >
          <Icon size={13} style={{ color: iconColor }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{title}</p>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={tooltipStyle.contentStyle}>
      <p style={tooltipStyle.labelStyle}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: '#94A3B8' }}>{p.name ?? p.dataKey}: </span>
          <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Charts Section ───────────────────────────────────────────

export function ChartsSection() {
  return (
    <div className="space-y-4">
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            Operational Analytics
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            30-day trend data · auto-refreshed every 5 minutes
          </p>
        </div>
        <div className="flex gap-2">
          {(['7d', '14d', '30d'] as const).map((p, i) => (
            <button
              key={p}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all"
              style={i === 2
                ? { background: 'rgba(59,130,246,0.15)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }
                : { background: 'var(--bg-overlay)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Row 1: Incident Trend (wide) + Distribution (narrow) */}
      <div className="grid xl:grid-cols-3 gap-4">
        {/* Incident Trend — 30 days stacked area */}
        <div className="xl:col-span-2">
          <ChartCard
            title="Incident Trend"
            subtitle="Last 30 days · by severity"
            icon={TrendingUp}
            iconColor="#3B82F6"
            delay={0.25}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={incidentTrendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  {[
                    { id: 'critical', color: '#EF4444' },
                    { id: 'high', color: '#F97316' },
                    { id: 'medium', color: '#F59E0B' },
                  ].map(({ id, color }) => (
                    <linearGradient key={id} id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#475569', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="critical" name="Critical" stroke="#EF4444" strokeWidth={1.5} fill="url(#g-critical)" />
                <Area type="monotone" dataKey="high" name="High" stroke="#F97316" strokeWidth={1.5} fill="url(#g-high)" />
                <Area type="monotone" dataKey="medium" name="Medium" stroke="#F59E0B" strokeWidth={1.5} fill="url(#g-medium)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Distribution Pie */}
        <ChartCard
          title="Incident Distribution"
          subtitle="By severity · last 30 days"
          icon={BarChart2}
          iconColor="#8B5CF6"
          delay={0.3}
        >
          <div className="flex items-center justify-between gap-4">
            <ResponsiveContainer width="50%" height={160}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {distributionData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2">
              {distributionData.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                  <div>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{name}</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: MTTR + Service Health Uptime */}
      <div className="grid xl:grid-cols-2 gap-4">
        {/* MTTR Trend */}
        <ChartCard
          title="Mean Time To Resolve"
          subtitle="Minutes · 30-day trend with 120m target"
          icon={Activity}
          iconColor="#10B981"
          delay={0.35}
        >
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={mttrTrendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="mttr" name="Actual MTTR" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="target" name="Target" stroke="#3B82F6" strokeWidth={1} strokeDasharray="5 5" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Service Health Uptime */}
        <ChartCard
          title="Service Uptime"
          subtitle="% availability · last 14 days"
          icon={Cpu}
          iconColor="#F59E0B"
          delay={0.4}
        >
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={serviceHealthData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis domain={[60, 100]} tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="payment-api" stroke="#EF4444" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="auth-service" stroke="#10B981" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="analytics-db" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: AI Usage + Daily Volume */}
      <div className="grid xl:grid-cols-2 gap-4">
        {/* AI Request Volume */}
        <ChartCard
          title="AI Requests"
          subtitle="Daily Groq API calls · last 14 days"
          icon={Brain}
          iconColor="#8B5CF6"
          delay={0.45}
        >
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={aiUsageData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="requests" name="Requests" fill="#8B5CF6" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily Incident Volume */}
        <ChartCard
          title="Daily Incident Volume"
          subtitle="Opened vs resolved · last 7 days"
          icon={Calendar}
          iconColor="#06B6D4"
          delay={0.5}
        >
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyVolumeData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="opened" name="Opened" fill="#EF4444" radius={[3, 3, 0, 0]} opacity={0.75} />
              <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[3, 3, 0, 0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 4: AI Cost Trend (full width) */}
      <ChartCard
        title="AI Cost Trend"
        subtitle="Daily spend ($) vs daily budget cap · last 30 days"
        icon={DollarSign}
        iconColor="#A78BFA"
        delay={0.55}
      >
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={costTrendData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
            <defs>
              <linearGradient id="g-cost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.05)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} axisLine={false}
              tickFormatter={(v) => `$${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="spend" name="Daily Spend" stroke="#A78BFA" strokeWidth={2} fill="url(#g-cost)" />
            <Line type="monotone" dataKey="budget" name="Daily Budget" stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
