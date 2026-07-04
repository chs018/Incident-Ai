'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Cpu,
  ShieldCheck,
  Activity,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Download,
  Sparkles,
  Zap,
  Users,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Check,
  Layers,
  FileText,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

// ─── Custom Tooltip for Recharts ─────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="p-3 rounded-xl glass-card border shadow-xl text-xs space-y-1.5 z-50"
        style={{ borderColor: 'var(--border-default)', background: 'var(--glass-bg)' }}
      >
        <p className="font-bold border-b pb-1" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)' }}>
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 font-mono">
            <span className="flex items-center gap-1.5 font-sans font-medium" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Mock Data Generators ───────────────────────────────────────────────────
const getTimeSeriesData = (range: string) => {
  if (range === '24h') {
    return [
      { time: '00:00', humanMttr: 38, aiMttr: 18, incidents: 12 },
      { time: '04:00', humanMttr: 35, aiMttr: 14, incidents: 8 },
      { time: '08:00', humanMttr: 42, aiMttr: 16, incidents: 24 },
      { time: '12:00', humanMttr: 48, aiMttr: 19, incidents: 38 },
      { time: '16:00', humanMttr: 40, aiMttr: 15, incidents: 30 },
      { time: '20:00', humanMttr: 36, aiMttr: 12, incidents: 18 },
    ];
  } else if (range === '7d') {
    return [
      { time: 'Mon', humanMttr: 40, aiMttr: 18, incidents: 45 },
      { time: 'Tue', humanMttr: 42, aiMttr: 16, incidents: 52 },
      { time: 'Wed', humanMttr: 38, aiMttr: 15, incidents: 48 },
      { time: 'Thu', humanMttr: 45, aiMttr: 19, incidents: 60 },
      { time: 'Fri', humanMttr: 39, aiMttr: 14, incidents: 55 },
      { time: 'Sat', humanMttr: 34, aiMttr: 11, incidents: 28 },
      { time: 'Sun', humanMttr: 32, aiMttr: 10, incidents: 22 },
    ];
  } else {
    // 30d or Quarterly
    return [
      { time: 'Week 1', humanMttr: 45, aiMttr: 22, incidents: 320 },
      { time: 'Week 2', humanMttr: 42, aiMttr: 18, incidents: 290 },
      { time: 'Week 3', humanMttr: 38, aiMttr: 15, incidents: 310 },
      { time: 'Week 4', humanMttr: 36, aiMttr: 12, incidents: 280 },
      { time: 'Week 5', humanMttr: 35, aiMttr: 11, incidents: 228 },
    ];
  }
};

const SEVERITY_DATA = [
  { name: 'P0 - Critical', value: 114, color: '#EF4444' },
  { name: 'P1 - High', value: 312, color: '#F59E0B' },
  { name: 'P2 - Medium', value: 642, color: '#3B82F6' },
  { name: 'P3 - Low', value: 360, color: '#10B981' },
];

const SERVICE_DATA = [
  { service: 'Payment API', total: 320, autoResolved: 260, mttr: 10 },
  { service: 'Auth Gateway', total: 280, autoResolved: 240, mttr: 8 },
  { service: 'Postgres DB', total: 210, autoResolved: 150, mttr: 18 },
  { service: 'Redis Cluster', total: 190, autoResolved: 170, mttr: 6 },
  { service: 'K8s Mesh', total: 240, autoResolved: 210, mttr: 12 },
  { service: 'Search Engine', total: 188, autoResolved: 140, mttr: 15 },
];

