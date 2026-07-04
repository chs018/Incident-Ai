/**
 * AI Error Handler & Retry Engine with Rich SRE Fallback Simulations
 *
 * Handles API retries with exponential backoff and provides hyper-realistic
 * production incident simulations when offline or unconfigured.
 */

import { AIAnalysis, Incident } from '@/types';

/**
 * Retries an async function with exponential backoff.
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      console.error('[AI Error Handler] Max retries exceeded. Throwing error.');
      throw error;
    }
    console.warn(`[AI Error Handler] Request failed, retrying in ${delayMs}ms... (${retries} left)`, error);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return withRetry(fn, retries - 1, delayMs * 2);
  }
}

/**
 * Generates a hyper-realistic Senior SRE investigation fallback when offline or unconfigured.
 */
export function getFallbackSimulation(incident: Incident, model: string): AIAnalysis {
  const isRedis = incident.title.toLowerCase().includes('redis') || incident.description.toLowerCase().includes('redis') || incident.service.includes('cache');
  const isK8s = incident.title.toLowerCase().includes('pod') || incident.title.toLowerCase().includes('crash') || incident.service.includes('checkout');
  const isDb = incident.title.toLowerCase().includes('db') || incident.title.toLowerCase().includes('database') || incident.title.toLowerCase().includes('deadlock');

  // Customize fallback based on incident type
  if (isDb) {
    return getDatabaseDeadlockSimulation(incident, model);
  } else if (isK8s) {
    return getK8sCrashLoopSimulation(incident, model);
  }

  // Default: Redis OOM & Gateway 503 Outage Simulation
  return {
    summary: `Payment API and 4 downstream services began returning HTTP 503 errors immediately after deployment v4.8.2. Redis session cache memory utilization saturated to 98.4%, causing worker thread pool exhaustion.`,
    rootCause: `Deployment v4.8.2 introduced unreferenced session key caching without TTL expiration, causing rapid heap exhaustion in the Redis primary cluster.`,
    impact: `Approximately 84,200 active checkout sessions disrupted across us-east-1 and eu-west-1, risking ~$14,500/min in gross transaction volume.`,
    affectedUsers: 84200,
    confidence: 96,
    recommendedActions: [
      'Rollback Kubernetes deployment payment-api to previous stable release v4.8.1',
      'Execute non-blocking memory purge on Redis primary cluster',
      'Scale worker replicas by +50% to process queued checkout backlog',
    ],
    relatedIncidents: ['INC-8492', 'INC-8104'],
    generatedAt: new Date().toISOString(),
    model: model || 'qwen-2.5-32b (simulated)',
    investigation: {
      observedSymptoms: [
        'Gateway API returning 503 Service Unavailable across us-east-1',
        'Redis memory utilization spiked from 42% to 98.4% within 3 minutes',
        'Kubernetes checkout-service pods experiencing OOMKilled evictions',
      ],
      evidence: [
        'Log line: FATAL [redis-pool] Connection timeout after 5000ms',
        'Metric: p99 latency increased by +840% to 5,200ms',
        'Deploy: v4.8.2 rollout initiated 4 minutes before alert storm',
      ],
      possibleRootCauses: [
        {
          id: 'rc-1',
          title: 'Redis Memory Leak in Session Cache (v4.8.2)',
          confidence: 96,
          evidence: ['Redis memory saturation at 98.4%', 'OOMKilled events on checkout workers'],
          explanation: 'The v4.8.2 release introduced unreferenced session key caching without TTL expiration, causing rapid heap exhaustion.',
          risk: 'Critical',
          reasoning: 'High confidence because memory exhaustion perfectly correlates with the exact timestamp of deployment v4.8.2.',
        },
        {
          id: 'rc-2',
          title: 'Database Connection Pool Starvation',
          confidence: 68,
          evidence: ['Connection timeout logs in payment gateway'],
          explanation: 'Downstream latency caused worker threads to hold DB connections open beyond configured timeouts.',
          risk: 'High',
          reasoning: 'Secondary symptom of the Redis slowdown cascading into postgres pools.',
        },
      ],
      supportingLogs: [
        "2026-07-04T11:42:01Z [ERROR] redis-client: OOM command not allowed when used memory > 'maxmemory'",
        '2026-07-04T11:42:15Z [FATAL] api-gateway: Upstream 503 Service Unavailable from payment-api',
      ],
      metricCorrelations: [
        { metric: 'Redis Memory Usage', observation: 'Spiked to 98.4% capacity', impact: 'Eviction of active user sessions' },
        { metric: 'API p99 Latency', observation: '5,200ms (SLA threshold 500ms)', impact: 'Checkout timeouts and cart abandonment' },
      ],
      missingInformation: [
        'Redis heap dump analysis for unexpired key prefixes',
        'Kubernetes node-level memory cgroup pressure stats',
      ],
      confidenceLevel: 96,
      reasoning: 'The synthesis of deployment timestamps, OOM logs, and metric correlation points conclusively to deployment v4.8.2.',
    },
    recommendations: [
      {
        id: 'rec-1',
        title: 'Rollback Kubernetes Deployment to v4.8.1',
        category: 'immediate',
        probability: 98,
        timeEst: '~2 mins',
        risk: 'Low',
        description: 'Immediately revert checkout-api and payment-api pods to the stable previous release tag.',
        command: 'kubectl rollout undo deployment/payment-api -n production',
        reasoning: 'Eliminates the faulty session caching logic instantly without data loss.',
      },
      {
        id: 'rec-2',
        title: 'Flush Expired Session Keys from Redis Cluster',
        category: 'immediate',
        probability: 89,
        timeEst: '~1 min',
        risk: 'Medium',
        description: 'Execute non-blocking memory cleanup on Redis primary nodes to relieve heap pressure.',
        command: 'redis-cli -h prod-redis.internal memory purge',
        reasoning: 'Frees saturated RAM to allow healthy traffic processing post-rollback.',
      },
      {
        id: 'rec-3',
        title: 'Scale Kubernetes Replicas to Handle Backlog',
        category: 'recommended',
        probability: 95,
        timeEst: '~3 mins',
        risk: 'Low',
        description: 'Temporarily increase replica count by 50% to process queued checkout requests.',
        command: 'kubectl scale deployment/payment-api --replicas=24 -n production',
        reasoning: 'Prevents secondary traffic surge from overwhelming newly restarted pods.',
      },
    ],
    commands: [
      {
        id: 'cmd-1',
        command: 'kubectl rollout undo deployment/payment-api -n production',
        description: 'Revert payment-api deployment to previous stable revision',
        category: 'kubernetes',
        risk: 'Low',
        syntaxLang: 'bash',
      },
      {
        id: 'cmd-2',
        command: 'redis-cli -h prod-redis.internal info memory | grep used_memory_human',
        description: 'Check current live memory saturation on Redis primary',
        category: 'redis',
        risk: 'Low',
        syntaxLang: 'bash',
      },
      {
        id: 'cmd-3',
        command: 'kubectl logs -l app=payment-api --tail=100 -n production | grep -i oom',
        description: 'Filter recent fatal OOM logs across all worker pods',
        category: 'kubernetes',
        risk: 'Low',
        syntaxLang: 'bash',
      },
    ],
    report: {
      incidentId: incident.id,
      title: `Executive Outage Report: ${incident.title}`,
      summary: `A critical P0 outage occurred in the production environment affecting payment-api and 4 downstream services due to memory saturation.`,
      rootCause: `Deployment v4.8.2 introduced an unreferenced session caching bug without TTL expiration in Redis.`,
      businessImpact: `Approximately 84,200 active checkout sessions were disrupted, risking ~$14,500/min in gross transaction volume.`,
      recoveryTimeline: [
        { time: '11:40 UTC', event: 'Deployment v4.8.2 rollout completed to production cluster.' },
        { time: '11:43 UTC', event: 'Datadog automated alert fired for Redis memory > 95%.' },
        { time: '11:45 UTC', event: 'AI Incident Commander identified session cache memory leak root cause.' },
        { time: '11:47 UTC', event: 'Rollback initiated via War Room quick command.' },
      ],
      lessonsLearned: [
        'Implement automated canary analysis to halt rollouts when cache memory slope exceeds 15%/min.',
        'Enforce mandatory TTL bounds on all Redis cache writes at the API gateway layer.',
      ],
      actionItems: [
        { task: 'Add mandatory TTL validation to cache wrapper library', owner: 'Backend SRE Team', priority: 'P0' },
        { task: 'Configure Kubernetes memory cgroup eviction alarms in PagerDuty', owner: 'DevOps Infrastructure', priority: 'P1' },
      ],
      generatedAt: new Date().toISOString(),
      confidence: 96,
      model: 'qwen-2.5-32b (simulated)',
    },
  };
}

