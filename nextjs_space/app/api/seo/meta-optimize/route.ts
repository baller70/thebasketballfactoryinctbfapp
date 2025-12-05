
/**
 * API Route: Meta Description Optimization
 * GET /api/seo/meta-optimize - Analyze meta descriptions
 * POST /api/seo/meta-optimize - Optimize meta descriptions
 */

import { NextResponse } from 'next/server';
import { analyzeMetaDescriptions, autoOptimizeMetaDescriptions } from '@/lib/seo-meta-optimizer';

export async function GET() {
  try {
    const lowCtrPages = await analyzeMetaDescriptions();

    return NextResponse.json({
      success: true,
      pages: lowCtrPages,
      count: lowCtrPages.length,
    });
  } catch (error: any) {
    console.error('Meta description analysis error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const dryRun = body.dryRun ?? true; // Default to dry run

    const results = await autoOptimizeMetaDescriptions(dryRun);

    return NextResponse.json({
      success: true,
      optimized: results.length,
      dryRun,
      results,
    });
  } catch (error: any) {
    console.error('Meta description optimization error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
