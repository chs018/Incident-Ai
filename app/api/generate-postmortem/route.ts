/**
 * POST /api/generate-postmortem
 * Server-side bridge: receives an Incident and returns a markdown postmortem string.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePostmortem } from '@/services/ai';
import { Incident } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const incident: Incident = await req.json();

    if (!incident?.id || !incident?.title) {
      return NextResponse.json({ error: 'Invalid incident payload' }, { status: 400 });
    }

    const postmortem = await generatePostmortem(incident);
    return NextResponse.json({ content: postmortem });
  } catch (error) {
    console.error('[API] generate-postmortem error:', error);
    return NextResponse.json(
      { error: 'Postmortem generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
