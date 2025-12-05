
/**
 * Google Analytics Data API Service
 * Handles authentication and data fetching from Google Analytics 4
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { google } from 'googleapis';
import { prisma } from './db';

// Types
export interface GACredentials {
  access_token: string;
  refresh_token: string;
  expiry_date: number;
}

export interface GAMetrics {
  impressions: number;
  clicks: number;
  organicTraffic: number;
  averagePosition: number;
  ctr: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
}

export interface GAPageData {
  pagePath: string;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface GAKeywordData {
  keyword: string;
  impressions: number;
  clicks: number;
  position: number;
  ctr: number;
}

/**
 * Create OAuth2 client for Google APIs
 */
export function createOAuth2Client() {
  // IMPORTANT: Hardcoded to match Google Cloud Console configuration
  // This must match EXACTLY what's configured in Google Cloud Console OAuth credentials
  const redirectUri = 'https://thebasketballfactoryinc.com/api/seo/google/callback';

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  return oauth2Client;
}

/**
 * Get authorization URL for OAuth flow
 */
export function getAuthUrl(): string {
  const oauth2Client = createOAuth2Client();

  const scopes = [
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/userinfo.email', // Add email scope to identify account
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'select_account consent', // FORCE account selection AND consent
    include_granted_scopes: true,
  });

  return authUrl;
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(code: string): Promise<GACredentials> {
  console.log('[getTokensFromCode] Starting token exchange');
  console.log('[getTokensFromCode] Authorization code length:', code.length);
  console.log('[getTokensFromCode] Client ID:', process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');
  console.log('[getTokensFromCode] Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET');
  
  const oauth2Client = createOAuth2Client();
  console.log('[getTokensFromCode] OAuth2 client created');

  try {
    console.log('[getTokensFromCode] Calling Google API to exchange code...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('[getTokensFromCode] Token exchange successful');
    console.log('[getTokensFromCode] Token details:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      hasIdToken: !!tokens.id_token,
      expiryDate: tokens.expiry_date,
      scope: tokens.scope
    });

    if (!tokens.access_token) {
      throw new Error('No access token received from Google');
    }

    if (!tokens.refresh_token) {
      console.warn('[getTokensFromCode] WARNING: No refresh token received. User may need to reauthorize.');
    }

    return {
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token!,
      expiry_date: tokens.expiry_date || Date.now() + 3600 * 1000,
    };
  } catch (error: any) {
    console.error('[getTokensFromCode] ERROR during token exchange:', error);
    console.error('[getTokensFromCode] Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response?.data
    });
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<GACredentials> {
  const oauth2Client = createOAuth2Client();

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();

  return {
    access_token: credentials.access_token!,
    refresh_token: refreshToken, // Keep the same refresh token
    expiry_date: credentials.expiry_date || Date.now() + 3600 * 1000,
  };
}

/**
 * Get Google Analytics Data API client with credentials
 * USING PROVEN WORKING CONFIGURATION from Google documentation
 */
async function getAnalyticsClient(credentials: GACredentials): Promise<BetaAnalyticsDataClient> {
  // Check if token is expired and refresh if needed
  let activeCredentials = credentials;
  if (credentials.expiry_date < Date.now()) {
    console.log('[getAnalyticsClient] Token expired, refreshing...');
    const newCredentials = await refreshAccessToken(credentials.refresh_token);
    
    // Update credentials in database
    const settings = await prisma.sEOSettings.findFirst();
    if (settings) {
      await prisma.sEOSettings.update({
        where: { id: settings.id },
        data: { googleAuthTokens: JSON.stringify(newCredentials) },
      });
    }
    
    activeCredentials = newCredentials;
  }

  console.log('[getAnalyticsClient] Creating BetaAnalyticsDataClient with credentials format...');
  
  // PROVEN WORKING PATTERN: Use credentials object format
  // This is the official pattern from @google-analytics/data documentation
  // It handles OAuth2 internally when provided in this format
  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: activeCredentials.refresh_token,
      type: 'authorized_user',
    }
  });

  console.log('[getAnalyticsClient] BetaAnalyticsDataClient created successfully');
  return analyticsDataClient;
}

/**
 * Fetch Google Analytics metrics for a date range
 */
export async function fetchGAMetrics(
  propertyId: string,
  startDate: string,
  endDate: string,
  credentials: GACredentials
): Promise<GAMetrics> {
  try {
    console.log('[fetchGAMetrics] Getting analytics client...');
    const client = await getAnalyticsClient(credentials);
    console.log('[fetchGAMetrics] Analytics client created');

    console.log('[fetchGAMetrics] Running report for property:', propertyId);
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate,
          endDate,
        },
      ],
      dimensions: [],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'sessions' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
      ],
    });
    console.log('[fetchGAMetrics] Report completed, rows:', response.rows?.length || 0);

    const row = response.rows?.[0];

    return {
      impressions: 0, // From Search Console
      clicks: 0, // From Search Console
      organicTraffic: parseInt(row?.metricValues?.[1]?.value || '0'),
      averagePosition: 0, // From Search Console
      ctr: 0, // From Search Console
      pageViews: parseInt(row?.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row?.metricValues?.[1]?.value || '0'),
      bounceRate: parseFloat(row?.metricValues?.[2]?.value || '0'),
    };
  } catch (error: any) {
    console.error('[fetchGAMetrics] ERROR:', error);
    console.error('[fetchGAMetrics] Error message:', error.message);
    if (error.code) {
      console.error('[fetchGAMetrics] Error code:', error.code);
    }
    throw error;
  }
}

