/**
 * Dashboard Mock Data — Slice 2
 * All data follows realistic enterprise SRE patterns.
 * Future: replace with TanStack Query hooks fetching from Supabase.
 */

import {
  ServiceHealth,
  AIInsight,
  ActivityItem,
  BudgetData,
  Incident,
  IncidentSeverity,
  IncidentStatus,
  IncidentPriority,
  Environment,
} from '@/types';

// ─── Service Health ───────────────────────────────────────────

export const serviceHealthData: ServiceHealth[] = [
  {
    id: 'svc-1',
    name: 'payment-api',
    displayName: 'Payment API',
    status: 'critical',
    latencyMs: 4287,
    latencyTrend: 1840,
    cpuPercent: 94,
    memoryPercent: 88,
    uptime: 0.2,
    environment: 'production',
    version: 'v2.4.1',
    region: 'us-east-1',
  },
  {
    id: 'svc-2',
    name: 'auth-service',
    displayName: 'Authentication',
    status: 'healthy',
    latencyMs: 24,
    latencyTrend: -8,
    cpuPercent: 18,
    memoryPercent: 41,
    uptime: 99.98,
    environment: 'production',
    version: 'v3.1.1',
    region: 'us-east-1',
  },
  {
    id: 'svc-3',
    name: 'notification-worker',
    displayName: 'Notification Service',
    status: 'degraded',
    latencyMs: 840,
    latencyTrend: 320,
    cpuPercent: 62,
    memoryPercent: 91,
    uptime: 87.4,
    environment: 'production',
    version: 'v2.8.3',
    region: 'us-east-1',
  },
  {
    id: 'svc-4',
    name: 'analytics-db',
    displayName: 'Database',
    status: 'critical',
    latencyMs: 12400,
    latencyTrend: 24700,
    cpuPercent: 98,
    memoryPercent: 76,
    uptime: 72.1,
    environment: 'production',
    version: 'PostgreSQL 15.2',
    region: 'us-east-1',
  },
  {
    id: 'svc-5',
    name: 'session-cache',
    displayName: 'Redis Cache',
    status: 'degraded',
    latencyMs: 18,
    latencyTrend: 12,
    cpuPercent: 45,
    memoryPercent: 98,
    uptime: 87.4,
    environment: 'production',
    version: 'Redis 7.0.8',
    region: 'us-east-1',
  },
  {
    id: 'svc-6',
    name: 'k8s-cluster',
    displayName: 'Kubernetes',
    status: 'degraded',
    latencyMs: 0,
    latencyTrend: 0,
    cpuPercent: 71,
    memoryPercent: 68,
    uptime: 99.1,
    environment: 'production',
    version: 'k8s v1.28.4',
    region: 'us-east-1',
  },
  {
    id: 'svc-7',
    name: 'api-gateway',
    displayName: 'API Gateway',
    status: 'healthy',
    latencyMs: 12,
    latencyTrend: -3,
    cpuPercent: 22,
    memoryPercent: 34,
    uptime: 99.99,
    environment: 'production',
    version: 'nginx/1.24.0',
    region: 'us-east-1',
  },
  {
    id: 'svc-8',
    name: 'kafka',
    displayName: 'Kafka',
    status: 'degraded',
    latencyMs: 0,
    latencyTrend: 0,
    cpuPercent: 58,
    memoryPercent: 62,
    uptime: 96.3,
    environment: 'production',
    version: 'Kafka 3.5.1',
    region: 'us-east-1',
  },
];

// ─── Extended Incidents (20 total) ───────────────────────────

const engineers = [
  { name: 'Sophia Chen',   initials: 'SC', color: '#3B82F6', team: 'Platform Engineering' },
  { name: 'Daniel Carter', initials: 'DC', color: '#10B981', team: 'SRE' },
  { name: 'Olivia Brooks', initials: 'OB', color: '#8B5CF6', team: 'Cloud Infrastructure' },
  { name: 'Michael Lee',   initials: 'ML', color: '#F59E0B', team: 'SRE' },
  { name: 'Priya Sharma',  initials: 'PS', color: '#EF4444', team: 'Security Operations' },
  { name: 'Alex Johnson',  initials: 'AJ', color: '#06B6D4', team: 'DevOps' },
  { name: 'Vikram Nair',   initials: 'VN', color: '#A78BFA', team: 'Platform Engineering' },
  { name: 'Ananya Bose',   initials: 'AB', color: '#34D399', team: 'Cloud Infrastructure' },
];

