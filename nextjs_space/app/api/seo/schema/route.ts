
/**
 * API Route: Schema Markup Generation
 * GET /api/seo/schema - Generate schema markup for pages
 */

import { NextResponse } from 'next/server';
import { autoGenerateSchemaForAllPages } from '@/lib/seo-schema-generator';

export async function GET() {
  try {
    const results = await autoGenerateSchemaForAllPages();

    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      results,
      summary: {
        total: results.length,
        succeeded: successCount,
        failed: failedCount,
      },
    });
  } catch (error: any) {
    console.error('Schema generation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  // Same as GET for now
  return GET();
}
