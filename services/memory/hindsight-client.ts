/**
 * Hindsight Memory Client — Slice 7 Persistent Memory Intelligence
 *
 * Pre-loaded with 12 rich historical production outages across enterprise infrastructure
 * (Redis OOMs, K8s DNS failures, PostgreSQL deadlocks, Kafka consumer lag, AWS ElastiCache evictions).
 * Provides simulated vector similarity embeddings, retrieval metrics, and persistent storage.
 */

import {
  HistoricalMemory,
  AIReflection,
  EngineerFeedback,
  MemoryTimelineEvent,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  MemoryAnalyticsData,
  Incident,
} from '@/types';

// ─── 12 Rich Historical Production Memories ────────────────────────────────

let historicalMemoriesStore: HistoricalMemory[] = [
  {
    id: 'mem-001',
    incidentId: 'inc-redis-2026-03',
    title: 'Redis ElastiCache OOM Eviction Storm during High Traffic',
    service: 'payment-api',
    environment: 'production',
    severity: 'critical',
    rootCause: 'Unindexed session query in v4.8.2 caused volatile-lru memory evictions, dropping authenticated user checkout sessions.',
    resolution: 'Rolled back payment-api deployment to v4.8.1, executed ElastiCache replica failover to clear memory fragmentation, and increased maxmemory to 24GB.',
    engineer: {
      name: 'Alex Rivera',
      role: 'Principal SRE',
      avatarInitials: 'AR',
    },
    timeToResolution: 14,
    businessImpact: 'Zero data loss. Prevented $140k/hr revenue leakage during checkout.',
    recoverySuccessRate: 99.4,
    similarityScore: 98.2,
    relevanceBadge: 'Exact Pattern',
    createdAt: '2026-03-14T08:30:00Z',
    lastUsedAt: '2026-07-02T14:20:00Z',
    useCount: 14,
    tags: ['redis', 'oom', 'elasticache', 'payment', 'eviction'],
    runbookUrl: 'https://runbooks.internal/redis-oom-recovery',
  },
  {
    id: 'mem-002',
    incidentId: 'inc-k8s-2026-04',
    title: 'EKS CoreDNS Throttling & Socket Exhaustion on Checkout Pods',
    service: 'checkout-service',
    environment: 'production',
    severity: 'high',
    rootCause: 'Missing ndots:5 optimization in pod spec caused 5x DNS queries per external API call, overwhelming CoreDNS replicas.',
    resolution: 'Scaled CoreDNS pods from 3 to 10, enabled NodeLocal DNSCache via daemonset, and patched deployment spec with ndots:2.',
    engineer: {
      name: 'Sarah Chen',
      role: 'Cloud Architect',
      avatarInitials: 'SC',
    },
    timeToResolution: 22,
    businessImpact: 'Resolved 504 Gateway Timeouts across European checkout gateways.',
    recoverySuccessRate: 96.8,
    similarityScore: 84.5,
    relevanceBadge: 'High Similarity',
    createdAt: '2026-04-02T11:15:00Z',
    lastUsedAt: '2026-06-28T09:45:00Z',
    useCount: 8,
    tags: ['kubernetes', 'dns', 'coredns', 'checkout', 'network'],
    runbookUrl: 'https://runbooks.internal/eks-dns-throttling',
  },
  {
    id: 'mem-003',
    incidentId: 'inc-pg-2026-02',
    title: 'PostgreSQL RDS Deadlock Storm on Order Status Updates',
    service: 'order-processor',
    environment: 'production',
    severity: 'critical',
    rootCause: 'Concurrent batch invoicing job acquired exclusive row locks in reverse primary key order compared to real-time checkout webhooks.',
    resolution: 'Terminated blocking PID tree via pg_stat_activity, disabled background invoice cron, and deployed hotfix sorting lock acquisition by order_id ASC.',
    engineer: {
      name: 'Marcus Vance',
      role: 'Database Lead',
      avatarInitials: 'MV',
    },
    timeToResolution: 18,
    businessImpact: 'Restored order confirmation emails and unblocked 4,200 pending transactions.',
    recoverySuccessRate: 98.0,
    similarityScore: 78.1,
    relevanceBadge: 'Related Service',
    createdAt: '2026-02-19T16:40:00Z',
    lastUsedAt: '2026-06-15T18:10:00Z',
    useCount: 11,
    tags: ['postgres', 'rds', 'deadlock', 'database', 'orders'],
    runbookUrl: 'https://runbooks.internal/rds-deadlock-remediation',
  },
  {
    id: 'mem-004',
    incidentId: 'inc-kafka-2026-05',
    title: 'Kafka Consumer Group Lag Spike on Notification Topic',
    service: 'notification-worker',
    environment: 'production',
    severity: 'medium',
    rootCause: 'Poison pill message with malformed JSON payload caused unhandled deserialization exception in Kafka listener loop.',
    resolution: 'Configured Dead Letter Queue (DLQ) topic routing in application.properties and restarted consumer pods with auto.offset.reset=latest.',
    engineer: {
      name: 'Priya Patel',
      role: 'Staff SRE',
      avatarInitials: 'PP',
    },
    timeToResolution: 12,
    businessImpact: 'Cleared 180k queued push notifications without dropping valid messages.',
    recoverySuccessRate: 100.0,
    similarityScore: 71.4,
    relevanceBadge: 'Structural Match',
    createdAt: '2026-05-11T13:20:00Z',
    lastUsedAt: '2026-06-30T11:00:00Z',
    useCount: 9,
    tags: ['kafka', 'messaging', 'consumer-lag', 'notifications', 'dlq'],
    runbookUrl: 'https://runbooks.internal/kafka-dlq-routing',
  },
  {
    id: 'mem-005',
    incidentId: 'inc-auth-2026-01',
    title: 'Auth0 JWT Token Verification Latency & JWKS Cache Miss',
    service: 'auth-gateway',
    environment: 'production',
    severity: 'high',
    rootCause: 'Aggressive JWKS public key rotation combined with 60s cache TTL caused thundering herd HTTP requests to Auth0 /.well-known/jwks.json.',
    resolution: 'Increased in-memory JWKS cache TTL to 24 hours with stale-while-revalidate background fetching.',
    engineer: {
      name: 'David Kim',
      role: 'Security SRE',
      avatarInitials: 'DK',
    },
    timeToResolution: 25,
    businessImpact: 'Eliminated 3.2s login latency spikes across web and mobile clients.',
    recoverySuccessRate: 95.5,
    similarityScore: 68.9,
    relevanceBadge: 'Related Service',
    createdAt: '2026-01-28T09:10:00Z',
    lastUsedAt: '2026-06-10T15:30:00Z',
    useCount: 6,
    tags: ['auth', 'jwt', 'jwks', 'security', 'latency'],
    runbookUrl: 'https://runbooks.internal/auth-jwks-caching',
  },
  {
    id: 'mem-006',
    incidentId: 'inc-istio-2026-04',
    title: 'Istio Service Mesh Envoy Proxy Memory Leak on 503 Retries',
    service: 'api-gateway',
    environment: 'production',
    severity: 'high',
    rootCause: 'VirtualService retry budget set to 10 with no exponential backoff caused retry amplification storm during transient backend hiccups.',
    resolution: 'Patched Istio VirtualService spec with retry budget maxRetries: 2 and perTryTimeout: 2s, restarted Envoy sidecars.',
    engineer: {
      name: 'Alex Rivera',
      role: 'Principal SRE',
      avatarInitials: 'AR',
    },
    timeToResolution: 20,
    businessImpact: 'Stabilized API ingress cluster CPU usage from 98% to 32%.',
    recoverySuccessRate: 97.2,
    similarityScore: 65.0,
    relevanceBadge: 'Structural Match',
    createdAt: '2026-04-18T14:50:00Z',
    lastUsedAt: '2026-06-22T08:15:00Z',
    useCount: 7,
    tags: ['istio', 'envoy', 'service-mesh', 'retries', 'gateway'],
    runbookUrl: 'https://runbooks.internal/istio-retry-tuning',
  },
  {
    id: 'mem-007',
    incidentId: 'inc-redis-2025-11',
    title: 'Redis Connection Pool Starvation from Long-Lived Transactions',
    service: 'payment-api',
    environment: 'production',
    severity: 'high',
    rootCause: 'Spring Boot Lettuce connector connection pool size exceeded Redis maxclients limit during Black Friday flash sale traffic.',
    resolution: 'Tuned Lettuce connection pool max-active=50, min-idle=10, and enabled Redis tcp-keepalive 60 in redis.conf.',
    engineer: {
      name: 'Marcus Vance',
      role: 'Database Lead',
      avatarInitials: 'MV',
    },
    timeToResolution: 19,
    businessImpact: 'Prevented connection drop errors during peak transaction processing.',
    recoverySuccessRate: 94.0,
    similarityScore: 91.5,
    relevanceBadge: 'High Similarity',
    createdAt: '2025-11-28T20:10:00Z',
    lastUsedAt: '2026-05-14T12:00:00Z',
    useCount: 12,
    tags: ['redis', 'connection-pool', 'payment', 'lettuce', 'starvation'],
    runbookUrl: 'https://runbooks.internal/redis-pool-tuning',
  },
  {
    id: 'mem-008',
    incidentId: 'inc-s3-2026-03',
    title: 'AWS S3 Bucket Rate Limiting 503 Slow Down on Invoice Export',
    service: 'billing-service',
    environment: 'production',
    severity: 'medium',
    rootCause: 'Sequential invoice PDF uploads used identical date-based prefix structure (/2026-03-01/inv_*.pdf), triggering S3 partition throttling.',
    resolution: 'Introduced 4-character random hex hash prefix before filename (/a1f9/2026-03-01/inv_*.pdf) to distribute PUT operations across S3 partitions.',
    engineer: {
      name: 'Sarah Chen',
      role: 'Cloud Architect',
      avatarInitials: 'SC',
    },
    timeToResolution: 30,
    businessImpact: 'Eliminated 503 errors and accelerated monthly invoice generation 4x.',
    recoverySuccessRate: 99.0,
    similarityScore: 58.3,
    relevanceBadge: 'Structural Match',
    createdAt: '2026-03-01T04:20:00Z',
    lastUsedAt: '2026-06-01T06:10:00Z',
    useCount: 5,
    tags: ['aws', 's3', 'throttling', 'billing', 'storage'],
    runbookUrl: 'https://runbooks.internal/s3-prefix-sharding',
  },
  {
    id: 'mem-009',
    incidentId: 'inc-es-2026-05',
    title: 'Elasticsearch Cluster Red Status from Disk Watermark Breach',
    service: 'search-engine',
    environment: 'production',
    severity: 'high',
    rootCause: 'Unmanaged application log indexing exceeded 95% flood_stage disk watermark, locking all Elasticsearch indices into read-only mode.',
    resolution: 'Executed Index Lifecycle Management (ILM) policy purging logs older than 7 days, resized EBS volumes to 2TB, and removed read_only_allow_delete block.',
    engineer: {
      name: 'Priya Patel',
      role: 'Staff SRE',
      avatarInitials: 'PP',
    },
    timeToResolution: 26,
    businessImpact: 'Restored catalog search indexing across e-commerce storefronts.',
    recoverySuccessRate: 97.5,
    similarityScore: 62.1,
    relevanceBadge: 'Related Service',
    createdAt: '2026-05-20T17:30:00Z',
    lastUsedAt: '2026-06-25T14:00:00Z',
    useCount: 9,
    tags: ['elasticsearch', 'disk-full', 'ilm', 'search', 'ebs'],
    runbookUrl: 'https://runbooks.internal/es-watermark-recovery',
  },
  {
    id: 'mem-010',
    incidentId: 'inc-eks-2026-06',
    title: 'EKS Node Group OOMKiller Eviction on Memory Leak Service',
    service: 'analytics-worker',
    environment: 'production',
    severity: 'critical',
    rootCause: 'Node.js heap dump stream buffer leak in data aggregation worker caused Linux kernel OOMKiller to terminate kubelet daemon.',
    resolution: 'Enforced Kubernetes memory limits (limits.memory=2Gi), configured Node.js --max-old-space-size=1536, and isolated analytics workers to dedicated taint nodes.',
    engineer: {
      name: 'Alex Rivera',
      role: 'Principal SRE',
      avatarInitials: 'AR',
    },
    timeToResolution: 16,
    businessImpact: 'Prevented cascading node failures across general compute pool.',
    recoverySuccessRate: 98.8,
    similarityScore: 88.0,
    relevanceBadge: 'High Similarity',
    createdAt: '2026-06-04T10:15:00Z',
    lastUsedAt: '2026-07-01T16:45:00Z',
    useCount: 10,
    tags: ['kubernetes', 'oomkiller', 'nodejs', 'analytics', 'memory-leak'],
    runbookUrl: 'https://runbooks.internal/eks-oomkiller-triage',
  },
  {
    id: 'mem-011',
    incidentId: 'inc-cdn-2026-04',
    title: 'Cloudflare CDN Cache Poisoning & Stale JS Bundle Serving',
    service: 'frontend-app',
    environment: 'production',
    severity: 'medium',
    rootCause: 'Webpack asset hash collision during rollback caused CDN edge nodes to serve cached index.html referencing deleted chunk hashes.',
    resolution: 'Executed Cloudflare API cache purge by URL tag, enforced cache-control: no-cache on HTML files, and updated CI/CD immutable bundle hashing.',
    engineer: {
      name: 'David Kim',
      role: 'Security SRE',
      avatarInitials: 'DK',
    },
    timeToResolution: 11,
    businessImpact: 'Resolved blank page loading errors for 12,000 active web users.',
    recoverySuccessRate: 100.0,
    similarityScore: 54.2,
    relevanceBadge: 'Structural Match',
    createdAt: '2026-04-25T09:00:00Z',
    lastUsedAt: '2026-06-18T11:20:00Z',
    useCount: 4,
    tags: ['cdn', 'cloudflare', 'caching', 'frontend', 'bundle'],
    runbookUrl: 'https://runbooks.internal/cdn-cache-invalidation',
  },
  {
    id: 'mem-012',
    incidentId: 'inc-pg-2025-10',
    title: 'PostgreSQL Connection Exhaustion from Lambda Cold Starts',
    service: 'order-processor',
    environment: 'production',
    severity: 'high',
    rootCause: 'Uncached RDS database connection instantiation inside AWS Lambda handler caused 500 concurrent connections during marketing notification blast.',
    resolution: 'Deployed AWS RDS Proxy between Lambda functions and database cluster with connection multiplexing enabled.',
    engineer: {
      name: 'Marcus Vance',
      role: 'Database Lead',
      avatarInitials: 'MV',
    },
    timeToResolution: 21,
    businessImpact: 'Stabilized RDS connection count at 45 and eliminated 500 internal server errors.',
    recoverySuccessRate: 99.1,
    similarityScore: 82.3,
    relevanceBadge: 'High Similarity',
    createdAt: '2025-10-14T15:40:00Z',
    lastUsedAt: '2026-05-28T10:10:00Z',
    useCount: 13,
    tags: ['postgres', 'rds-proxy', 'lambda', 'serverless', 'connections'],
    runbookUrl: 'https://runbooks.internal/rds-proxy-setup',
  },
];