type IncidentRow = {
  id: string;
  title: string;
  service: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  priority: IncidentPriority;
  environment: Environment;
  team: string;
  assigneeIdx: number;
  createdAt: string;
  mttr: number | null;
};

const incidentRows: IncidentRow[] = [
  { id: 'INC-2947', title: 'Payment API returning 503 — Complete service outage', service: 'payment-api', severity: 'critical', status: 'investigating', priority: 'P0', environment: 'production', team: 'Platform Engineering', assigneeIdx: 1, createdAt: '2026-07-04T14:32:00Z', mttr: null },
  { id: 'INC-2946', title: 'Redis Out of Memory — Session cache eviction storm', service: 'session-cache', severity: 'high', status: 'mitigating', priority: 'P1', environment: 'production', team: 'Cloud Infrastructure', assigneeIdx: 2, createdAt: '2026-07-04T12:10:00Z', mttr: null },
  { id: 'INC-2945', title: 'Kubernetes CrashLoopBackOff — recommendation-service', service: 'k8s-cluster', severity: 'high', status: 'investigating', priority: 'P1', environment: 'production', team: 'Platform Engineering', assigneeIdx: 3, createdAt: '2026-07-04T11:03:00Z', mttr: null },
  { id: 'INC-2944', title: 'Database CPU at 98% — analytics-db primary', service: 'analytics-db', severity: 'high', status: 'active', priority: 'P1', environment: 'production', team: 'SRE', assigneeIdx: 1, createdAt: '2026-07-04T10:15:00Z', mttr: null },
  { id: 'INC-2943', title: 'Authentication service down — JWT validation failures', service: 'auth-service', severity: 'critical', status: 'resolved', priority: 'P0', environment: 'production', team: 'Security Operations', assigneeIdx: 4, createdAt: '2026-07-03T22:00:00Z', mttr: 12 },
  { id: 'INC-2942', title: 'API latency spike — p99 >8s on checkout endpoints', service: 'checkout-api', severity: 'medium', status: 'resolved', priority: 'P2', environment: 'production', team: 'Platform Engineering', assigneeIdx: 2, createdAt: '2026-07-03T16:00:00Z', mttr: 45 },
  { id: 'INC-2941', title: 'TLS Certificate expiry — api.cloudnova.io', service: 'api-gateway', severity: 'critical', status: 'resolved', priority: 'P0', environment: 'production', team: 'Platform Engineering', assigneeIdx: 0, createdAt: '2026-07-01T00:00:00Z', mttr: 8 },
  { id: 'INC-2940', title: 'Memory leak — notification-worker pods', service: 'notification-worker', severity: 'medium', status: 'postmortem', priority: 'P2', environment: 'production', team: 'DevOps', assigneeIdx: 5, createdAt: '2026-06-30T08:00:00Z', mttr: 360 },
  { id: 'INC-2939', title: 'Kafka consumer lag — billing-processor 48h behind', service: 'kafka', severity: 'high', status: 'mitigating', priority: 'P1', environment: 'production', team: 'Platform Engineering', assigneeIdx: 6, createdAt: '2026-07-04T08:22:00Z', mttr: null },
  { id: 'INC-2938', title: 'OOMKilled — ml-inference pods restarting every 4m', service: 'ml-inference', severity: 'high', status: 'active', priority: 'P1', environment: 'production', team: 'Cloud Infrastructure', assigneeIdx: 7, createdAt: '2026-07-04T07:45:00Z', mttr: null },
  { id: 'INC-2937', title: 'S3 throttling — backup jobs failing in us-west-2', service: 'backup-service', severity: 'medium', status: 'investigating', priority: 'P2', environment: 'production', team: 'Cloud Infrastructure', assigneeIdx: 2, createdAt: '2026-07-04T06:00:00Z', mttr: null },
  { id: 'INC-2936', title: 'Disk IOPS saturation — user-db replica lag 45s', service: 'user-db', severity: 'medium', status: 'mitigating', priority: 'P2', environment: 'production', team: 'SRE', assigneeIdx: 3, createdAt: '2026-07-04T05:30:00Z', mttr: null },
  { id: 'INC-2935', title: 'Deployment canary rollback — billing-engine v9.1.2', service: 'billing-engine', severity: 'low', status: 'resolved', priority: 'P3', environment: 'staging', team: 'DevOps', assigneeIdx: 5, createdAt: '2026-07-03T18:00:00Z', mttr: 22 },
  { id: 'INC-2934', title: 'Rate limit breach — external partner API calls', service: 'partner-api', severity: 'low', status: 'resolved', priority: 'P3', environment: 'production', team: 'Platform Engineering', assigneeIdx: 6, createdAt: '2026-07-03T14:00:00Z', mttr: 34 },
  { id: 'INC-2933', title: 'SSL handshake failures — CDN edge nodes', service: 'cdn', severity: 'medium', status: 'resolved', priority: 'P2', environment: 'production', team: 'DevOps', assigneeIdx: 5, createdAt: '2026-07-03T12:00:00Z', mttr: 67 },
  { id: 'INC-2932', title: 'Prometheus scrape timeout — 12 targets missing', service: 'prometheus', severity: 'low', status: 'resolved', priority: 'P3', environment: 'production', team: 'SRE', assigneeIdx: 1, createdAt: '2026-07-03T10:00:00Z', mttr: 15 },
  { id: 'INC-2931', title: 'Pod eviction storm — node pressure in prod cluster', service: 'k8s-cluster', severity: 'high', status: 'resolved', priority: 'P1', environment: 'production', team: 'Cloud Infrastructure', assigneeIdx: 7, createdAt: '2026-07-02T22:00:00Z', mttr: 88 },
  { id: 'INC-2930', title: 'Circuit breaker open — recommendation ↔ inventory', service: 'recommendation-service', severity: 'medium', status: 'resolved', priority: 'P2', environment: 'production', team: 'Platform Engineering', assigneeIdx: 0, createdAt: '2026-07-02T16:00:00Z', mttr: 41 },
  { id: 'INC-2929', title: 'Security alert — brute force on admin login endpoint', service: 'auth-service', severity: 'high', status: 'resolved', priority: 'P1', environment: 'production', team: 'Security Operations', assigneeIdx: 4, createdAt: '2026-07-02T11:00:00Z', mttr: 18 },
  { id: 'INC-2928', title: 'Flapping health check — payment-api /health 200/503', service: 'payment-api', severity: 'medium', status: 'resolved', priority: 'P2', environment: 'staging', team: 'Platform Engineering', assigneeIdx: 2, createdAt: '2026-07-02T09:00:00Z', mttr: 29 },
];

