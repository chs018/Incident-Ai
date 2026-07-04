// ============================================================
// AI Incident Commander — Shared TypeScript Types
// ============================================================

// ─── Enumerations ────────────────────────────────────────────

export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';
export type IncidentStatus = 'active' | 'investigating' | 'mitigating' | 'resolved' | 'postmortem';
export type IncidentPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type Environment = 'production' | 'staging' | 'development';
export type UserRole = 'admin' | 'incident-commander' | 'sre' | 'devops' | 'viewer';
export type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';
export type AIModelProvider = 'groq' | 'openai' | 'anthropic' | 'gemini';

// ─── Organization ────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  avatarColor: string;
  plan: 'starter' | 'pro' | 'enterprise';
  memberCount: number;
}

// ─── User / Team ─────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  avatarColor: string;
  team: string;
  status: 'online' | 'away' | 'offline';
  incidentsResolved: number;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lead: string;
  oncallCount: number;
}

// ─── Incident ────────────────────────────────────────────────

export interface IncidentTag {
  label: string;
  color: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
  type: 'detection' | 'acknowledgment' | 'investigation' | 'action' | 'update' | 'resolution';
}

export interface ProbableCause {
  id: string;
  title: string;
  confidence: number; // 0-100
  evidence: string[];
  explanation: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  reasoning: string;
}

export interface AIInvestigationData {
  observedSymptoms: string[];
  evidence: string[];
  possibleRootCauses: ProbableCause[];
  supportingLogs: string[];
  metricCorrelations: { metric: string; observation: string; impact: string }[];
  missingInformation: string[];
  confidenceLevel: number;
  reasoning: string;
}

export interface AIRecommendationItem {
  id: string;
  title: string;
  category: 'immediate' | 'recommended' | 'validation' | 'verification' | 'rollback';
  probability: number; // 0-100
  timeEst: string;
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  command?: string;
  reasoning: string;
  completed?: boolean;
}

export interface SuggestedCommand {
  id: string;
  command: string;
  description: string;
  category: 'kubernetes' | 'redis' | 'database' | 'system' | 'network';
  risk: 'Low' | 'Medium' | 'High';
  syntaxLang: 'bash' | 'yaml' | 'sql';
}

export interface ExecutiveReport {
  incidentId: string;
  title: string;
  summary: string;
  rootCause: string;
  businessImpact: string;
  recoveryTimeline: { time: string; event: string }[];
  lessonsLearned: string[];
  actionItems: { task: string; owner: string; priority: string }[];
  generatedAt: string;
  confidence: number;
  model: string;
}

export interface AIConfidenceMetrics {
  overallConfidence: number; // 0-100
  reason: string;
  severity: IncidentSeverity;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedCost: string;
  tokensUsed: number;
  missingDataRecommendations?: string[];
}

export interface AIAnalysis {
  summary: string;
  rootCause: string;
  impact: string;
  affectedUsers: number;
  confidence: number; // 0-100
  recommendedActions: string[];
  relatedIncidents: string[];
  generatedAt: string;
  model: string;
  investigation?: AIInvestigationData;
  recommendations?: AIRecommendationItem[];
  commands?: SuggestedCommand[];
  confidenceMetrics?: AIConfidenceMetrics;
  report?: ExecutiveReport;
  similarIncidents?: HistoricalMemory[];
  aiImprovement?: AIImprovementComparison;
  memoryConfidence?: MemoryConfidence;
  reflections?: AIReflection[];
  routeDecision?: CascadeFlowRouteDecision;
}

export interface AIAnalysisHistoryItem {
  id: string;
  timestamp: string;
  model: string;
  summary: string;
  confidence: number;
  tokensUsed: number;
  analysis: AIAnalysis;
}

// ─── Institutional Memory (Hindsight) ─────────────────────────

export interface HistoricalMemory {
  id: string;
  incidentId: string;
  title: string;
  service: string;
  environment: Environment;
  severity: IncidentSeverity;
  rootCause: string;
  resolution: string;
  engineer: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  timeToResolution: number; // minutes
  businessImpact: string;
  recoverySuccessRate: number; // 0-100
  similarityScore: number; // 0-100
  relevanceBadge: 'Exact Pattern' | 'High Similarity' | 'Related Service' | 'Structural Match';
  createdAt: string;
  lastUsedAt: string;
  useCount: number;
  tags: string[];
  runbookUrl?: string;
}

export interface AIReflection {
  id: string;
  incidentId: string;
  incidentTitle: string;
  service: string;
  whatHappened: string;
  whyItHappened: string;
  recommendationAccuracy: 'Correct' | 'Partially Correct' | 'Incorrect';
  whatToRemember: string;
  whatToImproveNextTime: string;
  summary: string;
  tags: string[];
  isPinned?: boolean;
  createdAt: string;
  author: string;
}

