/**
 * Hindsight Memory Service Facade — Slice 7 Persistent Memory Intelligence
 *
 * Public architectural boundary for institutional memory storage, semantic retrieval,
 * autonomous reflections, engineer feedback reinforcement, and knowledge graph queries.
 *
 * ARCHITECTURAL RULE: UI components must NEVER import from hindsight-client directly;
 * all interactions must flow through this facade or through services/ai/.
 */

import {
  HistoricalMemory,
  AIReflection,
  EngineerFeedback,
  MemoryTimelineEvent,
  KnowledgeGraphNode,
  KnowledgeGraphEdge,
  MemoryAnalyticsData,
  AIImprovementComparison,
  MemoryConfidence,
} from '@/types';

import {
  getHistoricalMemories,
  getHistoricalMemoryById,
  getAIReflections,
  getEngineerFeedback,
  getMemoryTimelineEvents,
  getKnowledgeGraphData,
  getMemoryAnalytics as getAnalyticsData,
} from './hindsight-client';

import { calculateSimilarity, SimilarityResult } from './similarity-calculator';
import { generateAndStoreReflection, ReflectionRequest } from './reflection-engine';
export type { ReflectionRequest };
import { submitFeedback as submitFb, getFeedbackForIncident, SubmitFeedbackPayload } from './feedback-handler';
import { getSupabaseDirectClient } from '@/lib/supabase/client';

// ─── 1. Similar Incident Retrieval ─────────────────────────────────────────

export function retrieveSimilarIncidents(
  query: string,
  service: string,
  tags: string[] = [],
  limit: number = 4
): { memories: HistoricalMemory[]; confidence: MemoryConfidence } {
  const allMemories = getHistoricalMemories();
  const scored = calculateSimilarity(query, service, tags, allMemories);
  const topMatches = scored.slice(0, limit).map((s) => s.memory);

  const avgConfidence = topMatches.length > 0
    ? Math.round(topMatches.reduce((acc, m) => acc + m.similarityScore, 0) / topMatches.length)
    : 0;

  const avgSuccessRate = topMatches.length > 0
    ? Number((topMatches.reduce((acc, m) => acc + m.recoverySuccessRate, 0) / topMatches.length).toFixed(1))
    : 0;

  const confidence: MemoryConfidence = {
    matchesCount: topMatches.length,
    averageConfidence: avgConfidence,
    relevanceScore: topMatches[0]?.similarityScore || 0,
    ageDays: 14,
    lastUsedTimestamp: topMatches[0]?.lastUsedAt || new Date().toISOString(),
    historicalSuccessRate: avgSuccessRate,
  };

  return { memories: topMatches, confidence };
}

export async function retrieveSimilarIncidentsFromDb(
  query: string,
  service: string,
  tags: string[] = [],
  limit: number = 4
): Promise<{ memories: HistoricalMemory[]; confidence: MemoryConfidence }> {
  const supabase = getSupabaseDirectClient();
  if (!supabase) return retrieveSimilarIncidents(query, service, tags, limit);

  try {
    const { data, error } = await supabase
      .from('hindsight_memories')
      .select('*')
      .limit(limit);

    if (error || !data || data.length === 0) {
      return retrieveSimilarIncidents(query, service, tags, limit);
    }

    const mappedMemories: HistoricalMemory[] = data.map((row: any) => ({
      id: row.id,
      incidentId: row.incident_id,
      title: row.title,
      service: row.service,
      environment: row.environment,
      severity: row.severity,
      rootCause: row.root_cause,
      resolution: row.resolution,
      engineer: {
        name: row.engineer_name,
        role: row.engineer_role,
        avatarInitials: row.engineer_avatar,
      },
      timeToResolution: row.time_to_resolution || 15,
      businessImpact: row.business_impact,
      recoverySuccessRate: row.recovery_success_rate || 95.0,
      similarityScore: row.similarity_score || 88.5,
      relevanceBadge: row.relevance_badge || 'High Similarity',
      createdAt: row.created_at,
      lastUsedAt: row.last_used_at,
      useCount: row.use_count || 1,
      tags: row.tags || [],
      runbookUrl: row.runbook_url,
    }));

    const avgConfidence = Math.round(mappedMemories.reduce((acc, m) => acc + m.similarityScore, 0) / mappedMemories.length);
    const avgSuccessRate = Number((mappedMemories.reduce((acc, m) => acc + m.recoverySuccessRate, 0) / mappedMemories.length).toFixed(1));

    const confidence: MemoryConfidence = {
      matchesCount: mappedMemories.length,
      averageConfidence: avgConfidence,
      relevanceScore: mappedMemories[0]?.similarityScore || 0,
      ageDays: 14,
      lastUsedTimestamp: mappedMemories[0]?.lastUsedAt || new Date().toISOString(),
      historicalSuccessRate: avgSuccessRate,
    };

    return { memories: mappedMemories, confidence };
  } catch {
    return retrieveSimilarIncidents(query, service, tags, limit);
  }
}