export const extendedIncidents = incidentRows.map((row) => {
  const eng = engineers[row.assigneeIdx];
  return {
    ...row,
    description: `${row.title}. Under active investigation.`,
    affectedServices: [row.service],
    assignee: {
      id: `usr-${row.assigneeIdx}`,
      name: eng.name,
      email: `${eng.name.toLowerCase().replace(' ', '.')}@cloudnova.io`,
      role: 'sre' as const,
      avatarInitials: eng.initials,
      avatarColor: eng.color,
      team: eng.team,
      status: 'online' as const,
      incidentsResolved: 100,
      joinedAt: '2022-01-01T00:00:00Z',
    },
    commander: null,
    tags: [],
    timeline: [],
    aiAnalysis: null,
    updatedAt: row.createdAt,
    resolvedAt: row.mttr ? new Date(new Date(row.createdAt).getTime() + row.mttr * 60000).toISOString() : null,
    runbook: null,
  };
});

// ─── AI Insights ─────────────────────────────────────────────

export const aiInsights: AIInsight[] = [
  {
    id: 'ins-1',
    title: 'Redis OOM failures increased 22%',
    description: 'Memory usage pattern shows exponential growth correlated with auth-service v3.1.2 deployment. TTL regression confirmed.',
    service: 'session-cache',
    severity: 'critical',
    confidence: 94,
    timestamp: '2026-07-04T14:38:00Z',
    type: 'anomaly',
    actionable: true,
  },
  {
    id: 'ins-2',
    title: 'Authentication error spike detected',
    description: 'JWT validation failures across 3 services. Pattern matches Vault key rotation sequence observed in INC-2721.',
    service: 'auth-service',
    severity: 'high',
    confidence: 88,
    timestamp: '2026-07-04T14:25:00Z',
    type: 'regression',
    actionable: true,
  },
  {
    id: 'ins-3',
    title: 'Possible deployment regression — payment-api',
    description: 'Error rate elevation correlates precisely with v2.4.1 rollout at 14:28 UTC. Rollback recommended.',
    service: 'payment-api',
    severity: 'critical',
    confidence: 96,
    timestamp: '2026-07-04T14:34:00Z',
    type: 'regression',
    actionable: true,
  },
  {
    id: 'ins-4',
    title: 'API latency trending upward — 7-day view',
    description: 'p99 latency on checkout endpoints showing +340ms drift over 7 days. No single incident, gradual degradation.',
    service: 'checkout-api',
    severity: 'medium',
    confidence: 81,
    timestamp: '2026-07-04T13:00:00Z',
    type: 'trend',
    actionable: false,
  },
  {
    id: 'ins-5',
    title: 'Kafka consumer lag predicted to breach SLA',
    description: 'At current rate, billing-processor lag will exceed 72h threshold in ~4 hours. Auto-scaling recommended.',
    service: 'kafka',
    severity: 'high',
    confidence: 78,
    timestamp: '2026-07-04T12:50:00Z',
    type: 'prediction',
    actionable: true,
  },
  {
    id: 'ins-6',
    title: 'Database query plan regression — analytics-db',
    description: 'Sequential scans detected on transactions table. Missing index introduced in migration 20240704-001.',
    service: 'analytics-db',
    severity: 'high',
    confidence: 92,
    timestamp: '2026-07-04T10:20:00Z',
    type: 'anomaly',
    actionable: true,
  },
];