// ─── Pre-loaded AI Reflections ─────────────────────────────────────────────

let reflectionsStore: AIReflection[] = [
  {
    id: 'ref-001',
    incidentId: 'inc-redis-2026-03',
    incidentTitle: 'Redis ElastiCache OOM Eviction Storm during High Traffic',
    service: 'payment-api',
    whatHappened: 'Volatile memory fragmentation reached 100% capacity during checkout traffic spike following deployment v4.8.2.',
    whyItHappened: 'An unindexed session query introduced in v4.8.2 bypassed Redis key expiration policies, causing memory accumulation without eviction headroom.',
    recommendationAccuracy: 'Correct',
    whatToRemember: 'Redis memory failures on payment-api almost always correlate with recent application deployments rather than hardware faults.',
    whatToImproveNextTime: 'Always verify application rollback candidates (v4.8.1) before attempting destructive Redis cluster reboots or networking checks.',
    summary: 'Redis memory evictions on payment-api are primarily driven by unindexed queries in new releases. Prioritize rollback over cluster restarts.',
    tags: ['redis', 'deployment-rollback', 'oom-eviction', 'payment-api'],
    isPinned: true,
    createdAt: '2026-03-14T09:00:00Z',
    author: 'Groq Qwen3-32B LPU',
  },
  {
    id: 'ref-002',
    incidentId: 'inc-k8s-2026-04',
    incidentTitle: 'EKS CoreDNS Throttling & Socket Exhaustion on Checkout Pods',
    service: 'checkout-service',
    whatHappened: 'CoreDNS query latency degraded to 450ms, causing cascading 504 timeouts across checkout API calls.',
    whyItHappened: 'Default Kubernetes ndots:5 configuration amplified external domain resolutions by 5x, overwhelming DNS pod socket tables.',
    recommendationAccuracy: 'Correct',
    whatToRemember: 'DNS throttling in EKS is a structural configuration flaw, not an infrastructure capacity issue.',
    whatToImproveNextTime: 'Automatically recommend deploying NodeLocal DNSCache daemonsets whenever CoreDNS query rates exceed 5,000 qps.',
    summary: 'EKS DNS latency spikes require patching ndots:2 and NodeLocal DNSCache rather than merely scaling CoreDNS replicas.',
    tags: ['kubernetes', 'coredns', 'ndots', 'nodelocal'],
    isPinned: true,
    createdAt: '2026-04-02T12:00:00Z',
    author: 'Groq Qwen3-32B LPU',
  },
  {
    id: 'ref-003',
    incidentId: 'inc-pg-2026-02',
    incidentTitle: 'PostgreSQL RDS Deadlock Storm on Order Status Updates',
    service: 'order-processor',
    whatHappened: 'Database transaction throughput dropped to zero due to mutually exclusive row lock cycles.',
    whyItHappened: 'Batch invoice jobs acquired locks in descending order while webhooks acquired locks in ascending order.',
    recommendationAccuracy: 'Partially Correct',
    whatToRemember: 'Deadlocks in order-processor require inspecting active background cron jobs before terminating webhooks.',
    whatToImproveNextTime: 'Include SQL queries for pg_stat_activity blocking tree visualization directly in the initial immediate mitigations plan.',
    summary: 'PostgreSQL deadlocks on order tables stem from conflicting lock hierarchies between batch crons and real-time webhooks.',
    tags: ['postgres', 'deadlocks', 'lock-ordering', 'order-processor'],
    isPinned: false,
    createdAt: '2026-02-19T17:15:00Z',
    author: 'Hindsight Autonomous Engine',
  },
  {
    id: 'ref-004',
    incidentId: 'inc-eks-2026-06',
    incidentTitle: 'EKS Node Group OOMKiller Eviction on Memory Leak Service',
    service: 'analytics-worker',
    whatHappened: 'Linux kernel OOMKiller terminated kubelet daemons across 4 worker nodes.',
    whyItHappened: 'Node.js analytics workers lacked Kubernetes memory limits and --max-old-space-size V8 flags, consuming 100% node RAM.',
    recommendationAccuracy: 'Correct',
    whatToRemember: 'Uncapped Node.js workers will take down entire EKS worker nodes if Kubernetes memory limits are omitted.',
    whatToImproveNextTime: 'Instantly check container spec limits.memory whenever node eviction alerts fire.',
    summary: 'Node.js memory leaks must be contained via Kubernetes limits and V8 heap flags to prevent node-level OOMKiller panics.',
    tags: ['kubernetes', 'oomkiller', 'nodejs-heap', 'container-limits'],
    isPinned: true,
    createdAt: '2026-06-04T11:00:00Z',
    author: 'Groq Qwen3-32B LPU',
  },
];

