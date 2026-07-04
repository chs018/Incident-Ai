import { NextResponse } from 'next/server';
import { sendSlackNotification, sendSlackTestNotification } from '@/services/slack';

/**
 * Slack Integration API Route — AI Incident Commander
 *
 * GET: Sends a live test notification to #new-channel to verify connectivity.
 * POST: Sends an arbitrary incident notification or AI briefing to Slack.
 */

export async function GET() {
  try {
    const result = await sendSlackTestNotification();
    return NextResponse.json({
      status: 'success',
      endpoint: '/api/integrations/slack',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const result = await sendSlackNotification(payload);
    return NextResponse.json({
      status: 'success',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'error', message: error.message }, { status: 400 });
  }
}
