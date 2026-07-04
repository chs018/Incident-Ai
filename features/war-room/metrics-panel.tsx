'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Zap,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TimeRange = '15m' | '1h' | '6h' | '24h';

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  change: string;
  isSpike?: boolean;
  isDrop?: boolean;
  icon: React.ReactNode;
  chartColor: string;
  points: number[];
  threshold?: number;
}

function MetricCard({
  title,
  value,
  unit,
  change,
  isSpike,
  isDrop,
  icon,
  chartColor,
  points,
  threshold,
}: MetricCardProps) {
  const max = Math.max(...points, threshold ?? 100);
  const min = Math.min(...points) * 0.8;

  // Generate SVG path for area chart
  const width = 200;
  const height = 50;
  const step = width / (points.length - 1);

  const pathD = points
    .map((val, idx) => {
      const x = idx * step;
      const y = height - ((val - min) / (max - min)) * height;
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div
      className="p-4 rounded-xl glass-card border flex flex-col justify-between relative overflow-hidden transition-all hover:border-slate-700"
      style={{
        background: 'var(--bg-overlay)',
        borderColor: isSpike ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)',
      }}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300">
            {icon}
          </div>
          <span className="text-xs font-bold text-slate-200">{title}</span>
        </div>
        <div
          className={cn(
            'flex items-center gap-0.5 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded',
            isSpike && 'bg-red-500/10 text-red-400 border border-red-500/20',
            isDrop && 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
            !isSpike && !isDrop && 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          )}
        >
          {isSpike && <ArrowUpRight size={11} />}
          {isDrop && <ArrowDownRight size={11} />}
          <span>{change}</span>
        </div>
      </div>

      {/* Main Value & Unit */}
      <div className="flex items-baseline gap-1.5 mb-3">
        <span className="text-2xl font-extrabold text-white font-mono tracking-tight">{value}</span>
        <span className="text-xs font-medium text-slate-400">{unit}</span>
      </div>

      {/* SVG Sparkline Chart */}
      <div className="relative h-12 w-full mt-auto">
        {/* Threshold warning line */}
        {threshold && (
          <div
            className="absolute left-0 right-0 border-t border-dashed border-red-500/60 pointer-events-none"
            style={{
              top: `${height - ((threshold - min) / (max - min)) * height}px`,
            }}
            title={`Threshold: ${threshold}`}
          />
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`grad-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={chartColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#grad-${title})`} />
          <path d={pathD} fill="none" stroke={chartColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function MetricsPanel() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');

  // Realistic telemetry datasets per time range
  const datasets: Record<TimeRange, {
    cpu: number[];
    memory: number[];
    errorRate: number[];
    latency: number[];
    requests: number[];
    network: number[];
    disk: number[];
  }> = {
    '15m': {
      cpu: [42, 45, 50, 68, 88, 94, 98, 96, 92, 89],
      memory: [4.2, 4.8, 6.1, 8.4, 10.2, 11.8, 12.8, 12.8, 12.8, 12.8],
      errorRate: [0.01, 0.02, 0.1, 2.4, 8.9, 14.2, 18.4, 16.8, 15.1, 14.0],
      latency: [42, 45, 60, 420, 1800, 3400, 5001, 4800, 4500, 4200],
      requests: [14200, 14100, 13800, 12400, 10500, 9400, 9100, 9300, 9600, 9800],
      network: [240, 260, 310, 450, 580, 620, 570, 550, 520, 500],
      disk: [2100, 2300, 3400, 6800, 9400, 11200, 12100, 11800, 11000, 10400],
    },
    '1h': {
      cpu: [35, 38, 40, 42, 45, 50, 68, 88, 94, 98],
      memory: [4.0, 4.1, 4.2, 4.8, 6.1, 8.4, 10.2, 11.8, 12.8, 12.8],
      errorRate: [0.01, 0.01, 0.01, 0.02, 0.1, 2.4, 8.9, 14.2, 18.4, 16.8],
      latency: [40, 41, 42, 45, 60, 420, 1800, 3400, 5001, 4800],
      requests: [14500, 14400, 14200, 14100, 13800, 12400, 10500, 9400, 9100, 9300],
      network: [220, 230, 240, 260, 310, 450, 580, 620, 570, 550],
      disk: [1900, 2000, 2100, 2300, 3400, 6800, 9400, 11200, 12100, 11800],
    },
    '6h': {
      cpu: [30, 32, 34, 35, 38, 40, 42, 45, 50, 98],
      memory: [3.8, 3.9, 4.0, 4.0, 4.1, 4.2, 4.8, 6.1, 8.4, 12.8],
      errorRate: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 0.1, 2.4, 18.4],
      latency: [38, 39, 40, 40, 41, 42, 45, 60, 420, 5001],
      requests: [14800, 14700, 14600, 14500, 14400, 14200, 14100, 13800, 12400, 9100],
      network: [200, 210, 215, 220, 230, 240, 260, 310, 450, 620],
      disk: [1800, 1850, 1880, 1900, 2000, 2100, 2300, 3400, 6800, 12100],
    },
    '24h': {
      cpu: [28, 29, 30, 31, 32, 34, 35, 38, 40, 98],
      memory: [3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.0, 4.1, 4.8, 12.8],
      errorRate: [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.02, 18.4],
      latency: [35, 36, 37, 38, 39, 40, 40, 41, 45, 5001],
      requests: [15000, 14900, 14850, 14800, 14700, 14600, 14500, 14400, 14100, 9100],
      network: [190, 195, 198, 200, 210, 215, 220, 230, 260, 620],
      disk: [1700, 1750, 1780, 1800, 1850, 1880, 1900, 2000, 2300, 12100],
    },
  };

  const current = datasets[timeRange];

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BarChart3 size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Production Infrastructure Metrics</h3>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Refresh (5s)</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Aggregated across 12 pods in us-east-1 &middot; Prometheus / Datadog telemetry
            </p>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] text-slate-500 font-bold px-2 flex items-center gap-1">
            <Clock size={11} />
            <span>Range:</span>
          </span>
          {(['15m', '1h', '6h', '24h'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all',
                timeRange === range
                  ? 'bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 7 Telemetry Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {/* 1. CPU Utilization */}
        <MetricCard
          title="CPU Utilization"
          value="98.4"
          unit="%"
          change="+118% vs avg"
          isSpike
          icon={<Cpu size={14} className="text-red-400" />}
          chartColor="#EF4444"
          points={current.cpu}
          threshold={85}
        />

        {/* 2. Memory Usage */}
        <MetricCard
          title="Redis Memory"
          value="12.8"
          unit="GB / 12.8"
          change="OOM Limit Reached"
          isSpike
          icon={<Database size={14} className="text-amber-400" />}
          chartColor="#F59E0B"
          points={current.memory}
          threshold={12.0}
        />

        {/* 3. HTTP Error Rate */}
        <MetricCard
          title="HTTP Error Rate"
          value="18.4"
          unit="%"
          change="+1,840% (503s)"
          isSpike
          icon={<AlertTriangle size={14} className="text-red-400" />}
          chartColor="#EF4444"
          points={current.errorRate}
          threshold={1.0}
        />

        {/* 4. API Latency */}
        <MetricCard
          title="API Latency (p99)"
          value="5,001"
          unit="ms"
          change="+4,959ms timeout"
          isSpike
          icon={<Activity size={14} className="text-purple-400" />}
          chartColor="#A855F7"
          points={current.latency}
          threshold={500}
        />

        {/* 5. Request Volume */}
        <MetricCard
          title="Request Volume"
          value="9,100"
          unit="req/s"
          change="-35.9% drop"
          isDrop
          icon={<Globe size={14} className="text-blue-400" />}
          chartColor="#3B82F6"
          points={current.requests}
        />

        {/* 6. Network I/O */}
        <MetricCard
          title="Network Inbound"
          value="570"
          unit="MB/s"
          change="+140% traffic"
          icon={<Zap size={14} className="text-cyan-400" />}
          chartColor="#06B6D4"
          points={current.network}
        />

        {/* 7. Disk I/O */}
        <MetricCard
          title="Disk I/O (Swap)"
          value="12,100"
          unit="IOPS"
          change="+480% swap thrash"
          isSpike
          icon={<HardDrive size={14} className="text-orange-400" />}
          chartColor="#F97316"
          points={current.disk}
          threshold={8000}
        />
      </div>
    </div>
  );
}
