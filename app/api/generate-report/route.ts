/**
 * POST /api/generate-report
 * Server-side bridge: receives an Incident and returns structured ExecutiveReport JSON.
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateExecutiveReport } from '@/services/ai';
import { Incident } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const incident: Incident = await req.json();

    if (!incident?.id || !incident?.title) {
      return NextResponse.json({ error: 'Invalid incident payload' }, { status: 400 });
    }

    const report = await generateExecutiveReport(incident);
    return NextResponse.json(report);
  } catch (error) {
    console.error('[API] generate-report error:', error);
    return NextResponse.json(
      { error: 'Report generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