export interface EngineerFeedback {
  id: string;
  incidentId: string;
  recommendationId?: string;
  engineerId: string;
  engineerName: string;
  rating: 'Correct' | 'Helpful' | 'Needs Improvement' | 'Incorrect';
  comment: string;
  timestamp: string;
  appliedToMemory: boolean;
}

export interface MemoryTimelineEvent {
  id: string;
  incidentId: string;
  title: string;
  timestamp: string;
  stage: 'Incident Created' | 'AI Analysis' | 'Memory Retrieved' | 'Engineer Action' | 'Final Resolution' | 'Reflection Generated' | 'Memory Stored';
  description: string;
  actor: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'service' | 'incident' | 'rootCause' | 'engineer' | 'runbook';
  color: string;
  size?: number;
  data?: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface MemoryAnalyticsData {
  totalMemories: number;
  reflectionCount: number;
  successfulRecoveriesPercent: number;
  averageSimilarityScore: number;
  mostCommonRootCause: string;
  mostFrequentlyUsedRunbook: string;
  topLearningTopics: { topic: string; count: number; percentage: number }[];
  knowledgeGrowthSeries: { date: string; memories: number; reflections: number }[];
}

export interface AIImprovementComparison {
  withoutMemory: {
    recommendation: string;
    confidence: number;
    risk: 'Low' | 'Medium' | 'High' | 'Critical';
    potentialPitfall: string;
  };
  withMemory: {
    recommendation: string;
    confidence: number;
    risk: 'Low' | 'Medium' | 'High' | 'Critical';
    memoriesUsedCount: number;
    historicalContext: string;
    contributionHighlight: string;
  };
}

export interface MemoryConfidence {
  matchesCount: number;
  averageConfidence: number; // 0-100
  relevanceScore: number; // 0-100
  ageDays: number;
  lastUsedTimestamp: string;
  historicalSuccessRate: number; // 0-100
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  priority: IncidentPriority;
  environment: Environment;
  service: string;
  affectedServices: string[];
  team: string;
  assignee: TeamMember | null;
  commander: TeamMember | null;
  tags: IncidentTag[];
  timeline: TimelineEvent[];
  aiAnalysis: AIAnalysis | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  mttr: number | null; // minutes
  runbook: string | null;
}

// ─── Metrics ─────────────────────────────────────────────────

export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export interface DashboardMetrics {
  activeIncidents: number;
  mttr: number; // minutes
  slaCompliance: number; // percentage
  incidentsToday: number;
  incidentsThisWeek: number;
  resolvedThisWeek: number;
  p0Count: number;
  p1Count: number;
  meanTimeToDetect: number; // minutes
}

// ─── Integration ─────────────────────────────────────────────

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'monitoring' | 'alerting' | 'communication' | 'ticketing' | 'deployment' | 'cloud';
  status: IntegrationStatus;
  icon: string;
  connectedAt: string | null;
  lastSync: string | null;
  webhookUrl: string | null;
}

// ─── AI Routing (future cascadeflow) ─────────────────────────

export interface AIRoute {
  id: string;
  name: string;
  description: string;
  provider: AIModelProvider;
  model: string;
  useCases: string[];
  avgLatencyMs: number;
  costPerRequest: number;
  isActive: boolean;
  requestCount: number;
  successRate: number;
}

// ─── Navigation ──────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  badge?: number | string;
  isNew?: boolean;
  isBeta?: boolean;
}

// ─── API Responses ───────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  timestamp: string;
}

// ─── Dashboard Slice 2 ───────────────────────────────────────

export interface ServiceHealth {
  id: string;
  name: string;
  displayName: string;
  status: 'healthy' | 'degraded' | 'critical' | 'unknown';
  latencyMs: number;
  latencyTrend: number; // % change
  cpuPercent: number;
  memoryPercent: number;
  uptime: number; // percentage
  environment: Environment;
  version: string;
  region: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  service: string;
  severity: IncidentSeverity;
  confidence: number; // 0-100
  timestamp: string;
  type: 'anomaly' | 'regression' | 'trend' | 'prediction';
  actionable: boolean;
}

export interface ActivityItem {
  id: string;
  actor: string;
  actorRole: string;
  avatarInitials: string;
  avatarColor: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'resolve' | 'deploy' | 'restart' | 'ai' | 'security' | 'alert' | 'create';
}

export interface BudgetData {
  todaySpend: number;
  monthlyBudget: number;
  monthlySpend: number;
  avgCostPerIncident: number;
  requestsToday: number;
  tokensToday: number;
  successRate: number;
  avgLatencyMs: number;
}

export interface KPISparkPoint {
  value: number;
  label: string;
}

