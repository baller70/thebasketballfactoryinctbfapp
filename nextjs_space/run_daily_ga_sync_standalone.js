#!/usr/bin/env node

/**
 * Standalone Daily Google Analytics Sync
 * This script syncs GA data without requiring the full Next.js environment
 */

const { PrismaClient } = require('@prisma/client');
const https = require('https');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, 'nextjs_space', '.env') });

const LOG_DIR = '/home/ubuntu/seo_automation_logs';
const REPORT_DIR = path.join(__dirname, 'seo_reports');

// Ensure directories exist
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

/**
 * Make HTTPS request
 */
function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    
    req.end();
  });
}

/**
 * Refresh Google OAuth token
 */
async function refreshToken(refreshToken) {
  console.log('[Token Refresh] Refreshing access token...');
  
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in environment');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });

  const response = await httpsRequest('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  });

  if (response.status !== 200) {
    throw new Error(`Token refresh failed: ${JSON.stringify(response.data)}`);
  }

  console.log('[Token Refresh] ✓ Token refreshed successfully');
  
  return {
    access_token: response.data.access_token,
    refresh_token: refreshToken,
    expiry_date: Date.now() + (response.data.expires_in * 1000)
  };
}

/**
 * Fetch GA4 data
 */
async function fetchGA4Data(propertyId, accessToken, startDate, endDate) {
  console.log(`[GA4 Fetch] Fetching data from ${startDate} to ${endDate}...`);
  
  const requestBody = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [
      { name: 'date' },
      { name: 'pagePath' }
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'sessions' },
      { name: 'engagementRate' },
      { name: 'averageSessionDuration' }
    ]
  };

  const response = await httpsRequest(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (response.status !== 200) {
    throw new Error(`GA4 API error: ${response.status} - ${JSON.stringify(response.data)}`);
  }

  console.log(`[GA4 Fetch] ✓ Received ${response.data.rows?.length || 0} rows`);
  return response.data;
}

/**
 * Fetch Search Console data
 */
