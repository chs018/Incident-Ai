/**
 * POST /api/analyze-incident
 * Server-side bridge: receives an Incident and returns AIAnalysis JSON.
 * The Groq client MUST run server-side — this route is the only way to call it from client components.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeIncident } from '@/services/ai';
import { Incident } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const incident: Incident = await req.json();

    if (!incident?.id || !incident?.title) {
      return NextResponse.json({ error: 'Invalid incident payload' }, { status: 400 });
    }

    const analysis = await analyzeIncident(incident);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('[API] analyze-incident error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}
