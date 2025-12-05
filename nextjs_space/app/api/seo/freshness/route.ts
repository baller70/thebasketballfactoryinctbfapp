
/**
 * API Route: Content Freshness Monitoring
 * GET /api/seo/freshness - Analyze content freshness
 * POST /api/seo/freshness - Update stale content
 */

import { NextResponse } from 'next/server';
import { analyzeContentFreshness, autoUpdateStaleContent } from '@/lib/seo-content-freshness';

export async function GET() {
  try {
    const analysis = await analyzeContentFreshness();

    return NextResponse.json({
      success: true,
      stalePages: analysis,
      summary: {
        total: analysis.length,
        high: analysis.filter((p) => p.priority === 'high').length,
        medium: analysis.filter((p) => p.priority === 'medium').length,
        low: analysis.filter((p) => p.priority === 'low').length,
      },
    });
  } catch (error: any) {
    console.error('Content freshness analysis error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const stalePages = await autoUpdateStaleContent(false); // Actually update

    return NextResponse.json({
      success: true,
      updated: stalePages.length,
      pages: stalePages,
    });
  } catch (error: any) {
    console.error('Content freshness update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