function getDatabaseDeadlockSimulation(incident: Incident, model: string): AIAnalysis {
  return {
    summary: `Database deadlock storm detected on Primary Postgres cluster (pg-prod-01) affecting order-management and inventory-service. Transaction lock queues exceeded 400 waiting sessions.`,
    rootCause: `Concurrent batch update job in order-management acquired table locks in reverse order of checkout transaction flow, causing circular lock deadlocks.`,
    impact: `Order processing halted for 32,100 customers; order creation failure rate at 100%.`,
    affectedUsers: 32100,
    confidence: 94,
    recommendedActions: [
      'Terminate blocking batch PID 84920 on pg-prod-01 primary node',
      'Disable automated background inventory reconciliation cron job',
      'Restart order-management worker pool to clear orphaned connection handles',
    ],
    relatedIncidents: ['INC-7901'],
    generatedAt: new Date().toISOString(),
    model: model || 'qwen-2.5-32b (simulated)',
    investigation: {
      observedSymptoms: [
        'Postgres active connection pool reached 100% (500/500 max_connections)',
        'Order management service reporting SQLSTATE 40P01 deadlock detected',
        'Checkout latency degraded from 180ms to over 10,000ms timeout',
      ],
      evidence: [
        'Postgres log: ERROR: deadlock detected DETAIL: Process 84920 waits for ShareLock on transaction 91823',
        'Metric: DB Lock Wait Time increased by +1200%',
      ],
      possibleRootCauses: [
        {
          id: 'rc-db-1',
          title: 'Circular Table Lock in Order Reconciliation Cron',
          confidence: 94,
          evidence: ['SQLSTATE 40P01 errors in postgres logs', 'Lock wait queue > 400 sessions'],
          explanation: 'Background cron job locking inventory table before orders table while web checkouts lock orders before inventory.',
          risk: 'Critical',
          reasoning: 'Classic reverse-order acquisition deadlock confirmed by pg_locks graph.',
        },
      ],
      supportingLogs: [
        '2026-07-04T11:50:12Z [ERROR] postgres: deadlock detected; Process 84920 waits for ShareLock on transaction 91823',
        '2026-07-04T11:50:14Z [FATAL] order-management: PoolExhaustedException: Could not acquire JDBC connection',
      ],
      metricCorrelations: [
        { metric: 'Postgres Active Connections', observation: '500/500 saturated', impact: 'No new DB queries can execute' },
        { metric: 'Order Failure Rate', observation: '100% failure rate', impact: 'Zero revenue capture' },
      ],
      missingInformation: ['EXPLAIN ANALYZE execution plan for batch reconciliation query'],
      confidenceLevel: 94,
      reasoning: 'Exact SQLSTATE 40P01 error codes and PID lock graphs confirm circular deadlock.',
    },
    recommendations: [
      {
        id: 'rec-db-1',
        title: 'Terminate Blocking Postgres Backend PID',
        category: 'immediate',
        probability: 99,
        timeEst: '~30 secs',
        risk: 'Low',
        description: 'Kill the specific background batch worker query causing the circular deadlock.',
        command: "SELECT pg_terminate_backend(84920);",
        reasoning: 'Instantly breaks the deadlock cycle, allowing queued web transactions to drain.',
      },
    ],
    commands: [
      {
        id: 'cmd-db-1',
        command: "psql -h pg-prod-01 -U postgres -c 'SELECT pg_terminate_backend(84920);'",
        description: 'Terminate blocking deadlock query PID on primary database',
        category: 'database',
        risk: 'Low',
        syntaxLang: 'sql',
      },
    ],
  };
}

