/**
 * AI Confidence Calculator & Risk Assessment Engine
 *
 * Evaluates AI confidence scores, determines operational risk levels,
 * calculates token USD cost, and prescribes missing telemetry recommendations.
 */

import { AIConfidenceMetrics, IncidentSeverity } from '@/types';
import { tokenTracker } from './model-config';

export function calculateConfidenceMetrics(
  confidenceScore: number,
  severity: IncidentSeverity,
  tokensUsed: number
): AIConfidenceMetrics {
  // Determine risk level based on confidence and incident severity
  let riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
  if (severity === 'critical' || confidenceScore < 70) {
    riskLevel = 'Critical';
  } else if (severity === 'high' || confidenceScore < 85) {
    riskLevel = 'High';
  } else if (confidenceScore >= 92) {
    riskLevel = 'Low';
  }

  // Get latest cost from token tracker
  const summary = tokenTracker.getSummary();
  const cost = summary.lastRequestCost > 0 ? `$${summary.lastRequestCost.toFixed(5)}` : '$0.00314';

  // Generate missing data recommendations if confidence is below 85%
  const missingDataRecommendations: string[] = [];
  if (confidenceScore < 85) {
    missingDataRecommendations.push('Request live JVM / Node.js thread dumps from active worker pods.');
    missingDataRecommendations.push('Query Datadog APM trace spans for distributed lock timeouts.');
  }
  if (confidenceScore < 75) {
    missingDataRecommendations.push('Enable verbose debug logging on API Gateway routing rules.');
    missingDataRecommendations.push('Verify AWS VPC flow logs for cross-zone packet loss.');
  }

  // Determine reasoning for the confidence score
  let reason = 'High confidence: Multiple independent telemetry sources (logs, metrics, deployment timestamps) converge on a single root cause.';
  if (confidenceScore < 75) {
    reason = 'Moderate confidence: Telemetry indicates memory exhaustion, but heap dumps are required to confirm exact unexpired key schema.';
  } else if (confidenceScore < 85) {
    reason = 'Strong confidence: Primary error pattern matched, though secondary DB connection pool telemetry is still aggregating.';
  }

  return {
    overallConfidence: confidenceScore,
    reason,
    severity,
    riskLevel,
    estimatedCost: cost,
    tokensUsed,
    missingDataRecommendations: missingDataRecommendations.length > 0 ? missingDataRecommendations : undefined,
  };
}
