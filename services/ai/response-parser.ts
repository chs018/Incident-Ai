/**
 * AI Response Parser & Schema Validator
 *
 * Extracts structured JSON from LLM markdown responses and ensures robust
 * default filling for any missing fields.
 */

import { AIAnalysis, Incident } from '@/types';
import { getFallbackSimulation } from './error-handler';

/**
 * Cleanly extracts JSON string from markdown code block if present.
 */
export function extractJsonFromMarkdown(rawContent: string): string {
  if (!rawContent) return '{}';
  
  // Try finding ```json ... ``` or ``` ... ```
  const jsonBlockMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    return jsonBlockMatch[1].trim();
  }

  // Otherwise return raw string trimmed
  return rawContent.trim();
}

/**
 * Parses and validates an AI analysis response against the expected schema.
 * Fills in intelligent defaults if any field is missing or malformed.
 */
export function parseAndValidateAIAnalysis(
  rawContent: string,
  incident: Incident,
  model: string
): AIAnalysis {
  const cleanedJson = extractJsonFromMarkdown(rawContent);
  const fallback = getFallbackSimulation(incident, model);

  try {
    const parsed = JSON.parse(cleanedJson);

    // Merge with fallback to ensure no field is ever undefined or null
    const validated: AIAnalysis = {
      summary: typeof parsed.summary === 'string' ? parsed.summary : fallback.summary,
      rootCause: typeof parsed.rootCause === 'string' ? parsed.rootCause : fallback.rootCause,
      impact: typeof parsed.impact === 'string' ? parsed.impact : fallback.impact,
      affectedUsers: typeof parsed.affectedUsers === 'number' ? parsed.affectedUsers : fallback.affectedUsers,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : fallback.confidence,
      recommendedActions: Array.isArray(parsed.recommendedActions)
        ? parsed.recommendedActions
        : fallback.recommendedActions,
      relatedIncidents: Array.isArray(parsed.relatedIncidents)
        ? parsed.relatedIncidents
        : fallback.relatedIncidents,
      generatedAt: new Date().toISOString(),
      model: model || fallback.model,
      investigation: parsed.investigation || fallback.investigation,
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations
        : fallback.recommendations,
      commands: Array.isArray(parsed.commands) ? parsed.commands : fallback.commands,
      report: parsed.report || fallback.report,
    };

    return validated;
  } catch (error) {
    console.warn('[AI Parser] JSON parse error on LLM output. Activating intelligent fallback.', error);
    return fallback;
  }
}