/**
 * Fetch page-level analytics data
 */
export async function fetchPageData(
  propertyId: string,
  startDate: string,
  endDate: string,
  credentials: GACredentials
): Promise<GAPageData[]> {
  const client = await getAnalyticsClient(credentials);

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' },
    ],
    limit: 100,
    orderBys: [
      {
        metric: {
          metricName: 'screenPageViews',
        },
        desc: true,
      },
    ],
  });

  return (response.rows || []).map((row) => ({
    pagePath: row.dimensionValues?.[0]?.value || '',
    pageViews: parseInt(row.metricValues?.[0]?.value || '0'),
    sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    bounceRate: parseFloat(row.metricValues?.[2]?.value || '0'),
    avgSessionDuration: parseFloat(row.metricValues?.[3]?.value || '0'),
  }));
}

/**
 * Fetch Search Console keyword data using Google APIs
 */
export async function fetchSearchConsoleData(
  siteUrl: string,
  startDate: string,
  endDate: string,
  credentials: GACredentials
): Promise<GAKeywordData[]> {
  try {
    console.log('[fetchSearchConsoleData] Creating OAuth client...');
    const oauth2Client = createOAuth2Client();

    oauth2Client.setCredentials({
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      expiry_date: credentials.expiry_date,
    });
    console.log('[fetchSearchConsoleData] OAuth credentials set');

    console.log('[fetchSearchConsoleData] Creating Search Console client...');
    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
    console.log('[fetchSearchConsoleData] Search Console client created');

    console.log('[fetchSearchConsoleData] Querying site:', siteUrl);
    console.log('[fetchSearchConsoleData] Date range:', startDate, 'to', endDate);
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate,
        endDate,
        dimensions: ['query'],
        rowLimit: 100,
      },
    });
    console.log('[fetchSearchConsoleData] Query completed, rows:', response.data.rows?.length || 0);

    return (response.data.rows || []).map((row) => ({
      keyword: row.keys?.[0] || '',
      impressions: row.impressions || 0,
      clicks: row.clicks || 0,
      position: row.position || 0,
      ctr: row.ctr || 0,
    }));
  } catch (error: any) {
    console.error('[fetchSearchConsoleData] ERROR:', error);
    console.error('[fetchSearchConsoleData] Error message:', error.message);
    if (error.code) {
      console.error('[fetchSearchConsoleData] Error code:', error.code);
    }
    if (error.response) {
      console.error('[fetchSearchConsoleData] Error response:', JSON.stringify(error.response.data));
    }
    throw error;
  }
}

/**
 * Sync Google Analytics and Search Console data to database
 */
