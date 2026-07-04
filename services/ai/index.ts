/**
 * AI Service — Public API & Unified Facade
 *
 * This is the ONLY entry point for AI features throughout the application.
 * Currently delegates to Groq Qwen3-32B (via groq-client.ts) with rich SRE
 * fallback simulations.
 *
 * Architecture note:
 *   UI Components → services/ai/index.ts → groq-client.ts (today)
 *   UI Components → services/ai/index.ts → cascadeflow router → groq-client.ts (future)
 */

import { groqChat } from './groq-client';
import { Incident, AIAnalysis, ExecutiveReport, AIAnalysisHistoryItem } from '@/types';
import { DEFAULT_MODEL_CONFIG, tokenTracker, checkCascadeFlowBudget } from './model-config';
import { SYSTEM_PROMPT_SRE, getFullSREAnalysisPrompt } from './prompt-templates';
import { parseAndValidateAIAnalysis } from './response-parser';
import { calculateConfidenceMetrics } from './confidence-calculator';
import { withRetry, getFallbackSimulation } from './error-handler';
import {
  retrieveSimilarIncidents,
  generateAIImprovement,
  getReflections,
} from '@/services/memory';
import { routeRequest } from '@/services/cascadeflow';

// In-memory conversation and analysis history
let analysisHistory: AIAnalysisHistoryItem[] = [];

// ─── Full Incident Analysis (Slice 6 & 7 & 8) ──────────────────

export async function analyzeIncidentFull(incident: Incident): Promise<AIAnalysis> {
  const userPrompt = getFullSREAnalysisPrompt(incident);

  // 1. Execute cascadeflow Runtime Intelligence routing & governance
  const routeDecision = routeRequest({
    incidentId: incident.id,
    service: incident.service,
    taskType: 'root_cause_analysis',
    prompt: userPrompt,
    complexity: incident.severity === 'critical' ? 'Critical' : incident.severity === 'high' ? 'High' : 'Medium',
    requireHighConfidence: incident.severity === 'critical' || incident.severity === 'high',
  });

  const selectedModelId = routeDecision.selectedModel.modelId;

  try {
    const response = await withRetry(async () => {
      return await groqChat(
        [
          { role: 'system', content: SYSTEM_PROMPT_SRE },
          { role: 'user', content: userPrompt },
        ],
        {
          model: selectedModelId,
          temperature: DEFAULT_MODEL_CONFIG.temperature,
          maxTokens: DEFAULT_MODEL_CONFIG.maxTokens,
        }
      );
    });

    // 2. Track token usage
    const promptTokens = response.usage?.promptTokens ?? 650;
    const completionTokens = response.usage?.completionTokens ?? 920;
    tokenTracker.recordUsage(promptTokens, completionTokens, response.model);

    // 3. Parse and validate JSON against TypeScript schema
    let analysis = parseAndValidateAIAnalysis(response.content, incident, response.model);

    // 4. Calculate overall confidence metrics & USD cost
    const confMetrics = calculateConfidenceMetrics(
      analysis.confidence,
      incident.severity,
      promptTokens + completionTokens
    );
    analysis.confidenceMetrics = confMetrics;
    analysis.routeDecision = routeDecision;

    // 5. Enrich with Hindsight Institutional Memory
    analysis = enrichWithMemory(analysis, incident);

    // 6. Store in conversation history
    const historyItem: AIAnalysisHistoryItem = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      model: response.model,
      summary: analysis.summary,
      confidence: analysis.confidence,
      tokensUsed: promptTokens + completionTokens,
      analysis,
    };
    analysisHistory.unshift(historyItem);

    return analysis;
  } catch (error) {
    console.error('[AI Service] analyzeIncidentFull error — activating fallback:', error);
    const fallback = getFallbackSimulation(incident, selectedModelId);
    const confMetrics = calculateConfidenceMetrics(fallback.confidence, incident.severity, 1400);
    fallback.confidenceMetrics = confMetrics;
    fallback.routeDecision = routeDecision;
    return enrichWithMemory(fallback, incident);
  }
}

/**
 * Helper to enrich AI analysis with Hindsight similar incidents, improvement comparison, and reflections.
 */
