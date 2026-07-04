import { NextResponse } from 'next/server';
import { getIncidentById } from '@/lib/db/repository';
import { sendSlackNotification } from '@/services/slack';
import { createLinearTicket, createTicketsFromPostmortem } from '@/services/linear';

/**
 * Unified Incident Action & Alerting API — AI Incident Commander
 *
 * Handles one-click operational triggers from the War Room:
 * - slack_broadcast: Broadcasts real-time incident status and AI hypothesis to Slack
 * - create_ticket: Creates a Linear/Jira engineering ticket for the incident
 * - sync_postmortem_tickets: Batch-creates tickets for all postmortem action items
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, customMessage, actionItemTitle, actionItems } = body;

    const incident = await getIncidentById(id);
    if (!incident) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    // ─── 1. Slack Broadcast Action ──────────────────────────────────────────
    if (action === 'slack_broadcast') {
      const aiSummary = incident.aiAnalysis?.rootCause || incident.description || 'AI triage currently analyzing telemetry streams.';
      const res = await sendSlackNotification({
        title: `🚨 [${incident.severity.toUpperCase()}] ${incident.title}`,
        message: customMessage || `*Emergency War Room Broadcast*\n\n*AI Root Cause Hypothesis:*\n${aiSummary}`,
        severity: incident.severity as any,
        service: incident.service,
        incidentId: incident.id,
        url: `http://localhost:3000/war-room/${incident.id}`,
        fields: {
          'Status': `\`${incident.status.toUpperCase()}\``,
          'Affected Service': `\`${incident.service}\``,
          'Environment': `\`${incident.environment}\``,
          'Incident Commander': `*${incident.commander?.name || 'Unassigned'}*`,
        },
      });

      return NextResponse.json({
        success: true,
        action: 'slack_broadcast',
        result: res,
        toast: res.simulated
          ? `Simulated Slack alert sent for ${incident.id} (add SLACK_WEBHOOK_URL in .env.local for live delivery).`
          : `Live emergency broadcast posted to Slack for ${incident.id}!`,
      });
    }

    // ─── 2. Create Single Ticket Action ─────────────────────────────────────
    if (action === 'create_ticket') {
      const title = actionItemTitle || `[${incident.id}] Fix root cause in ${incident.service}: ${incident.title}`;
      const desc = incident.aiAnalysis?.rootCause || incident.description;
      const res = await createLinearTicket({
        title,
        description: desc,
        priority: incident.severity === 'critical' ? 1 : 2,
        incidentId: incident.id,
        url: `http://localhost:3000/war-room/${incident.id}`,
      });

      return NextResponse.json({
        success: true,
        action: 'create_ticket',
        result: res,
        toast: res.simulated
          ? `Created engineering ticket ${res.ticketId} (Simulated mode).`
          : `Created live Linear ticket ${res.ticketId}!`,
      });
    }

    // ─── 3. Batch Postmortem Tickets Action ─────────────────────────────────
    if (action === 'sync_postmortem_tickets') {
      const items = actionItems || incident.aiAnalysis?.recommendedActions || ['Implement aggressive retry jitter', 'Add rate limiting to Redis cluster'];
      const res = await createTicketsFromPostmortem({
        incidentId: incident.id,
        title: incident.title,
        actionItems: items,
      });

      return NextResponse.json({
        success: true,
        action: 'sync_postmortem_tickets',
        result: res,
        toast: `Created ${res.createdCount} Linear action item tickets from AI Postmortem!`,
      });
    }

    return NextResponse.json({ error: 'Unknown action type requested' }, { status: 400 });
  } catch (error: any) {
    console.error('[Incident Action API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