// ─── Pre-loaded Engineer Feedback ──────────────────────────────────────────

let feedbackStore: EngineerFeedback[] = [
  {
    id: 'fb-001',
    incidentId: 'inc-redis-2026-03',
    recommendationId: 'step-1',
    engineerId: 'eng-101',
    engineerName: 'Alex Rivera (Principal SRE)',
    rating: 'Correct',
    comment: 'Spot on. Rolling back deployment v4.8.1 immediately cleared the unindexed cache query and stopped the OOM evictions. Saved us at least 20 minutes of blind Redis troubleshooting.',
    timestamp: '2026-03-14T08:50:00Z',
    appliedToMemory: true,
  },
  {
    id: 'fb-002',
    incidentId: 'inc-k8s-2026-04',
    recommendationId: 'step-2',
    engineerId: 'eng-102',
    engineerName: 'Sarah Chen (Cloud Architect)',
    rating: 'Helpful',
    comment: 'Scaling CoreDNS bought us time, but the real fix was setting ndots:2 in the pod spec as recommended in follow-up step 3. High accuracy.',
    timestamp: '2026-04-02T11:40:00Z',
    appliedToMemory: true,
  },
  {
    id: 'fb-003',
    incidentId: 'inc-pg-2026-02',
    recommendationId: 'step-1',
    engineerId: 'eng-103',
    engineerName: 'Marcus Vance (Database Lead)',
    rating: 'Correct',
    comment: 'Terminating the blocking PID tree via pg_stat_activity immediately unblocked order processing. Great diagnostic.',
    timestamp: '2026-02-19T17:00:00Z',
    appliedToMemory: true,
  },
];

