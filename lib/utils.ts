import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IncidentSeverity, IncidentStatus, IncidentPriority } from '@/types';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a timestamp to a relative string like "3 minutes ago" */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 0) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Format duration in minutes to human-readable */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Format a date to locale string */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Get color classes for incident severity */
export function getSeverityColor(severity: IncidentSeverity): string {
  const map: Record<IncidentSeverity, string> = {
    critical: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  };
  return map[severity];
}

/** Get color classes for incident status */
export function getStatusColor(status: IncidentStatus): string {
  const map: Record<IncidentStatus, string> = {
    active: 'text-red-400 bg-red-500/10 border-red-500/20',
    investigating: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    mitigating: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    postmortem: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };
  return map[status];
}

/** Get color classes for incident priority */
export function getPriorityColor(priority: IncidentPriority): string {
  const map: Record<IncidentPriority, string> = {
    P0: 'text-red-400 bg-red-500/10 border-red-500/20',
    P1: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    P2: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    P3: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };
  return map[priority];
}

/** Format large numbers with K/M suffixes */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}
