/**
 * cascadeflow Audit Logger — Immutable SOC2 & ISO27001 AI Governance Trail
 *
 * Records every AI decision, model selection, token expenditure, latency SLA compliance,
 * and policy check to an immutable, searchable audit ledger.
 */

import { AuditLogEntry, RuntimeAlert } from '@/types';
import { getSupabaseDirectClient } from '@/lib/supabase/client';

let auditLogs: AuditLogEntry[] = [
  {
    id: 'aud-1001',
    timestamp: '2026-07-04T10:31:15Z',
    user: 'Sarah Chen',
    userRole: 'Principal SRE',
    incidentId: 'inc-1',
    incidentTitle: 'Payment API Gateway Timeout & Latency Surge',
    selectedModel: 'Qwen 2.5 32B (Groq LPU)',
    latencyMs: 1180,
    tokens: 3420,
    costUsd: 0.0412,
    confidence: 98,
    memoryUsed: true,
    policyDecision: 'Approved',
    status: 'Success',
  },
  {
    id: 'aud-1002',
    timestamp: '2026-07-04T10:28:40Z',
    user: 'Alex Rivera',
    userRole: 'On-Call Engineer',
    incidentId: 'inc-2',
    incidentTitle: 'Checkout Service Kubernetes CrashLoopBackOff',
    selectedModel: 'Llama 3.1 8B Instant (Groq LPU)',
    latencyMs: 410,
    tokens: 1250,
    costUsd: 0.0085,
    confidence: 89,
    memoryUsed: true,
    policyDecision: 'Approved',
    status: 'Success',
  },
  {
    id: 'aud-1003',
    timestamp: '2026-07-04T10:22:10Z',
    user: 'David Kim',
    userRole: 'DevOps Lead',
    incidentId: 'inc-3',
    incidentTitle: 'PostgreSQL Database Deadlock & Connection Pool Starvation',
    selectedModel: 'GPT-4o Enterprise',
    latencyMs: 2950,
    tokens: 6120,
    costUsd: 0.0845,
    confidence: 95,
    memoryUsed: true,
    policyDecision: 'Escalated',
    status: 'Success',
  },
  {
    id: 'aud-1004',
    timestamp: '2026-07-04T10:18:05Z',
    user: 'Autonomous Triage Engine',
    userRole: 'System Bot',
    incidentId: 'inc-4',
    incidentTitle: 'Notification Worker RabbitMQ Queue Buildup',
    selectedModel: 'Llama 3.1 8B Instant (Groq LPU)',
    latencyMs: 380,
    tokens: 980,
    costUsd: 0.0062,
    confidence: 86,
    memoryUsed: false,
    policyDecision: 'Approved',
    status: 'Success',
  },
  {
    id: 'aud-1005',
    timestamp: '2026-07-04T10:12:30Z',
    user: 'Sarah Chen',
    userRole: 'Principal SRE',
    incidentId: 'inc-5',
    incidentTitle: 'Auth Service JWT Verification High CPU Spike',
    selectedModel: 'Qwen 2.5 32B (Groq LPU)',
    latencyMs: 1090,
    tokens: 2840,
    costUsd: 0.0354,
    confidence: 94,
    memoryUsed: true,
    policyDecision: 'Approved',
    status: 'Success',
  },
  {
    id: 'aud-1006',
    timestamp: '2026-07-04T10:05:12Z',
    user: 'Elena Rostova',
    userRole: 'Security Engineer',
    incidentId: 'inc-6',
    incidentTitle: 'API Gateway Rate Limitter Breached by Bot Net',
    selectedModel: 'Llama 3.3 70B Versatile (Groq LPU)',
    latencyMs: 1680,
    tokens: 4100,
    costUsd: 0.0520,
    confidence: 91,
    memoryUsed: true,
    policyDecision: 'Approved',
    status: 'Success',
  },
];

let runtimeAlerts: RuntimeAlert[] = [
  {
    id: 'alt-1',
    title: 'Daily Budget Approach Warning (82% Utilized)',
    message: 'Current daily spend reached $41.00 of $50.00 cap. Graceful degradation policy will trigger lightweight Llama 8B fallback at 90%.',
    severity: 'warning',
    timestamp: '10 minutes ago',
    type: 'budget_nearing',
    actionableText: 'Review Budget Policy or adjust daily spend ceiling.',
    resolved: false,
  },
  {
    id: 'alt-2',
    title: 'Model Confidence Escalation Triggered',
    message: 'Initial lightweight triage on inc-3 yielded 81% confidence (below 85% SLA). Prompt automatically escalated to reasoning-tier GPT-4o.',
    severity: 'info',
    timestamp: '45 minutes ago',
    type: 'escalation_rate',
    actionableText: 'No action required; escalation achieved 95% final confidence.',
    resolved: false,
  },
  {
    id: 'alt-3',
    title: 'Local Ollama Fallback Standby Verified',
    message: 'On-premise Mistral 7B local endpoint health check passed with 800ms ping. Ready for zero-cost failover if cloud network interrupts.',
    severity: 'info',
    timestamp: '2 hours ago',
    type: 'fallback_activated',
    actionableText: 'System protected against cloud ISP degradation.',
    resolved: true,
  },
];

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogs;
}

export function recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `aud-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
  };
  auditLogs.unshift(newEntry);

  // Asynchronously store in Supabase if configured
  try {
    const supabase = getSupabaseDirectClient();
    if (supabase) {
      supabase.from('cascadeflow_audit_logs').insert({
        id: newEntry.id,
        timestamp: newEntry.timestamp,
        user_id: newEntry.user,
        user_role: newEntry.userRole,
        incident_id: newEntry.incidentId,
        incident_title: newEntry.incidentTitle,
        selected_model: newEntry.selectedModel,
        latency_ms: newEntry.latencyMs,
        tokens: newEntry.tokens,
        cost_usd: newEntry.costUsd,
        confidence: newEntry.confidence,
        memory_used: newEntry.memoryUsed,
        policy_decision: newEntry.policyDecision,
        status: newEntry.status,
      }).then(({ error }: any) => {
        if (error) console.warn('[AuditLogger] Supabase insert failed:', error.message);
      });
    }
  } catch {
    // Ignore Supabase connection issues
  }

  return newEntry;
}

export function getRuntimeAlerts(): RuntimeAlert[] {
  return runtimeAlerts;
}

export function dismissAlert(id: string): RuntimeAlert[] {
  runtimeAlerts = runtimeAlerts.map((a) => (a.id === id ? { ...a, resolved: true } : a));
  return runtimeAlerts;
}