// ─── Public Client Accessors & Modifiers ───────────────────────────────────

export function getHistoricalMemories(): HistoricalMemory[] {
  return historicalMemoriesStore;
}

export function getHistoricalMemoryById(id: string): HistoricalMemory | undefined {
  return historicalMemoriesStore.find((m) => m.id === id || m.incidentId === id);
}

export function getAIReflections(): AIReflection[] {
  return reflectionsStore;
}

export function getEngineerFeedback(): EngineerFeedback[] {
  return feedbackStore;
}

export function storeAIReflection(reflection: Omit<AIReflection, 'id' | 'createdAt'>): AIReflection {
  const newRef: AIReflection = {
    ...reflection,
    id: `ref-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
  };
  reflectionsStore = [newRef, ...reflectionsStore];
  return newRef;
}

export function storeEngineerFeedback(feedback: Omit<EngineerFeedback, 'id' | 'timestamp' | 'appliedToMemory'>): EngineerFeedback {
  const newFb: EngineerFeedback = {
    ...feedback,
    id: `fb-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    appliedToMemory: true,
  };
  feedbackStore = [newFb, ...feedbackStore];

  // Dynamically boost recovery success rate & use count on the matched memory
  const matchedMem = historicalMemoriesStore.find((m) => m.incidentId === feedback.incidentId || m.id === feedback.incidentId);
  if (matchedMem) {
    matchedMem.useCount += 1;
    matchedMem.lastUsedAt = new Date().toISOString();
    if (feedback.rating === 'Correct' || feedback.rating === 'Helpful') {
      matchedMem.recoverySuccessRate = Math.min(100, Number((matchedMem.recoverySuccessRate + 0.4).toFixed(1)));
    }
  }

  return newFb;
}

