/**
 * Hindsight Similarity Calculator — Slice 7 Persistent Memory Intelligence
 *
 * Multi-factor similarity scoring engine that compares active incident telemetry
 * (service name, tags, error keywords, severity, root cause) against historical memory vectors.
 */

import { HistoricalMemory, Incident } from '@/types';

export interface SimilarityResult {
  memory: HistoricalMemory;
  score: number; // 0 - 100
  relevanceBadge: 'Exact Pattern' | 'High Similarity' | 'Related Service' | 'Structural Match';
  matchedKeywords: string[];
}

/**
 * Calculates similarity between a query/incident and historical memories.
 */
export function calculateSimilarity(
  queryText: string,
  serviceName: string,
  tags: string[],
  memories: HistoricalMemory[]
): SimilarityResult[] {
  const normalizedQuery = queryText.toLowerCase();
  const queryTokens = new Set(normalizedQuery.split(/\s+/).filter((t) => t.length > 2));
  const queryTags = new Set(tags.map((t) => t.toLowerCase()));

  const results: SimilarityResult[] = memories.map((mem) => {
    let score = 0;
    const matchedKeywords: string[] = [];

    // 1. Service Match (35 points max)
    if (mem.service.toLowerCase() === serviceName.toLowerCase()) {
      score += 35;
      matchedKeywords.push(mem.service);
    } else if (
      mem.service.toLowerCase().includes('payment') &&
      serviceName.toLowerCase().includes('payment')
    ) {
      score += 25;
      matchedKeywords.push('payment domain');
    }

    // 2. Tag Intersection (30 points max)
    const memTags = new Set(mem.tags.map((t) => t.toLowerCase()));
    let tagMatches = 0;
    queryTags.forEach((tag) => {
      if (memTags.has(tag)) {
        tagMatches++;
        matchedKeywords.push(tag);
      }
    });
    score += Math.min(30, tagMatches * 10);

    // 3. Keyword / Text Similarity (35 points max)
    const memText = `${mem.title} ${mem.rootCause} ${mem.resolution}`.toLowerCase();
    let keywordMatches = 0;
    queryTokens.forEach((token) => {
      if (memText.includes(token) && !matchedKeywords.includes(token)) {
        keywordMatches++;
        matchedKeywords.push(token);
      }
    });
    score += Math.min(35, keywordMatches * 7);

    // Add small baseline variance from stored similarity if exact match
    if (score === 0) {
      score = mem.similarityScore > 0 ? mem.similarityScore : 40;
    } else {
      score = Math.min(99.8, Math.max(45, score + (mem.similarityScore % 5)));
    }

    // Determine Relevance Badge
    let relevanceBadge: 'Exact Pattern' | 'High Similarity' | 'Related Service' | 'Structural Match' =
      'Structural Match';
    if (score >= 90) {
      relevanceBadge = 'Exact Pattern';
    } else if (score >= 80) {
      relevanceBadge = 'High Similarity';
    } else if (mem.service.toLowerCase() === serviceName.toLowerCase()) {
      relevanceBadge = 'Related Service';
    }

    return {
      memory: {
        ...mem,
        similarityScore: Number(score.toFixed(1)),
        relevanceBadge,
      },
      score: Number(score.toFixed(1)),
      relevanceBadge,
      matchedKeywords: Array.from(new Set(matchedKeywords)),
    };
  });

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
}
