import { Incident, TimelineEvent, AIAnalysis } from '@/types';
import { teamMembers } from './organizations';

const mkTimeline = (events: Omit<TimelineEvent, 'id'>[]): TimelineEvent[] =>
  events.map((e, i) => ({ ...e, id: `evt-${i + 1}` }));

const paymentApiAnalysis: AIAnalysis = {
  summary:
    'The Payment API is returning 503 Service Unavailable errors across all regions. Elevated error rates detected at 14:32 UTC correlating with a deployment of version 2.4.1. Connection pool exhaustion in the upstream PostgreSQL cluster is the primary vector.',
  rootCause:
    'Database connection pool exhaustion triggered by a missing index on the `transactions` table introduced in migration 20240704-001. Queries degraded from 2ms to 4,200ms average, saturating all 200 available connections.',
  impact:
    'Payment processing is completely unavailable. Estimated 42,000 transactions blocked per minute. Revenue impact ~$1.2M/hr. Downstream services (Order Management, Inventory) are partially degraded.',
  affectedUsers: 84000,
  confidence: 94,
  recommendedActions: [
    'Immediately rollback deployment v2.4.1 to v2.4.0 using helm rollback payment-api',
    'Execute CONCURRENTLY index creation: CREATE INDEX CONCURRENTLY idx_transactions_user_created ON transactions(user_id, created_at)',
    'Increase connection pool max_size from 200 to 350 as interim mitigation',
    'Enable read replicas for analytics queries to reduce primary load',
    'Set up connection pool monitoring alert at 80% utilization threshold',
  ],
  relatedIncidents: ['INC-2891', 'INC-2654'],
  generatedAt: '2026-07-04T14:35:00Z',
  model: 'llama-3.3-70b-versatile',
};

