/**
 * Hindsight Feedback Handler — Slice 7 Persistent Memory Intelligence
 *
 * Processes engineer ratings and feedback on AI recommendations, dynamically
 * adjusting confidence weights and recovery success rates in institutional memory.
 */

import { EngineerFeedback } from '@/types';
import { storeEngineerFeedback, getEngineerFeedback } from './hindsight-client';

export interface SubmitFeedbackPayload {
  incidentId: string;
  recommendationId?: string;
  engineerId: string;
  engineerName: string;
  rating: 'Correct' | 'Helpful' | 'Needs Improvement' | 'Incorrect';
  comment: string;
}

/**
 * Submits engineer feedback and applies reinforcement learning weights to Hindsight memory.
 */
export function submitFeedback(payload: SubmitFeedbackPayload): EngineerFeedback {
  return storeEngineerFeedback(payload);
}

/**
 * Retrieves all engineer feedback records for a specific incident or across all memories.
 */
export function getFeedbackForIncident(incidentId?: string): EngineerFeedback[] {
  const allFeedback = getEngineerFeedback();
  if (!incidentId) return allFeedback;
  return allFeedback.filter((fb) => fb.incidentId === incidentId);
}
