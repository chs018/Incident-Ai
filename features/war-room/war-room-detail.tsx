'use client';

/**
 * War Room Detail — Slice 6 Enterprise AI Mission Control (Groq Qwen3-32B)
 *
 * Layout (12-column responsive grid):
 *   [Full Width] Incident Header (Title, MTTR live timer, priority/status controls, action bar)
 *   [3-col Left] Overview Card, Service Dependency Map (Blast Radius), Team Collaboration
 *   [6-col Center] AI Root Cause Analysis, AI Investigation Panel, AI Conversation History, Live Log Viewer, Telemetry Metrics, Timeline, Evidence Hub
 *   [3-col Right] AI Suggested Recovery Plan (with terminal commands), Quick Actions Command Sidebar, Interactive Runbooks
 *   [Full Width] Postmortem Generator
 */

import { useState } from 'react';
import { Incident, AIAnalysis } from '@/types';
import { IncidentHeader } from './incident-header';
import { IncidentOverviewCard } from './incident-overview-card';
import { BlastRadiusMap } from './blast-radius-map';
import { TeamPanel } from './team-panel';
import { LogViewer } from './log-viewer';
import { MetricsPanel } from './metrics-panel';
import { AIAnalysisPanel } from './ai-analysis-panel';
import { AIInvestigationPanel } from './ai-investigation-panel';
import { AIConversationHistory } from './ai-conversation-history';
import { IncidentTimeline } from './incident-timeline';
import { AttachmentsPanel } from './attachments-panel';
import { RecoveryPlanPanel } from './recovery-plan-panel';
import { QuickActionsPanel } from './quick-actions-panel';
import { RunbookPanel } from './runbook-panel';
import { PostmortemPanel } from './postmortem-panel';
import { getAIConversationHistory } from '@/services/ai';
import { SimilarIncidentsPanel } from './similar-incidents-panel';
import { AIImprovementCard } from './ai-improvement-card';
import { MemoryConfidenceBadge } from './memory-confidence-badge';
import { EngineerFeedbackWidget } from './engineer-feedback-widget';
import { ReflectionWorkflowModal } from './reflection-workflow-modal';
import { Brain, Sparkles } from 'lucide-react';

interface WarRoomDetailProps {
  incident: Incident;
}

export function WarRoomDetail({ incident }: WarRoomDetailProps) {
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | undefined>(
    incident.aiAnalysis ?? undefined
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);

  // Handle analysis update from AIAnalysisPanel or Regenerate
  const handleAnalysisUpdated = (data: AIAnalysis) => {
    setCurrentAnalysis(data);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/analyze-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident),
      });
      if (res.ok) {
        const data: AIAnalysis = await res.json();
        setCurrentAnalysis(data);
      }
    } catch (error) {
      console.error('Failed to regenerate analysis:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Get conversation history (includes current and past runs)
  const history = getAIConversationHistory();

  return (
    <div className="p-4 md:p-6 max-w-[1680px] mx-auto space-y-6">

      {/* ── Section 1: Full-Width Incident Header ───────────────────── */}
      <IncidentHeader incident={incident} />

      {/* ── Section 2: Main 3-Column Enterprise Grid (12-col responsive) ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left Column (3/12 on large desktop): Overview, Service Dependencies, Team, Memory Confidence & Feedback */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-5">
          <IncidentOverviewCard incident={incident} />
          <MemoryConfidenceBadge confidence={currentAnalysis?.memoryConfidence} />
          <BlastRadiusMap incident={incident} />
          <TeamPanel incident={incident} />
          <EngineerFeedbackWidget incidentId={incident.id} />
        </div>

        {/* Center Column (6/12 on large desktop): AI Root Cause, AI Improvement (Demo Highlight), Similar Incidents, Investigation, Logs, Telemetry */}
        <div className="lg:col-span-8 xl:col-span-6 space-y-5">
          <AIAnalysisPanel
            incident={incident}
            onAnalysisUpdated={handleAnalysisUpdated}
          />

          {/* THE DEMO HIGHLIGHT: Without Memory vs With Memory Comparison Card */}
          <AIImprovementCard improvement={currentAnalysis?.aiImprovement} />

          {/* Hindsight Persistent Memory: Similar Historical Outages */}
          <SimilarIncidentsPanel incidents={currentAnalysis?.similarIncidents} />
          
          {/* Deep AI Investigation Panel (Observed Symptoms, Evidence, Expandable Root Cause Cards, Explainable Reasoning) */}
          <AIInvestigationPanel
            investigation={currentAnalysis?.investigation}
            isLoading={isRegenerating}
          />

          {/* AI Conversation & Triage History */}
          <AIConversationHistory
            history={history}
            onRegenerate={handleRegenerate}
            isLoading={isRegenerating}
          />

          <LogViewer />
          <MetricsPanel />
          <IncidentTimeline events={incident.timeline ?? []} />
          <AttachmentsPanel />
        </div>

        {/* Right Column (3/12 on large desktop): Recovery Plan (with terminal commands), Quick Actions, Runbooks */}
        <div className="lg:col-span-12 xl:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-5">
          <RecoveryPlanPanel
            recommendations={currentAnalysis?.recommendations}
            commands={currentAnalysis?.commands}
          />
          <div className="space-y-5">
            <QuickActionsPanel incidentId={incident.id} />
            <RunbookPanel incident={incident} />
          </div>
        </div>

      </div>

      {/* ── Section 3: Hindsight Reflection & Postmortem ────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-purple-900/30 via-[#161B26] to-indigo-900/30 p-5 rounded-xl border border-purple-500/30 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Brain className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Hindsight Persistent Memory Integration
              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono">
                Slice 7
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Trigger autonomous 5-question reflection to index lessons learned into institutional vector memory.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsReflectionModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
        >
          <Sparkles className="h-4 w-4" /> Trigger Autonomous Reflection
        </button>
      </div>

      {/* ── Section 4: Full-Width Postmortem Panel ────────────────────────── */}
      <PostmortemPanel incident={incident} />

      {/* Autonomous Post-Incident Reflection Modal */}
      <ReflectionWorkflowModal
        incident={incident}
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
      />

    </div>
  );
}