export async function syncGAData(
  propertyId: string,
  siteUrl: string,
  days: number = 30
): Promise<{ success: boolean; metrics?: GAMetrics; error?: string; warnings?: string[] }> {
  const warnings: string[] = [];
  
  try {
    console.log('[syncGAData] Starting sync...');
    console.log('[syncGAData] Property ID:', propertyId);
    console.log('[syncGAData] Site URL:', siteUrl);
    console.log('[syncGAData] Days:', days);
    
    // Get credentials from database
    const settings = await prisma.sEOSettings.findFirst();

    if (!settings || !settings.googleAuthTokens) {
      console.error('[syncGAData] No Google auth tokens found');
      return { success: false, error: 'Google Analytics not connected. Please authorize first.' };
    }

    console.log('[syncGAData] Getting credentials...');
    const credentials: GACredentials = typeof settings.googleAuthTokens === 'string' 
      ? JSON.parse(settings.googleAuthTokens) 
      : settings.googleAuthTokens as any;
    console.log('[syncGAData] Credentials retrieved successfully');
    console.log('[syncGAData] Token expires at:', new Date(credentials.expiry_date).toISOString());
    console.log('[syncGAData] Is token expired:', credentials.expiry_date < Date.now());

    // Calculate date range
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    console.log('[syncGAData] Date range:', startDate, 'to', endDate);

    // Fetch metrics from Google Analytics
    console.log('[syncGAData] Fetching GA metrics...');
    const metrics = await fetchGAMetrics(propertyId, startDate, endDate, credentials);
    console.log('[syncGAData] GA metrics fetched:', metrics);

    // Fetch Search Console data (allow this to fail gracefully)
    let keywordData: GAKeywordData[] = [];
    console.log('[syncGAData] Fetching Search Console data...');
    try {
      keywordData = await fetchSearchConsoleData(siteUrl, startDate, endDate, credentials);
      console.log('[syncGAData] Search Console data fetched:', keywordData.length, 'keywords');
    } catch (searchConsoleError: any) {
      console.warn('[syncGAData] Search Console fetch failed (continuing with GA data only):', searchConsoleError.message);
      
      // Check if it's a permission error
      if (searchConsoleError.code === 403 || searchConsoleError.message?.includes('permission')) {
        warnings.push(
          'Search Console access denied. Please ensure the authorized Google account has access to Search Console for this site. ' +
          'Google Analytics data was synced successfully, but keyword data from Search Console is unavailable.'
        );
      } else if (searchConsoleError.code === 404) {
        warnings.push(
          'Search Console property not found. Please verify the site URL matches exactly what\'s configured in Search Console. ' +
          'Google Analytics data was synced successfully, but keyword data from Search Console is unavailable.'
        );
      } else {
        warnings.push(
          `Search Console sync failed: ${searchConsoleError.message}. ` +
          'Google Analytics data was synced successfully, but keyword data from Search Console is unavailable.'
        );
      }
    }

    // Update metrics with Search Console data (if available)
    if (keywordData.length > 0) {
      metrics.impressions = keywordData.reduce((sum, kw) => sum + kw.impressions, 0);
      metrics.clicks = keywordData.reduce((sum, kw) => sum + kw.clicks, 0);
      metrics.averagePosition = keywordData.reduce((sum, kw) => sum + kw.position, 0) / keywordData.length;
      metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
      console.log('[syncGAData] Updated metrics with Search Console data:', metrics);

      // Store keyword performance data
      console.log('[syncGAData] Storing keyword performance data...');
      
      // Deduplicate keywords first
      const uniqueKeywords = new Map();
      for (const kw of keywordData) {
        if (!uniqueKeywords.has(kw.keyword)) {
          uniqueKeywords.set(kw.keyword, kw);
        } else {
          // Merge data for duplicate keywords
          const existing = uniqueKeywords.get(kw.keyword);
          existing.impressions += kw.impressions;
          existing.clicks += kw.clicks;
          existing.position = (existing.position + kw.position) / 2; // Average position
        }
      }
      
      for (const kw of uniqueKeywords.values()) {
        try {
          // Find or create keyword
          let keyword = await prisma.sEOKeyword.findUnique({
            where: { keyword: kw.keyword },
          });

          if (!keyword) {
            keyword = await prisma.sEOKeyword.create({
              data: {
                keyword: kw.keyword,
                searchVolume: Math.round(kw.impressions),
                difficulty: 0,
                targetLocation: 'New Jersey',
                priority: 5, // Medium priority
                category: 'generic',
                isActive: true,
              },
            });
          }

          // Store performance data
          await prisma.sEOPerformance.create({
            data: {
              keywordId: keyword.id,
              dateKey: endDate,
              impressions: kw.impressions,
              clicks: kw.clicks,
              position: kw.position,
              organicTraffic: kw.clicks, // Assume clicks = traffic for organic
              conversions: 0,
            },
          });
        } catch (error: any) {
          console.log(`[syncGAData] Error storing keyword "${kw.keyword}":`, error.message);
          // Continue with next keyword
        }
      }
      console.log('[syncGAData] Keyword performance data stored');
    } else {
      console.log('[syncGAData] No keyword data to store (Search Console unavailable or no data)');
    }

    // Log the sync
    console.log('[syncGAData] Creating audit log...');
    await prisma.sEOAuditLog.create({
      data: {
        performedBy: 'system',
        action: 'sync_google_analytics',
        entityType: 'analytics',
        entityId: 'ga_sync',
        changes: {
          startDate,
          endDate,
          keywordsImported: keywordData.length,
          impressions: metrics.impressions,
          clicks: metrics.clicks,
          organicTraffic: metrics.organicTraffic,
          warnings: warnings.length > 0 ? warnings : undefined,
        } as any,
      },
    });
    console.log('[syncGAData] Audit log created');

    console.log('[syncGAData] Sync completed successfully');
    return { success: true, metrics, warnings: warnings.length > 0 ? warnings : undefined };
  } catch (error: any) {
    console.error('[syncGAData] ERROR:', error);
    console.error('[syncGAData] Error name:', error.name);
    console.error('[syncGAData] Error message:', error.message);
    console.error('[syncGAData] Error stack:', error.stack);
    if (error.response) {
      console.error('[syncGAData] Error response:', error.response);
    }
    if (error.code) {
      console.error('[syncGAData] Error code:', error.code);
    }
    
    // Provide specific error messages based on error type
    let errorMessage = error.message || 'Unknown error occurred';
    if (error.code === 403) {
      errorMessage = 'Permission denied. Please ensure the authorized Google account has access to both Google Analytics and Search Console for this property.';
    } else if (error.code === 404) {
      errorMessage = 'Property not found. Please verify your GA4 Property ID and Search Console Site URL are correct.';
    } else if (error.code === 401) {
      errorMessage = 'Authentication failed. Please reconnect your Google account.';
    }
    
    return { success: false, error: errorMessage };
  }
}
