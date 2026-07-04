/**
 * cascadeflow Model Router — Core Runtime Intelligence Engine
 *
 * Centralized AI request orchestrator. Evaluates task complexity, budget headroom,
 * SLA requirements, and governance policies to select the optimal model.
 * Records latency, spend, and audit logs for every decision.
 */

import { CascadeFlowRouteRequest, CascadeFlowRouteDecision, ModelRegistryEntry } from '@/types';
import { MODEL_REGISTRY, getModelById, getLocalFallbackModel } from './model-registry';
import { getBudgetStatus, checkBudgetHeadroom, recordSpend } from './budget-manager';
import { evaluatePolicies } from './policy-engine';
import { recordLatency } from './latency-monitor';
import { recordAuditLog } from './audit-logger';

export function routeRequest(request: CascadeFlowRouteRequest): CascadeFlowRouteDecision {
  const budget = getBudgetStatus();
  const now = new Date().toISOString();
  const requestId = `req-${Date.now().toString().slice(-6)}`;

  // 1. Initial Candidate Selection based on task complexity & type
  let candidateId = 'groq-qwen-32b'; // default workhorse
  let selectionReason = 'Selected Qwen 2.5 32B as optimal workhorse for SRE analytical precision and sub-second LPU latency.';
  let wasEscalated = false;
  let wasFallbackActivated = false;

  if (request.taskType === 'log_summary') {
    candidateId = 'groq-llama-8b';
    selectionReason = 'Task identified as lightweight log summarizing; routed to Llama 3.1 8B Instant for ultra-fast 450ms triage at $0.05/M tokens.';
  } else if (request.taskType === 'executive_report' || request.complexity === 'Critical') {
    if (request.requireHighConfidence) {
      candidateId = 'openai-gpt4o';
      selectionReason = 'Critical executive report with strict confidence SLA; routed to multimodal GPT-4o Enterprise for formal compliance formatting.';
      wasEscalated = true;
    } else {
      candidateId = 'groq-qwen-32b';
      selectionReason = 'Critical incident analysis routed to Qwen 2.5 32B for deep system dependency correlation on Groq LPU.';
    }
  } else if (request.taskType === 'root_cause_analysis' && request.complexity === 'High') {
    candidateId = 'groq-qwen-32b';
    selectionReason = 'High-complexity multi-service root cause triage routed to Qwen 2.5 32B LPU Neural Engine.';
  }

  let selectedModel = getModelById(candidateId) || MODEL_REGISTRY[0];

  // 2. Estimate tokens & cost
  const promptTokens = Math.round(request.prompt.length / 4) + 650; // estimate tokens + system prompt
  const completionTokens = request.taskType === 'executive_report' ? 1200 : 750;
  const totalTokens = promptTokens + completionTokens;

  const estimatedCostUsd = Number(
    ((promptTokens / 1_000_000) * selectedModel.costPerMillionPromptTokens +
      (completionTokens / 1_000_000) * selectedModel.costPerMillionCompletionTokens).toFixed(5)
  );

  // 3. Check Budget & Policy Governance
  const budgetCheck = checkBudgetHeadroom(estimatedCostUsd);
  const policyEval = evaluatePolicies(request, selectedModel, budget.todaySpendUsd, budget.dailyBudgetUsd);

  const alternativeModels: { model: ModelRegistryEntry; rejectionReason: string }[] = [];

  // Populate alternative models considered
  MODEL_REGISTRY.forEach((m) => {
    if (m.id !== selectedModel.id) {
      if (m.tier === 'heavy' && request.complexity !== 'Critical') {
        alternativeModels.push({ model: m, rejectionReason: `Excessive cost/latency for ${request.complexity} complexity task.` });
      } else if (m.tier === 'lightweight' && request.complexity === 'Critical') {
        alternativeModels.push({ model: m, rejectionReason: 'Insufficient reasoning capacity for Critical outage triage.' });
      } else {
        alternativeModels.push({ model: m, rejectionReason: 'Not optimal price/performance match for requested SLA.' });
      }
    }
  });

  // Handle fallback or degradation if budget or policy triggered
  if (budgetCheck.degradeToFallback || policyEval.triggerFallback) {
    const fallback = getLocalFallbackModel();
    alternativeModels.push({
      model: selectedModel,
      rejectionReason: `Rejected by Governance: ${budgetCheck.reason || 'Policy fallback rule triggered'}`,
    });
    selectedModel = fallback;
    selectionReason = `Governance Fallback Activated: Downgraded to ${fallback.name} due to budget/policy constraints.`;
    wasFallbackActivated = true;
  }

  // 4. Execute simulated metrics
  const actualLatencyMs = selectedModel.latencySlaMs + Math.floor(Math.random() * 180) - 90;
  const actualCostUsd = estimatedCostUsd;
  const confidenceScore = selectedModel.qualityRating - (wasFallbackActivated ? 8 : 0);

  // 5. Record Observability & Spend
  recordSpend(actualCostUsd, totalTokens);
  recordLatency(actualLatencyMs, selectedModel.modelId);
  recordAuditLog({
    user: 'Sarah Chen',
    userRole: 'Principal SRE',
    incidentId: request.incidentId || 'inc-1',
    incidentTitle: `Analysis for ${request.service}`,
    selectedModel: selectedModel.name,
    latencyMs: actualLatencyMs,
    tokens: totalTokens,
    costUsd: actualCostUsd,
    confidence: confidenceScore,
    memoryUsed: true,
    policyDecision: wasFallbackActivated ? 'Fallback Activated' : wasEscalated ? 'Escalated' : 'Approved',
    status: 'Success',
  });

  return {
    requestId,
    timestamp: now,
    selectedModel,
    alternativeModels: alternativeModels.slice(0, 3),
    reasonForSelection: selectionReason,
    confidenceScore,
    estimatedLatencyMs: selectedModel.latencySlaMs,
    actualLatencyMs,
    estimatedCostUsd,
    actualCostUsd,
    promptTokens,
    completionTokens,
    totalTokens,
    policyDecisions: policyEval.decisions,
    wasEscalated,
    wasFallbackActivated,
    memoryUsedCount: 3,
  };
}