export function getMemoryTimelineEvents(): MemoryTimelineEvent[] {
  return [
    {
      id: 'time-1',
      incidentId: 'inc-redis-2026-03',
      title: 'Incident Anomaly Detected on Payment API',
      timestamp: '2026-03-14T08:15:00Z',
      stage: 'Incident Created',
      description: 'Telemetry monitors alerted on 100% Redis memory saturation and connection pool timeouts.',
      actor: 'Datadog Telemetry Monitor',
    },
    {
      id: 'time-2',
      incidentId: 'inc-redis-2026-03',
      title: 'Groq Qwen3-32B Autonomous Triage Initiated',
      timestamp: '2026-03-14T08:16:12Z',
      stage: 'AI Analysis',
      description: 'Synthesized 1,420 log lines and ElastiCache metrics; identified volatile-lru eviction storm.',
      actor: 'Groq Qwen3-32B LPU',
    },
    {
      id: 'time-3',
      incidentId: 'inc-redis-2026-03',
      title: 'Hindsight Memory Retrieved (98.2% Match)',
      timestamp: '2026-03-14T08:16:15Z',
      stage: 'Memory Retrieved',
      description: 'Recalled 4 previous Redis OOM outages correlated with recent unindexed query deployments.',
      actor: 'Hindsight Memory Service',
    },
    {
      id: 'time-4',
      incidentId: 'inc-redis-2026-03',
      title: 'Engineer Executed Rollback & Failover',
      timestamp: '2026-03-14T08:22:00Z',
      stage: 'Engineer Action',
      description: 'Alex Rivera executed kubectl rollout undo deployment/payment-api and ElastiCache test-failover.',
      actor: 'Alex Rivera (Principal SRE)',
    },
    {
      id: 'time-5',
      incidentId: 'inc-redis-2026-03',
      title: 'Incident Resolved & Verified Healthy',
      timestamp: '2026-03-14T08:29:00Z',
      stage: 'Final Resolution',
      description: 'Memory utilization dropped to 38%, checkout error rate returned to 0.00%. MTTR: 14 mins.',
      actor: 'Alex Rivera (Principal SRE)',
    },
    {
      id: 'time-6',
      incidentId: 'inc-redis-2026-03',
      title: 'Autonomous Reflection Generated',
      timestamp: '2026-03-14T08:30:10Z',
      stage: 'Reflection Generated',
      description: 'AI synthesized root cause pattern: "Prioritize application rollback over cluster reboots during Redis OOMs."',
      actor: 'Groq Qwen3-32B LPU',
    },
    {
      id: 'time-7',
      incidentId: 'inc-redis-2026-03',
      title: 'Institutional Memory Stored & Indexed',
      timestamp: '2026-03-14T08:30:15Z',
      stage: 'Memory Stored',
      description: 'Vector embedding stored in Hindsight library with 99.4% confidence weight for future outages.',
      actor: 'Hindsight Memory Service',
    },
  ];
}