const TEAM_LEADERBOARD = [
  {
    id: 'u1',
    name: 'Sarah Chen',
    role: 'Principal SRE · Incident Commander',
    incidents: 142,
    aiScore: 99.4,
    avgMttr: '8m 12s',
    status: 'Active On-Call',
    statusColor: '#10B981',
    avatar: 'SC',
    color: '#3B82F6',
  },
  {
    id: 'u2',
    name: 'Alex Rivera',
    role: 'Senior DevOps Engineer',
    incidents: 118,
    aiScore: 96.8,
    avgMttr: '11m 05s',
    status: 'Active On-Call',
    statusColor: '#10B981',
    avatar: 'AR',
    color: '#8B5CF6',
  },
  {
    id: 'u3',
    name: 'Marcus Brody',
    role: 'Database SRE Specialist',
    incidents: 94,
    aiScore: 94.2,
    avgMttr: '14m 40s',
    status: 'Off-Duty',
    statusColor: '#64748B',
    avatar: 'MB',
    color: '#F59E0B',
  },
  {
    id: 'u4',
    name: 'Elena Rostova',
    role: 'Cloud Infrastructure Lead',
    incidents: 106,
    aiScore: 98.1,
    avgMttr: '9m 18s',
    status: 'Backup Lead',
    statusColor: '#06B6D4',
    avatar: 'ER',
    color: '#10B981',
  },
  {
    id: 'u5',
    name: 'David Kim',
    role: 'Security Operations Engineer',
    incidents: 88,
    aiScore: 95.0,
    avgMttr: '12m 30s',
    status: 'Off-Duty',
    statusColor: '#64748B',
    avatar: 'DK',
    color: '#EC4899',
  },
];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'quarter'>('30d');
  const [isMounted, setIsMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = getTimeSeriesData(timeRange);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    }, 1200);
  };

  if (!isMounted) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-20 glass-card rounded-2xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 glass-card rounded-2xl w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-80 glass-card rounded-2xl w-full" />
          <div className="lg:col-span-4 h-80 glass-card rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner & Control Header */}
      <div className="p-6 rounded-2xl glass-card shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <Sparkles size={11} />
              <span>Executive SRE Intelligence</span>
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              SOC2 & ISO27001 Verified Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Enterprise Incident Analytics & ROI Dashboard
          </h1>
          <p className="text-xs sm:text-sm mt-1.5 max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Real-time telemetry measuring Mean Time To Resolve (MTTR) reduction, SLA compliance velocity, and autonomous AI remediation efficiency across all infrastructure tiers.
          </p>
        </div>

        {/* Controls: Time Range & Export */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center p-1 rounded-xl bg-slate-900/60 border border-slate-800">
            {[
              { id: '24h', label: '24h' },
              { id: '7d', label: '7d' },
              { id: '30d', label: '30d' },
              { id: 'quarter', label: 'Quarterly' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeRange(tab.id as any)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: timeRange === tab.id ? 'var(--primary-glow)' : 'transparent',
                  color: timeRange === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: timeRange === tab.id ? '1px solid var(--primary-500)' : '1px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer"
            style={{
              background: isExporting ? 'rgba(100, 116, 139, 0.3)' : 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
              color: '#ffffff',
            }}
          >
            {isExporting ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Compiling SOC2 Report...</span>
              </>
            ) : exportSuccess ? (
              <>
                <Check size={14} className="text-emerald-300" />
                <span>Report Exported!</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export Audit Report</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Mean Time To Resolve (MTTR)',
            value: '11m 42s',
            change: '-42.8%',
            isPositive: true,
            sub: 'Target: < 15m · Saved 184 hrs',
            icon: Clock,
            color: '#06B6D4',
          },
          {
            title: 'SLA Compliance Rate',
            value: '99.92%',
            change: '+0.14%',
            isPositive: true,
            sub: 'Zero P0 SLA breaches this month',
            icon: ShieldCheck,
            color: '#10B981',
          },
          {
            title: 'AI Auto-Remediation Rate',
            value: '84.2%',
            change: '+14.5%',
            isPositive: true,
            sub: '1,204 incidents resolved zero-touch',
            icon: Zap,
            color: '#8B5CF6',
          },
          {
            title: 'Total Outage Cost Avoided',
            value: '$428,500',
            change: '+$95,200',
            isPositive: true,
            sub: 'Calculated via Groq LPU routing SLA',
            icon: DollarSign,
            color: '#3B82F6',
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="p-5 rounded-2xl glass-card shadow-xl flex flex-col justify-between border border-slate-800/40"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {kpi.title}
                  </span>
                  <div
                    className="p-2 rounded-xl"
                    style={{ background: `${kpi.color}15`, color: kpi.color, border: `1px solid ${kpi.color}30` }}
                  >
                    <Icon size={18} />
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                    {kpi.value}
                  </span>
                  <span
                    className="text-xs font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5"
                    style={{
                      background: kpi.isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: kpi.isPositive ? '#10B981' : '#EF4444',
                    }}
                  >
                    {kpi.isPositive ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                    <span>{kpi.change}</span>
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span style={{ color: 'var(--text-muted)' }}>{kpi.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Row 1: MTTR Trend Chart vs Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: MTTR Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl glass-card shadow-xl border border-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#06B6D4' }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                    Resolution Velocity
                  </span>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  MTTR Trend: Human-Only vs. AI CascadeFlow (Minutes)
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Illustrates the dramatic drop in resolution time upon enabling LPU-powered automated root-cause analysis.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded" style={{ background: '#EF4444' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Human-Only MTTR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded" style={{ background: '#06B6D4' }} />
                  <span style={{ color: 'var(--text-primary)' }}>AI CascadeFlow MTTR</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.5} />
                  <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit="m" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="humanMttr"
                    name="Human-Only MTTR (mins)"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorHuman)"
                  />
                  <Area
                    type="monotone"
                    dataKey="aiMttr"
                    name="AI CascadeFlow MTTR (mins)"
                    stroke="#06B6D4"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAi)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <TrendingDown size={14} />
              <span>68.4% Average Speedup across all services</span>
            </span>
            <span className="font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
              SLA Compliance Threshold: 15.0 mins
            </span>
          </div>
        </div>

        {/* Right: Severity Distribution Donut Chart (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl glass-card shadow-xl border border-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#8B5CF6' }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-purple-400">
                    Incident Triage
                  </span>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Incidents by Severity
                </h3>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                1,428 Total
              </span>
            </div>

            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={SEVERITY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {SEVERITY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
                  1,428
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Incidents
                </span>
              </div>
            </div>

            {/* Severity Legend Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {SEVERITY_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border bg-slate-900/40 border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                    <span className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {item.name.split(' - ')[0]}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-extrabold" style={{ color: item.color }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span style={{ color: 'var(--text-muted)' }}>P0 Resolution Target: &lt; 5m</span>
            <span className="font-bold text-emerald-400">100% SLA Met</span>
          </div>
        </div>
      </div>

      {/* Row 2: Microservice Remediation Performance vs Team Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Microservice Remediation Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-card shadow-xl border border-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#3B82F6' }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    Service Reliability
                  </span>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Incidents &amp; Auto-Remediation by Microservice
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Total incident volume compared against AI CascadeFlow zero-touch resolution rate.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded" style={{ background: '#3B82F6' }} />
                  <span style={{ color: 'var(--text-muted)' }}>Total Incidents</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded" style={{ background: '#10B981' }} />
                  <span style={{ color: 'var(--text-primary)' }}>Auto-Resolved</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SERVICE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.5} />
                  <XAxis dataKey="service" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" name="Total Incidents" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="autoResolved" name="Auto-Resolved by AI" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-muted)' }}>
              Highest Auto-Remediation: <strong style={{ color: 'var(--text-primary)' }}>Auth Gateway (85.7%)</strong>
            </span>
            <span className="font-bold text-blue-400 flex items-center gap-1">
              <Activity size={14} />
              <span>Zero-Touch Healing Active</span>
            </span>
          </div>
        </div>

        {/* Right: SRE Team Performance Leaderboard (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-card shadow-xl border border-slate-800/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#10B981' }} />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                    SRE Velocity
                  </span>
                </div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  On-Call Team Leaderboard
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Users size={12} />
                <span>5 Engineers Active</span>
              </span>
            </div>

            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Engineers ranked by AI tool synergy, average MTTR, and resolution accuracy.
            </p>

            <div className="space-y-3">
              {TEAM_LEADERBOARD.map((member, idx) => (
                <div
                  key={member.id}
                  className="p-3.5 rounded-xl border bg-slate-900/40 border-slate-800/80 flex items-center justify-between gap-3 transition-all hover:bg-slate-900/60"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 border"
                      style={{ background: member.color, borderColor: 'rgba(255,255,255,0.2)' }}
                    >
                      {member.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                          {member.name}
                        </span>
                        <span
                          className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0"
                          style={{
                            background: `${member.statusColor}15`,
                            color: member.statusColor,
                            border: `1px solid ${member.statusColor}30`,
                          }}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 font-mono text-xs font-extrabold text-emerald-400">
                      <span>{member.aiScore}%</span>
                      <Sparkles size={11} className="text-cyan-400" />
                    </div>
                    <span className="text-[10px] font-mono block" style={{ color: 'var(--text-muted)' }}>
                      MTTR: <strong style={{ color: 'var(--text-primary)' }}>{member.avgMttr}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
            <span style={{ color: 'var(--text-muted)' }}>Team Synergy Score: <strong className="text-emerald-400">96.8%</strong></span>
            <span className="font-bold text-cyan-400 flex items-center gap-1">
              <ArrowUpRight size={13} />
              <span>SOC2 Compliant Roster</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
