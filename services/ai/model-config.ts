/**
 * AI Model Configuration & Token Tracker
 *
 * Configures Groq as primary provider with Qwen3-32B (qwen-2.5-32b) as preferred model.
 * Includes token usage tracking, cost estimation, and architectural stubs for future
 * cascadeflow routing and budget controls.
 */

import { AIModelProvider } from '@/types';

export interface AIModelConfig {
  provider: AIModelProvider;
  model: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
  costPerMillionPromptTokens: number; // in USD
  costPerMillionCompletionTokens: number; // in USD
}

export const GROQ_MODELS = {
  QWEN_32B: 'qwen-2.5-32b',
  QWEN_72B: 'qwen-2.5-72b',
  LLAMA_70B: 'llama-3.3-70b-versatile',
};

// Default configuration with Qwen3-32B as preferred model
export const DEFAULT_MODEL_CONFIG: AIModelConfig = {
  provider: 'groq',
  model: GROQ_MODELS.QWEN_32B,
  fallbackModel: GROQ_MODELS.LLAMA_70B,
  maxTokens: 3072,
  temperature: 0.2, // Low temperature for SRE analytical precision
  costPerMillionPromptTokens: 0.59,
  costPerMillionCompletionTokens: 0.79,
};

// ─── Token Usage & Cost Tracker ────────────────────────────────

export interface TokenUsageRecord {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  timestamp: string;
  model: string;
}

class TokenUsageTracker {
  private totalPromptTokens = 0;
  private totalCompletionTokens = 0;
  private totalRequests = 0;
  private history: TokenUsageRecord[] = [];

  public recordUsage(promptTokens: number, completionTokens: number, model: string): TokenUsageRecord {
    const totalTokens = promptTokens + completionTokens;
    this.totalPromptTokens += promptTokens;
    this.totalCompletionTokens += completionTokens;
    this.totalRequests += 1;

    // Calculate cost based on model config
    const promptCost = (promptTokens / 1_000_000) * DEFAULT_MODEL_CONFIG.costPerMillionPromptTokens;
    const completionCost = (completionTokens / 1_000_000) * DEFAULT_MODEL_CONFIG.costPerMillionCompletionTokens;
    const estimatedCostUsd = Number((promptCost + completionCost).toFixed(6));

    const record: TokenUsageRecord = {
      promptTokens,
      completionTokens,
      totalTokens,
      estimatedCostUsd,
      timestamp: new Date().toISOString(),
      model,
    };

    this.history.unshift(record);
    return record;
  }

  public getSummary() {
    const totalCostUsd = this.history.reduce((acc, r) => acc + r.estimatedCostUsd, 0);
    return {
      totalPromptTokens: this.totalPromptTokens,
      totalCompletionTokens: this.totalCompletionTokens,
      totalTokens: this.totalPromptTokens + this.totalCompletionTokens,
      totalRequests: this.totalRequests,
      totalCostUsd: Number(totalCostUsd.toFixed(4)),
      lastRequestCost: this.history[0]?.estimatedCostUsd ?? 0,
    };
  }
}

export const tokenTracker = new TokenUsageTracker();

// ─── Future cascadeflow Extension Stubs ────────────────────────

export interface CascadeFlowRouteConfig {
  enableDynamicRouting: boolean;
  maxBudgetUsdPerDay: number;
  currentSpendUsd: number;
  escalationThresholdUsd: number;
  auditTrailEnabled: boolean;
}

export const CASCADEFLOW_STUB_CONFIG: CascadeFlowRouteConfig = {
  enableDynamicRouting: false, // Set to true when cascadeflow is implemented
  maxBudgetUsdPerDay: 50.0,
  currentSpendUsd: 0.0,
  escalationThresholdUsd: 40.0,
  auditTrailEnabled: true,
};

/**
 * Future extension point: evaluates model routing and budget before executing AI calls.
 */
export function checkCascadeFlowBudget(): boolean {
  if (CASCADEFLOW_STUB_CONFIG.currentSpendUsd >= CASCADEFLOW_STUB_CONFIG.maxBudgetUsdPerDay) {
    console.warn('[cascadeflow] Daily AI budget exceeded. Escalating or throttling request.');
    return false;
  }
  return true;
}
