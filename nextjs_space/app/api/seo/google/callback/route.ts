
/**
 * Google Analytics OAuth Callback Handler
 * Exchanges authorization code for tokens and stores them
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCode } from '@/lib/google-analytics';
import { prisma } from '@/lib/db';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('[OAuth Callback] Starting OAuth callback process');
    
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log('[OAuth Callback] Code received:', code ? 'YES' : 'NO');
    console.log('[OAuth Callback] Error received:', error || 'NONE');

    if (error) {
      console.error('[OAuth Callback] Google returned error:', error);
      return NextResponse.redirect(
        new URL(`/admin/seo?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      console.error('[OAuth Callback] No authorization code received');
      return NextResponse.redirect(
        new URL('/admin/seo?error=no_code', request.url)
      );
    }

    // Exchange code for tokens
    console.log('[OAuth Callback] Exchanging code for tokens...');
    const credentials = await getTokensFromCode(code);
    console.log('[OAuth Callback] Tokens received successfully:', {
      hasAccessToken: !!credentials.access_token,
      hasRefreshToken: !!credentials.refresh_token,
      expiryDate: credentials.expiry_date
    });
    
    // Verify which account was authorized
    const { google } = await import('googleapis');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://thebasketballfactoryinc.com/api/seo/google/callback'
    );
    oauth2Client.setCredentials({
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      expiry_date: credentials.expiry_date
    });
    
    // Get the email of the authorized account
    let authorizedEmail = 'unknown';
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      authorizedEmail = userInfo.data.email || 'unknown';
      console.log('[OAuth Callback] ✅ AUTHORIZED GOOGLE ACCOUNT:', authorizedEmail);
    } catch (emailError: any) {
      console.error('[OAuth Callback] ⚠️  Could not fetch user email:', emailError.message);
    }

    // Store credentials in database
    console.log('[OAuth Callback] Finding/creating SEO settings...');
    let settings = await prisma.sEOSettings.findFirst();
    if (!settings) {
      console.log('[OAuth Callback] No settings found, creating new...');
      settings = await prisma.sEOSettings.create({ data: {} });
    }
    console.log('[OAuth Callback] Settings ID:', settings.id);

    console.log('[OAuth Callback] Updating settings with credentials...');
    await prisma.sEOSettings.update({
      where: { id: settings.id },
      data: {
        googleAuthTokens: JSON.stringify(credentials),
        googleAnalyticsEnabled: true,
        googleSearchConsoleEnabled: true,
      },
    });
    console.log('[OAuth Callback] Settings updated successfully');

    // Log the connection
    console.log('[OAuth Callback] Creating audit log entry...');
    await prisma.sEOAuditLog.create({
      data: {
        performedBy: authorizedEmail,
        action: 'connect_google_analytics',
        entityType: 'settings',
        entityId: settings.id,
        changes: {
          message: 'Google Analytics connected successfully',
          authorizedAccount: authorizedEmail,
          timestamp: new Date().toISOString(),
        },
      },
    });
    console.log('[OAuth Callback] Audit log created');

    // Redirect to success page
    console.log('[OAuth Callback] Redirecting to success page...');
    return NextResponse.redirect(
      new URL('/admin/seo?connected=true', request.url)
    );
  } catch (error: any) {
    console.error('[OAuth Callback] FATAL ERROR:', error);
    console.error('[OAuth Callback] Error name:', error.name);
    console.error('[OAuth Callback] Error message:', error.message);
    console.error('[OAuth Callback] Error stack:', error.stack);
    
    return NextResponse.redirect(
      new URL(`/admin/seo?error=${encodeURIComponent(error.message || 'Unknown error')}`, request.url)
    );
  }
}