async function fetchSearchConsoleData(siteUrl, accessToken, startDate, endDate) {
  console.log(`[GSC Fetch] Fetching data from ${startDate} to ${endDate}...`);
  
  const requestBody = {
    startDate,
    endDate,
    dimensions: ['page', 'query'],
    rowLimit: 1000
  };

  const encodedSiteUrl = encodeURIComponent(siteUrl);
  const response = await httpsRequest(
    `https://www.googleapis.com/webmasters/v3/sites/${encodedSiteUrl}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (response.status !== 200) {
    throw new Error(`GSC API error: ${response.status} - ${JSON.stringify(response.data)}`);
  }

  console.log(`[GSC Fetch] ✓ Received ${response.data.rows?.length || 0} rows`);
  return response.data;
}

/**
 * Store GA4 data in database
 */
async function storeGA4Data(data, propertyId) {
  if (!data.rows || data.rows.length === 0) {
    console.log('[Store GA4] No data to store');
    return 0;
  }

  let count = 0;
  for (const row of data.rows) {
    const dateStr = row.dimensionValues[0].value; // Format: YYYYMMDD
    const pagePath = row.dimensionValues[1].value;
    const pageViews = parseInt(row.metricValues[0].value) || 0;
    const sessions = parseInt(row.metricValues[1].value) || 0;
    const engagementRate = parseFloat(row.metricValues[2].value) || 0;
    const avgSessionDuration = parseFloat(row.metricValues[3].value) || 0;

    // Parse date from YYYYMMDD format
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(`${year}-${month}-${day}`);
    const dateKey = `${year}-${month}-${day}`;

    // Check if record exists
    const existing = await prisma.sEOPerformance.findFirst({
      where: {
        dateKey,
        pagePath,
        source: 'GA4'
      }
    });

    if (existing) {
      await prisma.sEOPerformance.update({
        where: { id: existing.id },
        data: {
          pageViews,
          uniqueVisitors: sessions,
          avgSessionDuration,
          conversionRate: engagementRate * 100
        }
      });
    } else {
      await prisma.sEOPerformance.create({
        data: {
          date,
          dateKey,
          pagePath,
          pageViews,
          uniqueVisitors: sessions,
          avgSessionDuration,
          conversionRate: engagementRate * 100,
          source: 'GA4'
        }
      });
    }
    count++;
  }

  console.log(`[Store GA4] ✓ Stored ${count} records`);
  return count;
}

/**
 * Store Search Console data in database
 */
async function storeSearchConsoleData(data, siteUrl) {
  if (!data.rows || data.rows.length === 0) {
    console.log('[Store GSC] No data to store');
    return 0;
  }

  const today = new Date();
  const dateKey = today.toISOString().split('T')[0];

  let count = 0;
  for (const row of data.rows) {
    const pagePath = row.keys[0];
    const query = row.keys[1];
    const clicks = row.clicks || 0;
    const impressions = row.impressions || 0;
    const ctr = (row.ctr || 0) * 100; // Convert to percentage
    const position = row.position || 0;

    // Update or create SEO performance record
    const existingRecord = await prisma.sEOPerformance.findFirst({
      where: {
        dateKey,
        pagePath,
        source: 'GSC'
      }
    });

    if (existingRecord) {
      await prisma.sEOPerformance.update({
        where: { id: existingRecord.id },
        data: {
          clicks: (existingRecord.clicks || 0) + clicks,
          impressions: (existingRecord.impressions || 0) + impressions,
          ctr: ((existingRecord.ctr || 0) + ctr) / 2,
          position: ((existingRecord.position || 0) + position) / 2
        }
      });
    } else {
      await prisma.sEOPerformance.create({
        data: {
          date: today,
          dateKey,
          pagePath,
          clicks,
          impressions,
          ctr,
          position,
          source: 'GSC'
        }
      });
    }
    count++;
  }

  console.log(`[Store GSC] ✓ Stored ${count} records`);
  return count;
}

/**
 * Main sync function
 */
async function runSync() {
  const startTime = Date.now();
  console.log('\n=== Daily Google Analytics Sync ===');
  console.log(`Started at: ${new Date().toISOString()}\n`);

  try {
    // Get SEO settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      throw new Error('No SEO settings found in database');
    }

    if (!settings.googleAuthTokens) {
      throw new Error('No Google auth tokens found in settings');
    }

    const tokens = typeof settings.googleAuthTokens === 'string'
      ? JSON.parse(settings.googleAuthTokens)
      : settings.googleAuthTokens;

    if (!tokens.refresh_token) {
      throw new Error('No refresh token found');
    }

    // Check if token is expired and refresh if needed
    let accessToken = tokens.access_token;
    const isExpired = tokens.expiry_date && tokens.expiry_date < Date.now();
    
    if (isExpired || !accessToken) {
      console.log('[Auth] Token expired or missing, refreshing...');
      const newTokens = await refreshToken(tokens.refresh_token);
      accessToken = newTokens.access_token;
      
      // Update tokens in database
      await prisma.sEOSettings.update({
        where: { id: settings.id },
        data: {
          googleAuthTokens: newTokens
        }
      });
      console.log('[Auth] ✓ Tokens updated in database\n');
    } else {
      console.log('[Auth] ✓ Using existing valid token\n');
    }

    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    let ga4Count = 0;
    let gscCount = 0;

    // Fetch and store GA4 data
    if (settings.googleAnalyticsPropertyId) {
      try {
        const ga4Data = await fetchGA4Data(
          settings.googleAnalyticsPropertyId,
          accessToken,
          startDateStr,
          endDateStr
        );
        ga4Count = await storeGA4Data(ga4Data, settings.googleAnalyticsPropertyId);
      } catch (error) {
        console.error('[GA4] Error:', error.message);
      }
    } else {
      console.log('[GA4] Skipped - no property ID configured');
    }

    // Fetch and store Search Console data
    if (settings.googleSearchConsoleSiteUrl) {
      try {
        const gscData = await fetchSearchConsoleData(
          settings.googleSearchConsoleSiteUrl,
          accessToken,
          startDateStr,
          endDateStr
        );
        gscCount = await storeSearchConsoleData(gscData, settings.googleSearchConsoleSiteUrl);
      } catch (error) {
        console.error('[GSC] Error:', error.message);
      }
    } else {
      console.log('[GSC] Skipped - no site URL configured');
    }

    // Generate report
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const report = {
      success: true,
      timestamp: new Date().toISOString(),
      duration: `${duration}s`,
      ga4RecordsStored: ga4Count,
      gscRecordsStored: gscCount,
      totalRecords: ga4Count + gscCount,
      dateRange: {
        start: startDateStr,
        end: endDateStr
      }
    };

    // Write report
    const reportPath = path.join(REPORT_DIR, `daily_ga_sync_${new Date().toISOString().split('T')[0]}.md`);
    const reportContent = `# Daily Google Analytics Sync Report
**Date:** ${new Date().toISOString()}
**Status:** ✓ Success
**Duration:** ${duration}s

## Summary
- **GA4 Records Stored:** ${ga4Count}
- **Search Console Records Stored:** ${gscCount}
- **Total Records:** ${ga4Count + gscCount}
- **Date Range:** ${startDateStr} to ${endDateStr}

## Details
${ga4Count > 0 ? '✓ GA4 data synced successfully' : '⚠ No GA4 data synced'}
${gscCount > 0 ? '✓ Search Console data synced successfully' : '⚠ No Search Console data synced'}

---
*Generated by automated daily sync task*
`;

    fs.writeFileSync(reportPath, reportContent);
    console.log(`\n[Report] ✓ Report saved to: ${reportPath}`);

    console.log('\n=== Sync Complete ===');
    console.log(JSON.stringify(report, null, 2));
    
    return report;

  } catch (error) {
    console.error('\n=== Sync Failed ===');
    console.error('Error:', error.message);
    
    // Write error report
    const errorReportPath = path.join(REPORT_DIR, `daily_ga_sync_error_${new Date().toISOString().split('T')[0]}.md`);
    const errorContent = `# Daily Google Analytics Sync - ERROR
**Date:** ${new Date().toISOString()}
**Status:** ✗ Failed

## Error
\`\`\`
${error.message}
\`\`\`

## Stack Trace
\`\`\`
${error.stack}
\`\`\`
`;
    fs.writeFileSync(errorReportPath, errorContent);
    
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync
runSync()
  .then(() => {
    console.log('\n✓ Sync completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Sync failed:', error.message);
    process.exit(1);
  });
