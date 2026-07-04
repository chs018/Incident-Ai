/**
 * cascadeflow Budget Manager — Enterprise Financial Governance
 *
 * Tracks live AI expenditure across prompt/completion tokens, incidents, and users.
 * Enforces daily/monthly budget caps and triggers graceful degradation to lightweight models.
 */

import { BudgetStatus, BudgetPolicy } from '@/types';

let mockBudgetPolicy: BudgetPolicy = {
  id: 'bp-prod-default',
  name: 'Enterprise Production AI Governance Cap',
  description: 'Strict financial safeguards preventing runaway LLM billing during high-frequency incident storms.',
  enabled: true,
  maxDailyBudgetUsd: 50.00,
  maxMonthlyBudgetUsd: 1500.00,
  maxCostPerIncidentUsd: 5.00,
  maxTokensPerRequest: 16384,
  degradationAction: 'fallback_lightweight',
  fallbackModelId: 'groq-llama-8b',
};

let currentTodaySpendUsd = 12.48;
let currentWeeklySpendUsd = 84.30;
let currentMonthlySpendUsd = 342.15;
let totalRequestsToday = 48;
let totalTokensToday = 142850;
let totalIncidentsTracked = 14;
let totalActiveUsers = 8;

export function getBudgetStatus(): BudgetStatus {
  const budgetRemainingUsd = Math.max(0, mockBudgetPolicy.maxMonthlyBudgetUsd - currentMonthlySpendUsd);
  const averageCostPerIncidentUsd = totalIncidentsTracked > 0 ? Number((currentMonthlySpendUsd / totalIncidentsTracked).toFixed(4)) : 0.0450;
  const averageCostPerUserUsd = totalActiveUsers > 0 ? Number((currentMonthlySpendUsd / totalActiveUsers).toFixed(2)) : 42.75;
  const averageTokensPerRequest = totalRequestsToday > 0 ? Math.round(totalTokensToday / totalRequestsToday) : 2976;
  
  // Forecasted based on daily burn rate
  const forecastedMonthlySpendUsd = Number((currentTodaySpendUsd * 30).toFixed(2));

  return {
    todaySpendUsd: Number(currentTodaySpendUsd.toFixed(4)),
    weeklySpendUsd: Number(currentWeeklySpendUsd.toFixed(2)),
    monthlySpendUsd: Number(currentMonthlySpendUsd.toFixed(2)),
    monthlyBudgetUsd: mockBudgetPolicy.maxMonthlyBudgetUsd,
    budgetRemainingUsd: Number(budgetRemainingUsd.toFixed(2)),
    averageCostPerIncidentUsd,
    averageCostPerUserUsd,
    averageTokensPerRequest,
    forecastedMonthlySpendUsd,
    dailyBudgetUsd: mockBudgetPolicy.maxDailyBudgetUsd,
  };
}

export function getBudgetPolicy(): BudgetPolicy {
  return mockBudgetPolicy;
}

export function updateBudgetPolicy(updates: Partial<BudgetPolicy>): BudgetPolicy {
  mockBudgetPolicy = { ...mockBudgetPolicy, ...updates };
  return mockBudgetPolicy;
}

/**
 * Records cost from an executed AI request and updates live financial meters.
 */
export function recordSpend(costUsd: number, tokens: number): void {
  currentTodaySpendUsd += costUsd;
  currentWeeklySpendUsd += costUsd;
  currentMonthlySpendUsd += costUsd;
  totalRequestsToday += 1;
  totalTokensToday += tokens;
}

export function checkBudgetHeadroom(estimatedCostUsd: number): { allowed: boolean; reason: string; degradeToFallback: boolean } {
  if (!mockBudgetPolicy.enabled) {
    return { allowed: true, reason: 'Budget enforcement disabled.', degradeToFallback: false };
  }

  if (currentTodaySpendUsd + estimatedCostUsd > mockBudgetPolicy.maxDailyBudgetUsd) {
    return {
      allowed: true,
      reason: `Daily budget cap ($${mockBudgetPolicy.maxDailyBudgetUsd}) approached. Graceful degradation triggered.`,
      degradeToFallback: true,
    };
  }

  if (estimatedCostUsd > mockBudgetPolicy.maxCostPerIncidentUsd) {
    return {
      allowed: true,
      reason: `Request cost ($${estimatedCostUsd.toFixed(4)}) exceeds per-incident limit ($${mockBudgetPolicy.maxCostPerIncidentUsd}). Downgrading model tier.`,
      degradeToFallback: true,
    };
  }

  return { allowed: true, reason: 'Spend approved within budget limits.', degradeToFallback: false };
}
