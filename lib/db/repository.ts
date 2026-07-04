/**
 * Unified Data Repository Bridge — AI Incident Commander
 *
 * Implements the Hybrid Fallback Pattern:
 * 1. Attempts to fetch data from live Supabase PostgreSQL tables.
 * 2. If Supabase is unconfigured, unreachable, or empty, gracefully falls back to local rich datasets (`lib/mock-data/`).
 *
 * This ensures zero downtime, instant local development, and seamless cloud database scaling.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  incidents as mockIncidents,
  activeIncidents as mockActiveIncidents,
  dashboardMetrics as mockDashboardMetrics,
} from '@/lib/mock-data/incidents';
import {
  organizations as mockOrganizations,
  teamMembers as mockTeamMembers,
  teams as mockTeams,
} from '@/lib/mock-data/organizations';
import { Incident, IncidentStatus, Organization, TeamMember, Team } from '@/types';

let cachedClient: SupabaseClient | null = null;
function getSupabase(): SupabaseClient | null {
  if (cachedClient) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    cachedClient = createClient(url, key, { auth: { persistSession: false } });
    return cachedClient;
  } catch {
    return null;
  }
}

// ─── Incidents Repository ───────────────────────────────────────────────────

export async function getAllIncidents(): Promise<Incident[]> {
  const supabase = getSupabase();
  if (!supabase) return mockIncidents;

  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockIncidents;
    }

    // Map database snake_case to TypeScript camelCase
    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      priority: row.priority,
      severity: row.severity,
      status: row.status,
      environment: row.environment,
      service: row.service,
      affectedServices: row.blast_radius?.affectedDownstream || [row.service],
      team: 'Platform Engineering',
      assignee: mockTeamMembers[1],
      commander: mockTeamMembers[0],
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
      timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline) : (row.timeline || []),
      aiAnalysis: row.summary ? {
        summary: row.summary,
        rootCause: row.root_cause || '',
        impact: row.description,
        affectedUsers: row.affected_users || 0,
        confidence: 94,
        recommendedActions: typeof row.recommended_actions === 'string' ? JSON.parse(row.recommended_actions) : (row.recommended_actions || []),
        relatedIncidents: [],
        generatedAt: row.created_at,
        model: 'llama-3.3-70b-versatile',
      } : null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      resolvedAt: row.resolved_at || null,
      mttr: row.mttr || null,
      runbook: `https://runbooks.cloudnova.io/${row.service}/recovery`,
    }));
  } catch (err) {
    console.warn('[Repository] Supabase fetch failed, using fallback:', err);
    return mockIncidents;
  }
}

export async function getIncidentById(id: string): Promise<Incident | undefined> {
  const all = await getAllIncidents();
  return all.find(i => i.id === id);
}

export async function updateIncidentStatusInDb(id: string, status: IncidentStatus): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('incidents')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    return !error;
  } catch {
    return false;
  }
}

export async function createIncidentInDb(incidentData: {
  title: string;
  description: string;
  priority: string;
  severity: string;
  service: string;
  environment: string;
  tags?: string[];
}): Promise<{ success: boolean; incidentId?: string }> {
  const supabase = getSupabase();
  const id = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  if (!supabase) {
    const newInc: any = {
      id,
      title: incidentData.title,
      description: incidentData.description,
      priority: incidentData.priority as any,
      severity: incidentData.severity as any,
      status: 'investigating',
      environment: incidentData.environment as any,
      service: incidentData.service,
      affectedServices: [incidentData.service],
      team: 'Platform Engineering',
      assignee: mockTeamMembers[1],
      commander: mockTeamMembers[0],
      tags: incidentData.tags || ['sentry', 'alert', 'auto-ingested'],
      timeline: [
        {
          id: `t-${Date.now()}`,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          author: 'Sentry Webhook',
          authorRole: 'Automated Alerting',
          content: `Incident auto-created by alert ingestion: ${incidentData.title}`,
          type: 'alert',
        }
      ],
      aiAnalysis: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      mttr: null,
      runbook: `https://runbooks.cloudnova.io/${incidentData.service}/recovery`,
    };
    mockIncidents.unshift(newInc);
    return { success: true, incidentId: id };
  }

  try {
    const { error } = await supabase
      .from('incidents')
      .insert({
        id,
        title: incidentData.title,
        description: incidentData.description,
        priority: incidentData.priority,
        severity: incidentData.severity,
        status: 'investigating',
        environment: incidentData.environment,
        service: incidentData.service,
        tags: JSON.stringify(incidentData.tags || ['sentry', 'alert', 'auto-ingested']),
        timeline: JSON.stringify([
          {
            id: `t-${Date.now()}`,
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            author: 'Sentry Webhook',
            authorRole: 'Automated Alerting',
            content: `Incident auto-created by alert ingestion: ${incidentData.title}`,
            type: 'alert',
          }
        ]),
        created_at: now,
        updated_at: now,
      });

    if (error) {
      console.error('[Repository] Supabase insert failed:', error);
      return { success: false };
    }
    return { success: true, incidentId: id };
  } catch (err) {
    console.error('[Repository] Supabase insert exception:', err);
    return { success: false };
  }
}

// ─── Dashboard & Metrics Repository ─────────────────────────────────────────

export async function getDashboardData() {
  const incidents = await getAllIncidents();
  const active = incidents.filter(i => i.status !== 'resolved' && i.status !== 'postmortem');

  return {
    activeIncidents: active,
    metrics: mockDashboardMetrics,
  };
}

// ─── Organization & Team Repository ─────────────────────────────────────────

export async function getOrganizations(): Promise<Organization[]> {
  const supabase = getSupabase();
  if (!supabase) return mockOrganizations;

  try {
    const { data, error } = await supabase.from('organizations').select('*');
    if (error || !data || data.length === 0) return mockOrganizations;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      avatarColor: row.avatar_color || '#3B82F6',
      plan: row.plan || 'enterprise',
      memberCount: row.member_count || 10,
    }));
  } catch {
    return mockOrganizations;
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const supabase = getSupabase();
  if (!supabase) return mockTeamMembers;

  try {
    const { data, error } = await supabase.from('team_members').select('*');
    if (error || !data || data.length === 0) return mockTeamMembers;

    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role as any,
      avatarInitials: row.avatar_initials,
      avatarColor: row.avatar_color || '#6366F1',
      team: row.team || 'Platform Engineering',
      status: row.status as any || 'online',
      incidentsResolved: row.incidents_resolved || 0,
      joinedAt: row.joined_at,
    }));
  } catch {
    return mockTeamMembers;
  }
}

export async function getTeams(): Promise<Team[]> {
  return mockTeams;
}