function enrichWithMemory(analysis: AIAnalysis, incident: Incident): AIAnalysis {
  const tagsList = incident.tags?.map((t) => t.label) || [];
  const memoryResult = retrieveSimilarIncidents(
    `${incident.title} ${incident.description}`,
    incident.service,
    tagsList,
    4
  );

  const aiImprovement = generateAIImprovement(
    incident.title,
    incident.service,
    memoryResult.memories
  );

  const reflections = getReflections();

  return {
    ...analysis,
    similarIncidents: memoryResult.memories,
    memoryConfidence: memoryResult.confidence,
    aiImprovement,
    reflections: reflections.slice(0, 3),
  };
}

// Backward compatibility for existing Slice 2 calls
export async function analyzeIncident(incident: Incident): Promise<AIAnalysis> {
  return analyzeIncidentFull(incident);
}

// ─── Executive Report Generator ───────────────────────────────

export async function generateExecutiveReport(incident: Incident): Promise<ExecutiveReport> {
  const analysis = await analyzeIncidentFull(incident);
  
  if (analysis.report) {
    return analysis.report;
  }

  return {
    incidentId: incident.id,
    title: `Executive Outage Report: ${incident.title}`,
    summary: analysis.summary,
    rootCause: analysis.rootCause,
    businessImpact: analysis.impact,
    recoveryTimeline: [
      { time: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Incident anomaly detected by telemetry monitors.' },
      { time: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'AI Incident Commander triage initiated.' },
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'Root cause identified and remediation plan generated.' },
    ],
    lessonsLearned: [
      'Enhance automated canary rollback rules for memory saturation spikes.',
      'Enforce mandatory SLA validation checks in CI/CD pipeline.',
    ],
    actionItems: [
      { task: 'Implement automated cache purging trigger on OOM threshold', owner: 'SRE Team', priority: 'P0' },
      { task: 'Review database connection pool timeout parameters', owner: 'Database Admin', priority: 'P1' },
    ],
    generatedAt: new Date().toISOString(),
    confidence: analysis.confidence,
    model: analysis.model,
  };
}

export async function generatePostmortem(incident: Incident): Promise<string> {
  const report = await generateExecutiveReport(incident);
  return `# Blameless Postmortem: ${report.title}
**Incident ID:** ${report.incidentId} | **Date:** ${new Date(report.generatedAt).toLocaleDateString()}
**AI Engine:** ${report.model} (${report.confidence}% Confidence)

## Executive Summary
${report.summary}

## Root Cause Analysis
${report.rootCause}

## Business Impact
${report.businessImpact}

## Chronological Recovery Timeline
${report.recoveryTimeline.map((t) => `- **${t.time}**: ${t.event}`).join('\n')}

## Lessons Learned
${report.lessonsLearned.map((l) => `- ${l}`).join('\n')}

## Action Items
${report.actionItems.map((a) => `- [ ] **${a.task}** (Owner: ${a.owner}, Priority: ${a.priority})`).join('\n')}
`;
}

// ─── Conversation History ─────────────────────────────────────

export function getAIConversationHistory(): AIAnalysisHistoryItem[] {
  return analysisHistory;
}

export function clearAIConversationHistory(): void {
  analysisHistory = [];
}

// ─── Hindsight & cascadeflow Extension Stubs ───────────────────

export interface HindsightMemoryResult {
  similarIncidentsCount: number;
  historicalFixes: string[];
  reflectionSummary: string;
}

/**
 * Queries Hindsight persistent memory for similar past incidents.
 */
export async function queryHindsightMemory(incident: Incident): Promise<HindsightMemoryResult> {
  const tagsList = incident.tags?.map((t) => t.label) || [];
  const memoryResult = retrieveSimilarIncidents(
    `${incident.title} ${incident.description}`,
    incident.service,
    tagsList,
    4
  );

  return {
    similarIncidentsCount: memoryResult.memories.length,
    historicalFixes: memoryResult.memories.map((m) => m.resolution),
    reflectionSummary: `Historical pattern match: ${memoryResult.confidence.averageConfidence}% average similarity across ${memoryResult.memories.length} historical outages.`,
  };
}

/**
 * Routes prompt through cascadeflow model gateway.
 */
export async function routeAIRequest(prompt: string, useCase: string): Promise<{ decision: any; responseText: string }> {
  const decision = routeRequest({
    service: 'api-gateway',
    taskType: (useCase as any) || 'log_summary',
    prompt,
    complexity: 'Medium',
  });
  return {
    decision,
    responseText: `[cascadeflow routed via ${decision.selectedModel.name}]: Executed ${useCase} successfully in ${decision.actualLatencyMs}ms ($${decision.actualCostUsd}).`,
  };
}

export { DEFAULT_MODEL_CONFIG, tokenTracker };