export const incidents: Incident[] = [
  {
    id: 'INC-2947',
    title: 'Payment API returning 503 — Complete service outage',
    description:
      'The core Payment API is returning HTTP 503 errors across all geographic regions. All payment processing is halted. Customer-facing checkout flows are broken.',
    severity: 'critical',
    status: 'investigating',
    priority: 'P0',
    environment: 'production',
    service: 'payment-api',
    affectedServices: ['payment-api', 'order-management', 'inventory-service', 'checkout-bff'],
    team: 'Platform Engineering',
    assignee: teamMembers[1],
    commander: teamMembers[0],
    tags: [
      { label: 'database', color: '#3B82F6' },
      { label: 'connection-pool', color: '#8B5CF6' },
      { label: 'revenue-impact', color: '#EF4444' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-07-04T14:32:00Z',
        actor: 'PagerDuty',
        action: 'Alert fired',
        detail: 'payment-api error rate exceeded 10% threshold (current: 98.4%)',
        type: 'detection',
      },
      {
        timestamp: '2026-07-04T14:33:22Z',
        actor: 'Harshini Shree',
        action: 'Incident acknowledged',
        detail: 'Assigned as Incident Commander. War room opened.',
        type: 'acknowledgment',
      },
      {
        timestamp: '2026-07-04T14:35:00Z',
        actor: 'AI Incident Commander',
        action: 'AI Analysis generated',
        detail: 'Root cause identified: DB connection pool exhaustion. Confidence: 94%',
        type: 'investigation',
      },
      {
        timestamp: '2026-07-04T14:38:00Z',
        actor: 'Priya Menon',
        action: 'Investigation started',
        detail: 'Reviewing PostgreSQL slow query logs and connection pool metrics',
        type: 'investigation',
      },
      {
        timestamp: '2026-07-04T14:45:00Z',
        actor: 'Rohan Kapoor',
        action: 'Mitigation attempted',
        detail: 'Scaled payment-api pods from 8 to 16 — no improvement observed',
        type: 'action',
      },
    ]),
    aiAnalysis: paymentApiAnalysis,
    createdAt: '2026-07-04T14:32:00Z',
    updatedAt: '2026-07-04T14:45:00Z',
    resolvedAt: null,
    mttr: null,
    runbook:
      'https://runbooks.cloudnova.io/payment-api/503-recovery',
  },
  {
    id: 'INC-2946',
    title: 'Redis Out of Memory — Session cache eviction storm',
    description:
      'Primary Redis cluster has hit 98% memory utilization causing aggressive key eviction. User sessions are being dropped, resulting in forced logouts across the platform.',
    severity: 'high',
    status: 'mitigating',
    priority: 'P1',
    environment: 'production',
    service: 'session-cache',
    affectedServices: ['session-cache', 'auth-service', 'user-api'],
    team: 'Cloud Infrastructure',
    assignee: teamMembers[2],
    commander: teamMembers[1],
    tags: [
      { label: 'redis', color: '#EF4444' },
      { label: 'memory', color: '#F59E0B' },
      { label: 'sessions', color: '#06B6D4' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-07-04T12:10:00Z',
        actor: 'Datadog',
        action: 'Alert fired',
        detail: 'Redis memory usage at 94% and climbing',
        type: 'detection',
      },
      {
        timestamp: '2026-07-04T12:14:00Z',
        actor: 'Priya Menon',
        action: 'Acknowledged',
        detail: 'Investigating memory growth pattern',
        type: 'acknowledgment',
      },
      {
        timestamp: '2026-07-04T12:30:00Z',
        actor: 'Rohan Kapoor',
        action: 'Mitigation applied',
        detail: 'Added 2 new Redis replicas. Flushing stale session keys older than 7 days.',
        type: 'action',
      },
    ]),
    aiAnalysis: {
      summary:
        'Redis OOM triggered by a session key TTL regression. A recent auth-service deployment removed TTL from session keys, causing unbounded growth. Combined with a 40% traffic spike from a marketing campaign, memory was exhausted.',
      rootCause:
        'auth-service v3.1.2 removed SET EX (TTL) from session key writes. Sessions are now persisting indefinitely instead of expiring after 24h.',
      impact: 'Approximately 28,000 active users experiencing random session drops. Auth failure rate at 12%.',
      affectedUsers: 28000,
      confidence: 88,
      recommendedActions: [
        'Rollback auth-service to v3.1.1 immediately',
        'Run: redis-cli --scan --pattern "sess:*" | xargs redis-cli del (for keys > 7 days)',
        'Set maxmemory-policy to allkeys-lru as interim measure',
        'Scale Redis cluster from r6g.xlarge to r6g.2xlarge',
      ],
      relatedIncidents: ['INC-2801'],
      generatedAt: '2026-07-04T12:16:00Z',
      model: 'llama-3.3-70b-versatile',
    },
    createdAt: '2026-07-04T12:10:00Z',
    updatedAt: '2026-07-04T12:30:00Z',
    resolvedAt: null,
    mttr: null,
    runbook: 'https://runbooks.cloudnova.io/redis/oom-recovery',
  },
  {
    id: 'INC-2945',
    title: 'Kubernetes CrashLoopBackOff — recommendation-service pods',
    description:
      'All 12 pods of the recommendation-service are in CrashLoopBackOff state in the us-east-1 cluster. Product recommendations unavailable across all storefronts.',
    severity: 'high',
    status: 'investigating',
    priority: 'P1',
    environment: 'production',
    service: 'recommendation-service',
    affectedServices: ['recommendation-service', 'storefront-api', 'homepage-bff'],
    team: 'Platform Engineering',
    assignee: teamMembers[3],
    commander: teamMembers[0],
    tags: [
      { label: 'kubernetes', color: '#326CE5' },
      { label: 'crashloop', color: '#EF4444' },
      { label: 'ml-model', color: '#8B5CF6' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-07-04T11:00:00Z',
        actor: 'ArgoCD',
        action: 'Deployment triggered',
        detail: 'recommendation-service v4.2.0 rollout started',
        type: 'action',
      },
      {
        timestamp: '2026-07-04T11:03:00Z',
        actor: 'Kubernetes',
        action: 'CrashLoopBackOff detected',
        detail: 'Pods entering crash loop with OOMKilled exit code',
        type: 'detection',
      },
      {
        timestamp: '2026-07-04T11:05:00Z',
        actor: 'Kavita Reddy',
        action: 'Investigating',
        detail: 'Reviewing pod logs and resource limits',
        type: 'investigation',
      },
    ]),
    aiAnalysis: {
      summary:
        'The recommendation-service v4.2.0 introduced a new TensorFlow model (v2.1) that requires 4GB RAM per pod, but container memory limits are set to 2GB. All pods are OOMKilled on startup.',
      rootCause:
        'Memory limit mismatch: new ML model checkpoint size increased from 1.2GB to 3.8GB. Container spec was not updated in the Helm chart values before deployment.',
      impact: 'Product recommendations unavailable. A/B testing halted. Estimated 8% reduction in add-to-cart conversion.',
      affectedUsers: 0,
      confidence: 91,
      recommendedActions: [
        'kubectl rollout undo deployment/recommendation-service -n production',
        'Update Helm values: resources.limits.memory from 2Gi to 5Gi',
        'Re-deploy after updating limits',
        'Set up pre-deployment resource validation in CI pipeline',
      ],
      relatedIncidents: [],
      generatedAt: '2026-07-04T11:06:00Z',
      model: 'llama-3.3-70b-versatile',
    },
    createdAt: '2026-07-04T11:03:00Z',
    updatedAt: '2026-07-04T11:05:00Z',
    resolvedAt: null,
    mttr: null,
    runbook: null,
  },
  {
    id: 'INC-2944',
    title: 'Database CPU at 98% — analytics-db primary',
    description:
      'The analytics PostgreSQL primary database is running at 98% CPU. Query latencies have spiked from 50ms to 12s. Dashboards and reporting are completely unresponsive.',
    severity: 'high',
    status: 'active',
    priority: 'P1',
    environment: 'production',
    service: 'analytics-db',
    affectedServices: ['analytics-db', 'reporting-api', 'dashboard-service'],
    team: 'SRE',
    assignee: teamMembers[1],
    commander: null,
    tags: [
      { label: 'postgresql', color: '#336791' },
      { label: 'cpu', color: '#EF4444' },
      { label: 'slow-queries', color: '#F59E0B' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-07-04T10:15:00Z',
        actor: 'CloudWatch',
        action: 'CPU threshold breached',
        detail: 'analytics-db CPU at 98% for 5 consecutive minutes',
        type: 'detection',
      },
    ]),
    aiAnalysis: null,
    createdAt: '2026-07-04T10:15:00Z',
    updatedAt: '2026-07-04T10:15:00Z',
    resolvedAt: null,
    mttr: null,
    runbook: 'https://runbooks.cloudnova.io/postgres/cpu-runaway',
  },
  {
    id: 'INC-2943',
    title: 'Authentication service down — JWT validation failures',
    description:
      'The auth-service is rejecting all JWT tokens. Users cannot log in. Existing sessions are unaffected due to cookie fallback.',
    severity: 'critical',
    status: 'resolved',
    priority: 'P0',
    environment: 'production',
    service: 'auth-service',
    affectedServices: ['auth-service', 'api-gateway'],
    team: 'Security Operations',
    assignee: teamMembers[4],
    commander: teamMembers[0],
    tags: [
      { label: 'auth', color: '#8B5CF6' },
      { label: 'jwt', color: '#F59E0B' },
      { label: 'certificates', color: '#EF4444' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-07-03T22:00:00Z',
        actor: 'Sentry',
        action: 'Error spike detected',
        detail: 'JWT validation errors at 100% failure rate',
        type: 'detection',
      },
      {
        timestamp: '2026-07-03T22:05:00Z',
        actor: 'Dev Anand',
        action: 'Root cause identified',
        detail: 'JWT signing key rotated in Vault but auth-service not restarted to pick up new key',
        type: 'investigation',
      },
      {
        timestamp: '2026-07-03T22:12:00Z',
        actor: 'Dev Anand',
        action: 'Resolved',
        detail: 'Restarted auth-service pods to reload signing key from Vault',
        type: 'resolution',
      },
    ]),
    aiAnalysis: {
      summary:
        'Auth service was using a cached signing key that was rotated in HashiCorp Vault as part of scheduled quarterly key rotation. Service requires restart to pick up new key material.',
      rootCause:
        'JWT signing key rotated at 22:00 UTC as part of quarterly security rotation. auth-service v3.1.1 does not implement dynamic key reload — requires pod restart.',
      impact: 'Login completely unavailable for 12 minutes. 3,400 login attempts failed.',
      affectedUsers: 3400,
      confidence: 99,
      recommendedActions: [
        'Implement Vault Agent Sidecar for dynamic secret injection',
        'Add key rotation awareness to auth-service (watch Vault lease TTL)',
        'Coordinate key rotations with service restart in runbook',
      ],
      relatedIncidents: ['INC-2721'],
      generatedAt: '2026-07-03T22:07:00Z',
      model: 'llama-3.3-70b-versatile',
    },
    createdAt: '2026-07-03T22:00:00Z',
    updatedAt: '2026-07-03T22:12:00Z',
    resolvedAt: '2026-07-03T22:12:00Z',
    mttr: 12,
    runbook: 'https://runbooks.cloudnova.io/auth/jwt-failure',
  },
  {
    id: 'INC-2942',
    title: 'API Latency spike — p99 >8s on checkout endpoints',
    description:
      'Checkout API p99 latency has spiked from 220ms to 8.4 seconds. No errors, but users experience severe slowness during checkout. Conversion rate dropping.',
    severity: 'medium',
    status: 'resolved',
    priority: 'P2',
    environment: 'production',
    service: 'checkout-api',
    affectedServices: ['checkout-api', 'payment-api', 'shipping-service'],
    team: 'Platform Engineering',
    assignee: teamMembers[2],
    commander: null,
    tags: [
      { label: 'latency', color: '#F59E0B' },
      { label: 'checkout', color: '#06B6D4' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-07-03T16:00:00Z',
        actor: 'Datadog SLO',
        action: 'SLO breach alert',
        detail: 'checkout-api p99 latency SLO violated (8.4s > 500ms threshold)',
        type: 'detection',
      },
      {
        timestamp: '2026-07-03T16:45:00Z',
        actor: 'Rohan Kapoor',
        action: 'Resolved',
        detail: 'Identified N+1 query issue in shipping rate lookup. Deployed fix with bulk fetch.',
        type: 'resolution',
      },
    ]),
    aiAnalysis: null,
    createdAt: '2026-07-03T16:00:00Z',
    updatedAt: '2026-07-03T16:45:00Z',
    resolvedAt: '2026-07-03T16:45:00Z',
    mttr: 45,
    runbook: null,
  },
  {
    id: 'INC-2941',
    title: 'TLS Certificate expiry — api.cloudnova.io',
    description:
      'The TLS certificate for api.cloudnova.io expired. All HTTPS API traffic is returning SSL errors. Mobile apps and third-party integrations are fully broken.',
    severity: 'critical',
    status: 'resolved',
    priority: 'P0',
    environment: 'production',
    service: 'api-gateway',
    affectedServices: ['api-gateway', 'mobile-api', 'partner-api'],
    team: 'Platform Engineering',
    assignee: teamMembers[0],
    commander: teamMembers[0],
    tags: [
      { label: 'tls', color: '#EF4444' },
      { label: 'certificate', color: '#F59E0B' },
      { label: 'api-gateway', color: '#06B6D4' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-07-01T00:00:00Z',
        actor: 'Certificate Monitor',
        action: 'Certificate expired',
        detail: 'api.cloudnova.io certificate expired. Issued by DigiCert.',
        type: 'detection',
      },
      {
        timestamp: '2026-07-01T00:08:00Z',
        actor: 'Harshini Shree',
        action: 'Emergency certificate issued',
        detail: 'Let\'s Encrypt emergency cert provisioned via certbot. CDN cache cleared.',
        type: 'resolution',
      },
    ]),
    aiAnalysis: null,
    createdAt: '2026-07-01T00:00:00Z',
    updatedAt: '2026-07-01T00:08:00Z',
    resolvedAt: '2026-07-01T00:08:00Z',
    mttr: 8,
    runbook: 'https://runbooks.cloudnova.io/infra/cert-renewal',
  },
  {
    id: 'INC-2940',
    title: 'Memory leak — notification-worker pods',
    description:
      'notification-worker pods are leaking memory at ~200MB/hour. After 6 hours, pods hit the 2GB limit and restart, causing notification delivery delays.',
    severity: 'medium',
    status: 'postmortem',
    priority: 'P2',
    environment: 'production',
    service: 'notification-worker',
    affectedServices: ['notification-worker', 'email-service', 'push-service'],
    team: 'DevOps',
    assignee: teamMembers[5],
    commander: null,
    tags: [
      { label: 'memory-leak', color: '#F59E0B' },
      { label: 'worker', color: '#8B5CF6' },
    ],
    timeline: mkTimeline([
      {
        timestamp: '2026-06-30T08:00:00Z',
        actor: 'Datadog',
        action: 'Memory growth alert',
        detail: 'notification-worker memory growing linearly. Pattern suggests leak.',
        type: 'detection',
      },
      {
        timestamp: '2026-06-30T14:00:00Z',
        actor: 'Sneha Iyer',
        action: 'Root cause identified',
        detail: 'Event listener not removed in WebSocket connection teardown. Fixed in v2.8.4.',
        type: 'resolution',
      },
    ]),
    aiAnalysis: null,
    createdAt: '2026-06-30T08:00:00Z',
    updatedAt: '2026-06-30T14:00:00Z',
    resolvedAt: '2026-06-30T14:00:00Z',
    mttr: 360,
    runbook: null,
  },
];

export const activeIncidents = incidents.filter(
  (i) => i.status !== 'resolved' && i.status !== 'postmortem'
);

export const resolvedIncidents = incidents.filter(
  (i) => i.status === 'resolved' || i.status === 'postmortem'
);

export const dashboardMetrics = {
  activeIncidents: activeIncidents.length,
  mttr: 106, // minutes average
  slaCompliance: 98.4,
  incidentsToday: 4,
  incidentsThisWeek: 8,
  resolvedThisWeek: 5,
  p0Count: incidents.filter((i) => i.priority === 'P0').length,
  p1Count: incidents.filter((i) => i.priority === 'P1').length,
  meanTimeToDetect: 3.2, // minutes
};