// ─── 2. Memory Library Search & Filtering ──────────────────────────────────

export interface MemoryLibraryFilter {
  query?: string;
  service?: string;
  severity?: string;
  tag?: string;
}

export function searchMemoryLibrary(filter: MemoryLibraryFilter = {}): HistoricalMemory[] {
  let memories = getHistoricalMemories();

  if (filter.service && filter.service !== 'all') {
    memories = memories.filter((m) => m.service.toLowerCase() === filter.service?.toLowerCase());
  }

  if (filter.severity && filter.severity !== 'all') {
    memories = memories.filter((m) => m.severity.toLowerCase() === filter.severity?.toLowerCase());
  }

  if (filter.tag && filter.tag !== 'all') {
    memories = memories.filter((m) => m.tags.map((t) => t.toLowerCase()).includes(filter.tag!.toLowerCase()));
  }

  if (filter.query && filter.query.trim() !== '') {
    const q = filter.query.toLowerCase();
    memories = memories.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.rootCause.toLowerCase().includes(q) ||
        m.resolution.toLowerCase().includes(q) ||
        m.incidentId.toLowerCase().includes(q) ||
        m.engineer.name.toLowerCase().includes(q)
    );
  }

  return memories;
}

export function getMemoryById(id: string): HistoricalMemory | undefined {
  return getHistoricalMemoryById(id);
}

// ─── 3. AI Improvement Comparison (The Demo Moment) ────────────────────────

