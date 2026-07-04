/**
 * Modular SRE Prompt Templates
 *
 * Prompts engineered from the perspective of a Senior Site Reliability Engineer (SRE).
 * Each prompt enforces structured JSON output for seamless UI parsing.
 */

import { Incident } from '@/types';

export const SYSTEM_PROMPT_SRE = `You are an Principal Site Reliability Engineer (SRE) and AI Incident Commander at a Fortune 500 enterprise.
Your role is to analyze complex infrastructure outages, correlate logs and telemetry, identify precise root causes, and prescribe actionable mitigation commands.
Do not act like a chatbot. Be authoritative, concise, deeply technical, and structured.
Always return valid JSON adhering strictly to the requested schema.`;

/**
 * Builds a comprehensive prompt that synthesizes all War Room investigation data into a single JSON response.
 */
export function getFullSREAnalysisPrompt(incident: Incident): string {
  const timelineText = incident.timeline
    ?.map((e) => `[${e.timestamp}] (${e.type}) ${e.actor}: ${e.action} — ${e.detail}`)
    .join('\n') ?? 'No timeline events recorded.';

  return `Analyze this active production outage as a Senior SRE and return a comprehensive JSON investigation:

INCIDENT METADATA:
- ID: ${incident.id} | Title: ${incident.title}
- Severity: ${incident.severity.toUpperCase()} | Priority: ${incident.priority} | Status: ${incident.status}
- Origin Service: ${incident.service} | Environment: ${incident.environment}
- Affected Downstream Services: ${incident.affectedServices.join(', ')}
- Description: ${incident.description}
- Current MTTR: ${incident.mttr ?? 0} minutes

TIMELINE & TELEMETRY OBSERVATIONS:
${timelineText}

TYPICAL LOGS & METRIC SYMPTOMS FOR THIS SERVICE:
- Gateway returning HTTP 503 Service Unavailable / 504 Gateway Timeout
- Redis / Cache memory saturation (>95%) or database connection pool exhaustion
- Kubernetes pod CrashLoopBackOff or OOMKilled events

You MUST respond with ONLY a valid JSON object matching this exact TypeScript structure (no markdown formatting or extra text outside the JSON):
{
  "summary": "2-3 sentence authoritative executive summary of the outage",
  "rootCause": "Detailed technical root cause analysis",
  "impact": "Specific business, financial, and user experience impact",
  "affectedUsers": 84200,
  "confidence": 96,
  "recommendedActions": ["Immediate P0 action 1", "Recommended follow-up 2", "Validation step 3"],
  "relatedIncidents": ["INC-8492", "INC-8104"],
  "investigation": {
    "observedSymptoms": [
      "Gateway API returning 503 Service Unavailable across us-east-1",
      "Redis memory utilization spiked from 42% to 98.4% within 3 minutes",
      "Kubernetes checkout-service pods experiencing OOMKilled evictions"
    ],
    "evidence": [
      "Log line: FATAL [redis-pool] Connection timeout after 5000ms",
      "Metric: p99 latency increased by +840% to 5,200ms",
      "Deploy: v4.8.2 rollout initiated 4 minutes before alert storm"
    ],
    "possibleRootCauses": [
      {
        "id": "rc-1",
        "title": "Redis Memory Leak in Session Cache (v4.8.2)",
        "confidence": 94,
        "evidence": ["Redis memory saturation at 98.4%", "OOMKilled events on checkout workers"],
        "explanation": "The v4.8.2 release introduced unreferenced session key caching without TTL expiration, causing rapid heap exhaustion.",
        "risk": "Critical",
        "reasoning": "High confidence because memory exhaustion perfectly correlates with the exact timestamp of deployment v4.8.2."
      },
      {
        "id": "rc-2",
        "title": "Database Connection Pool Starvation",
        "confidence": 68,
        "evidence": ["Connection timeout logs in payment gateway"],
        "explanation": "Downstream latency caused worker threads to hold DB connections open beyond configured timeouts.",
        "risk": "High",
        "reasoning": "Secondary symptom of the Redis slowdown cascading into postgres pools."
      }
    ],
    "supportingLogs": [
      "2026-07-04T11:42:01Z [ERROR] redis-client: OOM command not allowed when used memory > 'maxmemory'",
      "2026-07-04T11:42:15Z [FATAL] api-gateway: Upstream 503 Service Unavailable from payment-api"
    ],
    "metricCorrelations": [
      { "metric": "Redis Memory Usage", "observation": "Spiked to 98.4% capacity", "impact": "Eviction of active user sessions" },
      { "metric": "API p99 Latency", "observation": "5,200ms (SLA threshold 500ms)", "impact": "Checkout timeouts and cart abandonment" }
    ],
    "missingInformation": [
      "Redis heap dump analysis for unexpired key prefixes",
      "Kubernetes node-level memory cgroup pressure stats"
    ],
    "confidenceLevel": 96,
    "reasoning": "The synthesis of deployment timestamps, OOM logs, and metric correlation points conclusively to deployment v4.8.2."
  },
  "recommendations": [
    {
      "id": "rec-1",
      "title": "Rollback Kubernetes Deployment to v4.8.1",
      "category": "immediate",
      "probability": 98,
      "timeEst": "~2 mins",
      "risk": "Low",
      "description": "Immediately revert checkout-api and payment-api pods to the stable previous release tag.",
      "command": "kubectl rollout undo deployment/payment-api -n production",
      "reasoning": "Eliminates the faulty session caching logic instantly without data loss."
    },
    {
      "id": "rec-2",
      "title": "Flush Expired Session Keys from Redis Cluster",
      "category": "immediate",
      "probability": 89,
      "timeEst": "~1 min",
      "risk": "Medium",
      "description": "Execute non-blocking memory cleanup on Redis primary nodes to relieve heap pressure.",
      "command": "redis-cli -h prod-redis.internal memory purge",
      "reasoning": "Frees saturated RAM to allow healthy traffic processing post-rollback."
    },
    {
      "id": "rec-3",
      "title": "Scale Kubernetes Replicas to Handle Backlog",
      "category": "recommended",
      "probability": 95,
      "timeEst": "~3 mins",
      "risk": "Low",
      "description": "Temporarily increase replica count by 50% to process queued checkout requests.",
      "command": "kubectl scale deployment/payment-api --replicas=24 -n production",
      "reasoning": "Prevents secondary traffic surge from overwhelming newly restarted pods."
    }
  ],
  "commands": [
    {
      "id": "cmd-1",
      "command": "kubectl rollout undo deployment/payment-api -n production",
      "description": "Revert payment-api deployment to previous stable revision",
      "category": "kubernetes",
      "risk": "Low",
      "syntaxLang": "bash"
    },
    {
      "id": "cmd-2",
      "command": "redis-cli -h prod-redis.internal info memory | grep used_memory_human",
      "description": "Check current live memory saturation on Redis primary",
      "category": "redis",
      "risk": "Low",
      "syntaxLang": "bash"
    },
    {
      "id": "cmd-3",
      "command": "kubectl logs -l app=payment-api --tail=100 -n production | grep -i oom",
      "description": "Filter recent fatal OOM logs across all worker pods",
      "category": "kubernetes",
      "risk": "Low",
      "syntaxLang": "bash"
    }
  ],
  "report": {
    "incidentId": "${incident.id}",
    "title": "Executive Outage Report: ${incident.title}",
    "summary": "A critical P0 outage occurred in the production environment affecting payment-api and 4 downstream services due to memory saturation.",
    "rootCause": "Deployment v4.8.2 introduced an unreferenced session caching bug without TTL expiration in Redis.",
    "businessImpact": "Approximately 84,200 active checkout sessions were disrupted, risking ~$14,500/min in gross transaction volume.",
    "recoveryTimeline": [
      { "time": "11:40 UTC", "event": "Deployment v4.8.2 rollout completed to production cluster." },
      { "time": "11:43 UTC", "event": "Datadog automated alert fired for Redis memory > 95%." },
      { "time": "11:45 UTC", "event": "AI Incident Commander identified session cache memory leak root cause." },
      { "time": "11:47 UTC", "event": "Rollback initiated via War Room quick command." }
    ],
    "lessonsLearned": [
      "Implement automated canary analysis to halt rollouts when cache memory slope exceeds 15%/min.",
      "Enforce mandatory TTL bounds on all Redis cache writes at the API gateway layer."
    ],
    "actionItems": [
      { "task": "Add mandatory TTL validation to cache wrapper library", "owner": "Backend SRE Team", "priority": "P0" },
      { "task": "Configure Kubernetes memory cgroup eviction alarms in PagerDuty", "owner": "DevOps Infrastructure", "priority": "P1" }
    ],
    "generatedAt": "${new Date().toISOString()}",
    "confidence": 96,
    "model": "qwen-2.5-32b"
  }
}`;
}