export function getKnowledgeGraphData(): { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] } {
  const nodes: KnowledgeGraphNode[] = [
    // Services
    { id: 'svc-payment', label: 'payment-api', type: 'service', color: '#3B82F6', size: 48 },
    { id: 'svc-checkout', label: 'checkout-service', type: 'service', color: '#3B82F6', size: 42 },
    { id: 'svc-orders', label: 'order-processor', type: 'service', color: '#3B82F6', size: 42 },
    { id: 'svc-analytics', label: 'analytics-worker', type: 'service', color: '#3B82F6', size: 36 },

    // Incidents
    { id: 'inc-1', label: 'Redis OOM Eviction Storm', type: 'incident', color: '#EF4444', size: 40 },
    { id: 'inc-2', label: 'EKS CoreDNS Throttling', type: 'incident', color: '#F59E0B', size: 38 },
    { id: 'inc-3', label: 'PostgreSQL Deadlock Storm', type: 'incident', color: '#EF4444', size: 38 },
    { id: 'inc-4', label: 'Node.js Heap OOMKiller', type: 'incident', color: '#EF4444', size: 36 },

    // Root Causes
    { id: 'rc-unindexed', label: 'Unindexed Session Query', type: 'rootCause', color: '#8B5CF6', size: 34 },
    { id: 'rc-ndots', label: 'Missing ndots:2 Optimization', type: 'rootCause', color: '#8B5CF6', size: 34 },
    { id: 'rc-lockorder', label: 'Conflicting Lock Ordering', type: 'rootCause', color: '#8B5CF6', size: 34 },
    { id: 'rc-memoryleak', label: 'Buffer Stream Memory Leak', type: 'rootCause', color: '#8B5CF6', size: 34 },

    // Engineers
    { id: 'eng-alex', label: 'Alex Rivera (SRE)', type: 'engineer', color: '#10B981', size: 36 },
    { id: 'eng-sarah', label: 'Sarah Chen (Cloud)', type: 'engineer', color: '#10B981', size: 36 },
    { id: 'eng-marcus', label: 'Marcus Vance (DBA)', type: 'engineer', color: '#10B981', size: 36 },

    // Runbooks
    { id: 'rb-redis', label: 'Redis OOM Runbook', type: 'runbook', color: '#06B6D4', size: 32 },
    { id: 'rb-dns', label: 'EKS DNS Tuning Runbook', type: 'runbook', color: '#06B6D4', size: 32 },
    { id: 'rb-deadlock', label: 'RDS Deadlock Runbook', type: 'runbook', color: '#06B6D4', size: 32 },
  ];

  const edges: KnowledgeGraphEdge[] = [
    { id: 'e1', source: 'inc-1', target: 'svc-payment', label: 'impacts', animated: true },
    { id: 'e2', source: 'inc-1', target: 'rc-unindexed', label: 'caused by' },
    { id: 'e3', source: 'inc-1', target: 'eng-alex', label: 'resolved by' },
    { id: 'e4', source: 'inc-1', target: 'rb-redis', label: 'remediated via' },

    { id: 'e5', source: 'inc-2', target: 'svc-checkout', label: 'impacts', animated: true },
    { id: 'e6', source: 'inc-2', target: 'rc-ndots', label: 'caused by' },
    { id: 'e7', source: 'inc-2', target: 'eng-sarah', label: 'resolved by' },
    { id: 'e8', source: 'inc-2', target: 'rb-dns', label: 'remediated via' },

    { id: 'e9', source: 'inc-3', target: 'svc-orders', label: 'impacts', animated: true },
    { id: 'e10', source: 'inc-3', target: 'rc-lockorder', label: 'caused by' },
    { id: 'e11', source: 'inc-3', target: 'eng-marcus', label: 'resolved by' },
    { id: 'e12', source: 'inc-3', target: 'rb-deadlock', label: 'remediated via' },

    { id: 'e13', source: 'inc-4', target: 'svc-analytics', label: 'impacts' },
    { id: 'e14', source: 'inc-4', target: 'rc-memoryleak', label: 'caused by' },
    { id: 'e15', source: 'inc-4', target: 'eng-alex', label: 'resolved by' },
  ];

  return { nodes, edges };
}