// ─── Activity Timeline ────────────────────────────────────────

export const activityItems: ActivityItem[] = [
  {
    id: 'act-1',
    actor: 'Harshini Shree',
    actorRole: 'Incident Commander',
    avatarInitials: 'HS',
    avatarColor: '#3B82F6',
    action: 'Opened war room for',
    target: 'INC-2947 — Payment API 503',
    timestamp: '2026-07-04T14:33:00Z',
    type: 'create',
  },
  {
    id: 'act-2',
    actor: 'AI Incident Commander',
    actorRole: 'AI Engine',
    avatarInitials: 'AI',
    avatarColor: '#8B5CF6',
    action: 'Generated root cause analysis for',
    target: 'INC-2947 (94% confidence)',
    timestamp: '2026-07-04T14:35:00Z',
    type: 'ai',
  },
  {
    id: 'act-3',
    actor: 'Rohan Kapoor',
    actorRole: 'DevOps Engineer',
    avatarInitials: 'RK',
    avatarColor: '#8B5CF6',
    action: 'Scaled payment-api pods',
    target: '8 → 16 replicas (no improvement)',
    timestamp: '2026-07-04T14:45:00Z',
    type: 'deploy',
  },
  {
    id: 'act-4',
    actor: 'Priya Menon',
    actorRole: 'SRE',
    avatarInitials: 'PM',
    avatarColor: '#10B981',
    action: 'Applied Redis mitigation for',
    target: 'INC-2946 — flushing stale sessions',
    timestamp: '2026-07-04T12:30:00Z',
    type: 'restart',
  },
  {
    id: 'act-5',
    actor: 'AI Incident Commander',
    actorRole: 'AI Engine',
    avatarInitials: 'AI',
    avatarColor: '#8B5CF6',
    action: 'Suggested rollback for',
    target: 'payment-api v2.4.1 → v2.4.0',
    timestamp: '2026-07-04T14:36:00Z',
    type: 'ai',
  },
  {
    id: 'act-6',
    actor: 'Kavita Reddy',
    actorRole: 'SRE',
    avatarInitials: 'KR',
    avatarColor: '#F59E0B',
    action: 'Investigating pod logs for',
    target: 'INC-2945 — CrashLoopBackOff',
    timestamp: '2026-07-04T11:05:00Z',
    type: 'alert',
  },
  {
    id: 'act-7',
    actor: 'Dev Anand',
    actorRole: 'Security Engineer',
    avatarInitials: 'DA',
    avatarColor: '#EF4444',
    action: 'Resolved',
    target: 'INC-2943 — JWT auth restored in 12m',
    timestamp: '2026-07-03T22:12:00Z',
    type: 'resolve',
  },
  {
    id: 'act-8',
    actor: 'Sneha Iyer',
    actorRole: 'DevOps Engineer',
    avatarInitials: 'SI',
    avatarColor: '#06B6D4',
    action: 'Security scan completed on',
    target: 'production k8s cluster — 0 critical CVEs',
    timestamp: '2026-07-03T20:00:00Z',
    type: 'security',
  },
  {
    id: 'act-9',
    actor: 'Rohan Kapoor',
    actorRole: 'DevOps Engineer',
    avatarInitials: 'RK',
    avatarColor: '#8B5CF6',
    action: 'Deployment completed',
    target: 'checkout-api v8.3.1 → production',
    timestamp: '2026-07-03T15:00:00Z',
    type: 'deploy',
  },
  {
    id: 'act-10',
    actor: 'Priya Menon',
    actorRole: 'SRE',
    avatarInitials: 'PM',
    avatarColor: '#10B981',
    action: 'Resolved',
    target: 'INC-2942 — API latency fixed (N+1 query)',
    timestamp: '2026-07-03T16:45:00Z',
    type: 'resolve',
  },
];

