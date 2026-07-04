import { NextResponse } from 'next/server';
import { createIncidentInDb } from '@/lib/db/repository';

/**
 * Universal Alert Ingestion Webhook — AI Incident Commander
 *
 * Receives automated alerts from Sentry, PagerDuty, Datadog, or AWS CloudWatch.
 * Automatically parses the payload, creates a new incident in Supabase (or local fallback),
 * and can trigger immediate AI triage.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    console.log('[Webhook Ingestion] Received alert payload:', payload);

    // 1. Detect source and extract fields
    let title = 'Automated Alert Ingested';
    let description = 'An automated monitoring alert was triggered in production.';
    let service = 'payment-api';
    let severity = 'high';
    let priority = 'P1';
    let environment = 'production';
    let tags = ['alert', 'webhook'];

    // Handle Sentry Webhook format
    if (payload.action || payload.event || payload.issue_title || payload.project_name || payload.culprit) {
      title = `[Sentry] ${payload.issue_title || payload.event?.title || payload.message || 'Unhandled Exception'}`;
      description = `Error in ${payload.project_name || payload.event?.project || 'service'}: ${payload.culprit || payload.event?.culprit || payload.message || 'Check Sentry dashboard for stack trace.'}`;
      service = payload.project_name || payload.event?.project || 'payment-api';
      severity = payload.level === 'fatal' || payload.event?.level === 'fatal' ? 'critical' : 'high';
      priority = severity === 'critical' ? 'P0' : 'P1';
      tags = ['sentry', 'exception', 'auto-triaged'];
    } 
    // Handle Datadog / PagerDuty / Generic format
    else {
      if (payload.title || payload.summary) title = payload.title || payload.summary;
      if (payload.description || payload.message) description = payload.description || payload.message;
      if (payload.service || payload.component) service = payload.service || payload.component;
      if (payload.severity) severity = payload.severity.toLowerCase();
      if (payload.priority) priority = payload.priority.toUpperCase();
      if (payload.environment || payload.env) environment = payload.environment || payload.env;
    }

    // 2. Persist incident to DB or fallback
    const result = await createIncidentInDb({
      title,
      description,
      priority,
      severity,
      service,
      environment,
      tags,
    });

    if (!result.success) {
      return NextResponse.json({ error: 'Failed to ingest incident into database' }, { status: 500 });
    }

    // 3. Return success response with instruction for AI triage
    return NextResponse.json({
      success: true,
      message: 'Alert ingested successfully and incident created.',
      incidentId: result.incidentId,
      triageUrl: `/api/analyze-incident`,
      timestamp: new Date().toISOString(),
    }, { status: 201 });

  } catch (error: any) {
    console.error('[Webhook Ingestion] Error processing payload:', error);
    return NextResponse.json({ error: 'Invalid JSON payload or processing failure', details: error.message }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    endpoint: '/api/webhooks/ingest',
    supportedSources: ['Sentry', 'Datadog', 'PagerDuty', 'AWS CloudWatch', 'Generic JSON'],
    instructions: 'Send a POST request with JSON payload containing title, description, service, and severity.',
  });
}