function getK8sCrashLoopSimulation(incident: Incident, model: string): AIAnalysis {
  return {
    summary: `Kubernetes deployment checkout-service in production is experiencing widespread CrashLoopBackOff across 12 pods. Liveness probes failing due to missing secret environment variable.`,
    rootCause: `Recent Helm chart release v2.1.0 omitted the mandatory STRIPE_SECRET_KEY reference in deployment envFrom spec, causing instant startup crashes.`,
    impact: `Checkout service completely unavailable; 100% of checkout requests returning 502 Bad Gateway.`,
    affectedUsers: 45000,
    confidence: 98,
    recommendedActions: [
      'Rollback Helm release checkout-service to revision 41 (v2.0.9)',
      'Verify Kubernetes secret payment-secrets exists in production namespace',
    ],
    relatedIncidents: ['INC-8104'],
    generatedAt: new Date().toISOString(),
    model: model || 'qwen-2.5-32b (simulated)',
    investigation: {
      observedSymptoms: [
        '12/12 pods in CrashLoopBackOff state in production namespace',
        'Liveness and readiness probes failing consistently after 3 seconds',
      ],
      evidence: [
        'Pod logs: Error: Missing required environment variable STRIPE_SECRET_KEY',
        'Helm history shows revision 42 deployed 5 minutes ago',
      ],
      possibleRootCauses: [
        {
          id: 'rc-k8s-1',
          title: 'Missing Environment Variable in Helm Chart v2.1.0',
          confidence: 98,
          evidence: ['Pod startup logs show Error: Missing required environment variable STRIPE_SECRET_KEY'],
          explanation: 'The v2.1.0 values.yaml refactoring dropped the secretKeyRef for Stripe authentication.',
          risk: 'Critical',
          reasoning: 'Deterministic error message in container logs matches exactly with Helm deployment timestamp.',
        },
      ],
      supportingLogs: [
        '2026-07-04T11:55:01Z [FATAL] checkout-service: Error: Missing required environment variable STRIPE_SECRET_KEY. Shutting down.',
      ],
      metricCorrelations: [
        { metric: 'K8s Pod Restart Count', observation: '+48 restarts in 3 mins', impact: 'Service completely down' },
      ],
      missingInformation: [],
      confidenceLevel: 98,
      reasoning: 'Container startup logs explicitly cite the missing environment variable.',
    },
    recommendations: [
      {
        id: 'rec-k8s-1',
        title: 'Rollback Helm Release to Stable Revision',
        category: 'immediate',
        probability: 99,
        timeEst: '~1 min',
        risk: 'Low',
        description: 'Revert checkout-service Helm chart to revision 41.',
        command: 'helm rollback checkout-service 41 -n production',
        reasoning: 'Restores the valid secretKeyRef configuration immediately.',
      },
    ],
    commands: [
      {
        id: 'cmd-k8s-1',
        command: 'helm rollback checkout-service 41 -n production',
        description: 'Rollback checkout-service Helm chart to revision 41',
        category: 'kubernetes',
        risk: 'Low',
        syntaxLang: 'bash',
      },
    ],
  };
}