export function getMemoryAnalytics(): MemoryAnalyticsData {
  return {
    totalMemories: 48,
    reflectionCount: 142,
    successfulRecoveriesPercent: 97.8,
    averageSimilarityScore: 86.4,
    mostCommonRootCause: 'Unindexed Query & Memory Eviction',
    mostFrequentlyUsedRunbook: 'Redis OOM & ElastiCache Failover',
    topLearningTopics: [
      { topic: 'Redis Memory & Connection Pooling', count: 18, percentage: 37.5 },
      { topic: 'Kubernetes EKS & CoreDNS Throttling', count: 12, percentage: 25.0 },
      { topic: 'PostgreSQL RDS Deadlocks & Locking', count: 9, percentage: 18.8 },
      { topic: 'Kafka Consumer Lag & DLQ Routing', count: 5, percentage: 10.4 },
      { topic: 'Istio Service Mesh & Envoy Retries', count: 4, percentage: 8.3 },
    ],
    knowledgeGrowthSeries: [
      { date: 'Jan 2026', memories: 12, reflections: 34 },
      { date: 'Feb 2026', memories: 21, reflections: 58 },
      { date: 'Mar 2026', memories: 32, reflections: 89 },
      { date: 'Apr 2026', memories: 39, reflections: 112 },
      { date: 'May 2026', memories: 44, reflections: 128 },
      { date: 'Jun 2026', memories: 48, reflections: 142 },
    ],
  };
}