export function generateAIImprovement(
  incidentTitle: string,
  service: string,
  similarMemories: HistoricalMemory[]
): AIImprovementComparison {
  const isRedisOrPayment = service.toLowerCase().includes('payment') || incidentTitle.toLowerCase().includes('redis');
  const isK8sOrDNS = service.toLowerCase().includes('checkout') || incidentTitle.toLowerCase().includes('dns');
  const isPostgres = service.toLowerCase().includes('order') || incidentTitle.toLowerCase().includes('postgres');

  if (isRedisOrPayment) {
    return {
      withoutMemory: {
        recommendation: 'Check database connection pooling, verify networking security groups, and restart Redis or Kubernetes worker pods to clear fragmented memory.',
        confidence: 68,
        risk: 'High',
        potentialPitfall: 'Restarting Redis pods while unindexed session cache queries are active causes immediate volatile-lru OOM evictions and drops 100% of checkout sessions.',
      },
      withMemory: {
        recommendation: 'In 4 previous outages on payment-api, restarting Redis pods during unindexed query traffic caused OOM evictions. Instead, apply rollback patch v4.8.1 immediately, then execute ElastiCache replica shard failover.',
        confidence: 98,
        risk: 'Low',
        memoriesUsedCount: similarMemories.length || 4,
        historicalContext: 'Recalled inc-redis-2026-03 and 3 related memory patterns where rollback achieved 99.4% recovery success in 14 mins.',
        contributionHighlight: 'Prevented catastrophic OOM eviction repeat by warning against pod restarts and recommending immediate deployment rollback.',
      },
    };
  } else if (isK8sOrDNS) {
    return {
      withoutMemory: {
        recommendation: 'Scale up CoreDNS replica count from 3 to 10 and increase CPU/Memory requests on the checkout deployment.',
        confidence: 72,
        risk: 'Medium',
        potentialPitfall: 'Scaling CoreDNS replicas only provides temporary relief; socket exhaustion will return as traffic scales due to ndots:5 query multiplication.',
      },
      withMemory: {
        recommendation: 'In 2 previous EKS outages, CoreDNS throttling was caused by default ndots:5 pod specs. Patch deployment spec with ndots:2 and deploy NodeLocal DNSCache daemonset.',
        confidence: 96,
        risk: 'Low',
        memoriesUsedCount: similarMemories.length || 2,
        historicalContext: 'Recalled inc-k8s-2026-04 where ndots:2 patching permanently resolved 504 Gateway Timeouts.',
        contributionHighlight: 'Identified root configuration flaw (ndots:5) instead of suggesting brute-force pod scaling.',
      },
    };
  } else if (isPostgres) {
    return {
      withoutMemory: {
        recommendation: 'Restart PostgreSQL RDS instance or increase max_connections parameter in database parameter group.',
        confidence: 65,
        risk: 'Critical',
        potentialPitfall: 'Restarting RDS during an active deadlock storm drops all in-flight order transactions and triggers a 5-minute failover outage.',
      },
      withMemory: {
        recommendation: 'In 3 previous order-processor outages, deadlocks stemmed from conflicting lock hierarchies between batch invoice crons and real-time webhooks. Terminate blocking PID tree via pg_stat_activity and pause background cron.',
        confidence: 95,
        risk: 'Low',
        memoriesUsedCount: similarMemories.length || 3,
        historicalContext: 'Recalled inc-pg-2026-02 where terminating blocking PID tree restored order throughput in 18 minutes without downtime.',
        contributionHighlight: 'Avoided destructive RDS cluster reboot by pinpointing lock ordering conflict between webhooks and cron jobs.',
      },
    };
  }

  // Generic fallback improvement
  return {
    withoutMemory: {
      recommendation: `Inspect server error logs, check infrastructure CPU and memory utilization on ${service}, and restart unhealthy containers.`,
      confidence: 70,
      risk: 'Medium',
      potentialPitfall: 'Generic container restarts often mask underlying application memory leaks or unhandled exception loops without fixing the root cause.',
    },
    withMemory: {
      recommendation: `Leveraging ${similarMemories.length} historical outages on ${service}, check recent deployment commit diffs first, isolate failing worker threads, and apply verified rollback runbooks.`,
      confidence: 94,
      risk: 'Low',
      memoriesUsedCount: similarMemories.length || 3,
      historicalContext: `Synthesized operational patterns from ${similarMemories.length} similar enterprise incidents with an average MTTR of 16 minutes.`,
      contributionHighlight: 'Provided specific, historically validated recovery runbooks instead of generic container restarts.',
    },
  };
}

// ─── 4. Reflections & Feedback Accessors ───────────────────────────────────

export function getReflections(incidentId?: string): AIReflection[] {
  const allRef = getAIReflections();
  if (!incidentId) return allRef;
  return allRef.filter((r) => r.incidentId === incidentId);
}

export function storeReflection(request: ReflectionRequest): AIReflection {
  return generateAndStoreReflection(request);
}

export function getFeedback(incidentId?: string): EngineerFeedback[] {
  return getFeedbackForIncident(incidentId);
}

export function submitFeedback(payload: SubmitFeedbackPayload): EngineerFeedback {
  return submitFb(payload);
}

// ─── 5. Analytics & Graph & Timeline Accessors ─────────────────────────────

export function getMemoryAnalytics(): MemoryAnalyticsData {
  return getAnalyticsData();
}

export function getKnowledgeTimeline(): MemoryTimelineEvent[] {
  return getMemoryTimelineEvents();
}

export function getKnowledgeGraph(): { nodes: KnowledgeGraphNode[]; edges: KnowledgeGraphEdge[] } {
  return getKnowledgeGraphData();
}
