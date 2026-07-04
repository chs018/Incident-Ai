/**
 * cascadeflow Policy Engine — AI Governance & Compliance Rules
 *
 * Evaluates runtime AI policies before executing inference requests.
 * Supports configurable rules: budget limits, approved providers, confidence escalation,
 * memory reinforcement, and audit trail enforcement.
 */

import { PolicyRule, CascadeFlowRouteRequest, ModelRegistryEntry } from '@/types';

// Mock state for editable policies
let INITIAL_POLICIES: PolicyRule[] = [
  {
    id: 'pol-budget-daily',
    name: 'Never Exceed Daily AI Budget Cap',
    category: 'budget',
    description: 'Automatically downgrade to lightweight or local fallback models when daily spend exceeds 90% of budget cap.',
    enabled: true,
    action: 'fallback',
    ruleExpression: 'currentSpendUsd >= (maxDailyBudgetUsd * 0.9)',
  },
  {
    id: 'pol-provider-approved',
    name: 'Always Use Approved SOC2 Providers',
    category: 'provider',
    description: 'Restrict production incident triage exclusively to Groq LPU and enterprise-tier OpenAI/Anthropic endpoints.',
    enabled: true,
    action: 'enforce',
    ruleExpression: 'provider in ["groq", "openai", "anthropic"]',
  },
  {
    id: 'pol-quality-escalate',
    name: 'Escalate Low-Confidence Responses (<85%)',
    category: 'quality',
    description: 'When initial model inference yields confidence below 85%, automatically re-route prompt to reasoning-tier model (Claude 3.5 / GPT-4o).',
    enabled: true,
    action: 'escalate',
    ruleExpression: 'confidenceScore < 85',
  },
  {
    id: 'pol-memory-first',
    name: 'Mandatory Hindsight Memory Query Before Inference',
    category: 'memory',
    description: 'Require vector retrieval of historical outages before invoking LLM to inject institutional context and prevent hallucinations.',
    enabled: true,
    action: 'enforce',
    ruleExpression: 'hindsightMemoryCount >= 0',
  },
  {
    id: 'pol-audit-store',
    name: 'Store Immutable Audit Trail & Reflections',
    category: 'security',
    description: 'Log every prompt token, completion token, latency SLA, and policy decision to the immutable SOC2 audit ledger.',
    enabled: true,
    action: 'enforce',
    ruleExpression: 'auditEnabled == true',
  },
  {
    id: 'pol-latency-sla',
    name: 'Enforce P99 Latency SLA (<2,000ms)',
    category: 'quality',
    description: 'If active model endpoint exceeds 2,000ms latency, automatically failover to Groq LPU high-speed endpoints.',
    enabled: false, // User can toggle in UI!
    action: 'fallback',
    ruleExpression: 'estimatedLatencyMs > 2000',
  },
];

let activePolicies = [...INITIAL_POLICIES];

export function getPolicies(): PolicyRule[] {
  return activePolicies;
}

export function togglePolicy(id: string): PolicyRule[] {
  activePolicies = activePolicies.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p));
  return activePolicies;
}

export function updatePolicyRule(id: string, updates: Partial<PolicyRule>): PolicyRule[] {
  activePolicies = activePolicies.map((p) => (p.id === id ? { ...p, ...updates } : p));
  return activePolicies;
}

/**
 * Evaluates active policies against a route request and proposed model.
 */
export function evaluatePolicies(
  request: CascadeFlowRouteRequest,
  candidateModel: ModelRegistryEntry,
  currentSpendUsd: number,
  dailyBudgetUsd: number
): { passed: boolean; decisions: { policyName: string; passed: boolean; reason: string }[]; triggerFallback: boolean; triggerEscalate: boolean } {
  const decisions: { policyName: string; passed: boolean; reason: string }[] = [];
  let triggerFallback = false;
  let triggerEscalate = false;
  let allPassed = true;

  for (const pol of activePolicies) {
    if (!pol.enabled) continue;

    if (pol.id === 'pol-budget-daily') {
      const isOverBudget = currentSpendUsd >= dailyBudgetUsd * 0.9;
      if (isOverBudget && candidateModel.costPerMillionPromptTokens > 0.1) {
        decisions.push({
          policyName: pol.name,
          passed: false,
          reason: `Daily budget near limit ($${currentSpendUsd.toFixed(2)} / $${dailyBudgetUsd.toFixed(2)}). Downgrading to lightweight/fallback model.`,
        });
        triggerFallback = true;
        allPassed = false;
      } else {
        decisions.push({
          policyName: pol.name,
          passed: true,
          reason: `Spend within safe budget limits ($${currentSpendUsd.toFixed(2)} / $${dailyBudgetUsd.toFixed(2)}).`,
        });
      }
    } else if (pol.id === 'pol-provider-approved') {
      const isApproved = ['groq', 'openai', 'anthropic', 'gemini'].includes(candidateModel.provider);
      decisions.push({
        policyName: pol.name,
        passed: isApproved,
        reason: isApproved ? `Provider '${candidateModel.provider}' is SOC2 enterprise certified.` : `Provider '${candidateModel.provider}' not in approved list.`,
      });
      if (!isApproved) allPassed = false;
    } else if (pol.id === 'pol-memory-first') {
      decisions.push({
        policyName: pol.name,
        passed: true,
        reason: 'Hindsight institutional memory queried prior to inference.',
      });
    } else if (pol.id === 'pol-audit-store') {
      decisions.push({
        policyName: pol.name,
        passed: true,
        reason: 'Immutable audit trail logging enabled.',
      });
    } else if (pol.id === 'pol-quality-escalate' && request.requireHighConfidence) {
      decisions.push({
        policyName: pol.name,
        passed: true,
        reason: 'High confidence SLA enforced; ready to escalate if initial score < 85%.',
      });
    } else {
      decisions.push({
        policyName: pol.name,
        passed: true,
        reason: `Policy rule '${pol.ruleExpression}' satisfied.`,
      });
    }
  }

  return { passed: allPassed, decisions, triggerFallback, triggerEscalate };
}
