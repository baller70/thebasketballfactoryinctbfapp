
/**
 * Google Analytics Data Sync API
 * Fetches data from Google Analytics and Search Console
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncGAData } from '@/lib/google-analytics';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    console.log('[Sync API] Starting data sync');
    const body = await request.json();
    console.log('[Sync API] Received body:', { propertyId: body.propertyId, siteUrl: body.siteUrl, days: body.days });
    
    const { propertyId, siteUrl, days = 30 } = body;

    // Validate inputs
    if (!propertyId || !siteUrl) {
      console.error('[Sync API] Missing required fields');
      return NextResponse.json(
        { error: 'Property ID and Site URL are required' },
        { status: 400 }
      );
    }

    // Check if Google Analytics is connected
    console.log('[Sync API] Checking if Google Analytics is connected...');
    const settings = await prisma.sEOSettings.findFirst();
    console.log('[Sync API] Settings found:', settings ? 'YES' : 'NO');
    console.log('[Sync API] Has auth tokens:', settings?.googleAuthTokens ? 'YES' : 'NO');

    if (!settings || !settings.googleAuthTokens) {
      console.error('[Sync API] Google Analytics not connected');
      return NextResponse.json(
        { error: 'Google Analytics not connected. Please authorize first.' },
        { status: 401 }
      );
    }

    // Perform sync
    console.log('[Sync API] Calling syncGAData...');
    const result = await syncGAData(propertyId, siteUrl, days);
    console.log('[Sync API] Sync result:', result);

    if (!result.success) {
      console.error('[Sync API] Sync failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Sync failed' },
        { status: 500 }
      );
    }

    console.log('[Sync API] Sync completed successfully');
    
    // Include warnings if any (e.g., Search Console access issues)
    const response: any = {
      success: true,
      message: 'Data synced successfully',
      metrics: result.metrics,
    };
    
    if (result.warnings && result.warnings.length > 0) {
      response.warnings = result.warnings;
      response.message = 'Data synced with warnings. Please review.';
    }
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[Sync API] ERROR:', error);
    console.error('[Sync API] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to sync data', details: error.message },
      { status: 500 }
    );
  }
}

// Get sync status
export async function GET() {
  try {
    const settings = await prisma.sEOSettings.findFirst();

    const lastSync = await prisma.sEOAuditLog.findFirst({
      where: { action: 'sync_google_analytics' },
      orderBy: { timestamp: 'desc' },
    });

    return NextResponse.json({
      connected: !!settings?.googleAuthTokens,
      configured: !!settings?.googleAnalyticsPropertyId && !!settings?.googleSearchConsoleSiteUrl,
      propertyId: settings?.googleAnalyticsPropertyId,
      siteUrl: settings?.googleSearchConsoleSiteUrl,
      lastSync: lastSync?.timestamp,
    });
  } catch (error: any) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync status', details: error.message },
      { status: 500 }
    );
  }
}