// ─── Budget Data ──────────────────────────────────────────────

export const budgetData: BudgetData = {
  todaySpend: 43.82,
  monthlyBudget: 2000,
  monthlySpend: 1247.34,
  avgCostPerIncident: 3.24,
  requestsToday: 18941,
  tokensToday: 4820000,
  successRate: 99.2,
  avgLatencyMs: 487,
};

// ─── KPI Sparklines ───────────────────────────────────────────

export const kpiSparklines = {
  activeIncidents: [6, 4, 8, 5, 7, 4, 4],
  criticalIncidents: [2, 1, 3, 2, 2, 1, 2],
  resolvedToday: [1, 3, 2, 5, 3, 4, 5],
  mttr: [140, 120, 108, 115, 98, 110, 106],
  aiAccuracy: [91, 93, 92, 94, 93, 95, 96],
  memoryHitRate: [72, 74, 71, 76, 78, 75, 77],
  aiBudget: [28, 34, 31, 38, 41, 39, 44],
  todayCost: [18, 22, 24, 29, 31, 38, 44],
};

// ─── Infrastructure nodes ─────────────────────────────────────

export const infraNodes = [
  { id: 'users',    label: 'End Users',    sublabel: '142K active',           icon: 'users',         status: 'healthy',  level: 0 },
  { id: 'lb',       label: 'Load Balancer', sublabel: 'AWS ALB · us-east-1',   icon: 'git-merge',     status: 'healthy',  level: 1 },
  { id: 'gateway',  label: 'API Gateway',   sublabel: 'nginx/1.24.0',          icon: 'shield',        status: 'healthy',  level: 2 },
  { id: 'payment',  label: 'Payment API',   sublabel: 'v2.4.1 · 16 pods',     icon: 'credit-card',   status: 'critical', level: 3 },
  { id: 'auth',     label: 'Auth Service',  sublabel: 'v3.1.1 · 4 pods',      icon: 'lock',          status: 'healthy',  level: 3 },
  { id: 'checkout', label: 'Checkout BFF',  sublabel: 'v8.3.1 · 8 pods',      icon: 'shopping-cart', status: 'healthy',  level: 3 },
  { id: 'postgres', label: 'PostgreSQL',    sublabel: 'analytics-db · CPU 98%', icon: 'database',     status: 'critical', level: 4 },
  { id: 'redis',    label: 'Redis Cache',   sublabel: 'MEM 98% · degraded',    icon: 'server',        status: 'degraded', level: 4 },
  { id: 'monitoring', label: 'Monitoring',  sublabel: 'Datadog · Prometheus',  icon: 'activity',      status: 'healthy',  level: 5 },
  { id: 'storage',  label: 'Storage',       sublabel: 'S3 · 18TB · us-east-1', icon: 'hard-drive',   status: 'healthy',  level: 6 },
];