export interface KPICard {
  id: string;
  title: string;
  value: string | number;
  rawValue: number;
  unit?: string;
  trend: number; // percentage, positive = good
  trendPositive: boolean;
  subtitle: string;
  sparkline: number[];
  iconName: string;
  iconColor: string;
  glowColor?: string;
}

// ─── cascadeflow Runtime Intelligence Layer (Slice 8) ────────

export type TaskComplexity = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ModelRegistryEntry {
  id: string;
  name: string;
  provider: AIModelProvider | 'openai' | 'anthropic' | 'gemini' | 'ollama';
  modelId: string;
  description: string;
  contextWindow: number;
  costPerMillionPromptTokens: number;
  costPerMillionCompletionTokens: number;
  latencySlaMs: number;
  qualityRating: number; // 0-100
  capabilities: ('log_analysis' | 'root_cause' | 'executive_summary' | 'code_generation' | 'fast_triage')[];
  isAvailable: boolean;
  isLocalFallback: boolean;
  tier: 'lightweight' | 'standard' | 'reasoning' | 'heavy';
}

export interface CascadeFlowRouteRequest {
  incidentId?: string;
  service: string;
  taskType: 'log_summary' | 'root_cause_analysis' | 'executive_report' | 'recovery_plan' | 'postmortem' | 'hindsight_query';
  prompt: string;
  complexity: TaskComplexity;
  maxLatencyMs?: number;
  maxCostUsd?: number;
  requireHighConfidence?: boolean;
}

export interface CascadeFlowRouteDecision {
  requestId: string;
  timestamp: string;
  selectedModel: ModelRegistryEntry;
  alternativeModels: {
    model: ModelRegistryEntry;
    rejectionReason: string;
  }[];
  reasonForSelection: string;
  confidenceScore: number; // 0-100
  estimatedLatencyMs: number;
  actualLatencyMs: number;
  estimatedCostUsd: number;
  actualCostUsd: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  policyDecisions: {
    policyName: string;
    passed: boolean;
    reason: string;
  }[];
  wasEscalated: boolean;
  wasFallbackActivated: boolean;
  memoryUsedCount: number;
}

export interface BudgetStatus {
  todaySpendUsd: number;
  weeklySpendUsd: number;
  monthlySpendUsd: number;
  monthlyBudgetUsd: number;
  budgetRemainingUsd: number;
  averageCostPerIncidentUsd: number;
  averageCostPerUserUsd: number;
  averageTokensPerRequest: number;
  forecastedMonthlySpendUsd: number;
  dailyBudgetUsd: number;
}

export interface BudgetPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  maxDailyBudgetUsd: number;
  maxMonthlyBudgetUsd: number;
  maxCostPerIncidentUsd: number;
  maxTokensPerRequest: number;
  degradationAction: 'throttle' | 'fallback_lightweight' | 'block_non_critical';
  fallbackModelId: string;
}

export interface LatencyMetrics {
  averageResponseTimeMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  fastestResponseMs: number;
  slowestResponseMs: number;
  latencyTrendPercent: number; // positive = faster/improved
  timeline: { time: string; latencyMs: number; modelId: string }[];
}

export interface QualityMetrics {
  averageConfidencePercent: number;
  escalationRatePercent: number;
  fallbackRatePercent: number;
  successfulRecommendations: number;
  rejectedRecommendations: number;
  memoryUtilizationPercent: number;
}

export interface RuntimeTimelineEvent {
  id: string;
  time: string;
  stage: 'received' | 'complexity' | 'budget' | 'policy' | 'model_select' | 'inference' | 'confidence' | 'memory' | 'audit';
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'in_progress';
  metadata?: Record<string, any>;
}

export interface PolicyRule {
  id: string;
  name: string;
  category: 'budget' | 'provider' | 'quality' | 'memory' | 'security';
  description: string;
  enabled: boolean;
  action: 'enforce' | 'warn' | 'block' | 'escalate' | 'fallback';
  ruleExpression: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  incidentId: string;
  incidentTitle: string;
  selectedModel: string;
  latencyMs: number;
  tokens: number;
  costUsd: number;
  confidence: number;
  memoryUsed: boolean;
  policyDecision: 'Approved' | 'Escalated' | 'Fallback Activated' | 'Blocked';
  status: 'Success' | 'Degraded' | 'Failed';
}

export interface CostOptimizationStats {
  beforeCascadeFlow: {
    averageCostUsd: number;
    averageLatencyMs: number;
  };
  afterCascadeFlow: {
    averageCostUsd: number;
    averageLatencyMs: number;
  };
  costSavedPercent: number;
  latencyImprovementPercent: number;
  totalDollarsSavedUsd: number;
  totalHoursSaved: number;
}

export interface RuntimeAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  type: 'budget_nearing' | 'high_latency' | 'model_unavailable' | 'escalation_rate' | 'fallback_activated' | 'policy_violation';
  actionableText?: string;
  resolved: boolean;
}

