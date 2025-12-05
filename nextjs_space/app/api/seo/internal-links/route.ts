
/**
 * API Route: Internal Linking Analysis
 * GET /api/seo/internal-links - Get internal linking suggestions
 */

import { NextResponse } from 'next/server';
import { suggestInternalLinks, autoGenerateInternalLinks } from '@/lib/seo-internal-linking';

export async function GET() {
  try {
    const suggestions = await suggestInternalLinks();

    return NextResponse.json({
      success: true,
      suggestions: suggestions.slice(0, 50), // Top 50
      total: suggestions.length,
    });
  } catch (error: any) {
    console.error('Internal linking analysis error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const suggestions = await autoGenerateInternalLinks();

    return NextResponse.json({
      success: true,
      generated: suggestions.length,
      suggestions: suggestions.slice(0, 20), // Top 20
    });
  } catch (error: any) {
    console.error('Internal linking generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
