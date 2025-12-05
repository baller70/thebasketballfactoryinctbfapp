/**
 * Daily Google Analytics Sync - Direct Database Access
 * Uses pg library to connect directly to PostgreSQL
 */

const { Client } = require('pg');
const { appendFileSync } = require('fs');
const { mkdir } = require('fs/promises');
const fetch = require('node-fetch');
const { randomUUID } = require('crypto');

const DATABASE_URL = 'postgresql://role_da1a5943:VknB0BsUhy0m5vqg9B8LY0drt50cg8nM@db-da1a5943.db002.hosteddb.reai.io:5432/da1a5943?connect_timeout=15';
const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';

/**
 * Log message to file and console
 */
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  console.log(logEntry.trim());
  try {
    appendFileSync(LOG_FILE, logEntry);
  } catch (err) {
    console.error('Failed to write to log:', err.message);
  }
}

/**
 * Fetch data from Google Search Console
 */
async function fetchSearchConsoleData(siteUrl, startDate, endDate, accessToken) {
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ['query', 'page', 'date'],
        rowLimit: 25000
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GSC API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.rows || [];
}

/**
 * Store performance data in database
 */
async function storePerformanceData(client, rows) {
  let recordsCreated = 0;
  let recordsUpdated = 0;
  const keywordMap = new Map();

  for (const row of rows) {
    const [query, page, dateStr] = row.keys;
    const clicks = row.clicks || 0;
    const impressions = row.impressions || 0;
    const ctr = row.ctr || 0;
    const position = row.position || 0;

    // Find or create keyword
    let keyword = keywordMap.get(query);
    if (!keyword) {
      const keywordResult = await client.query(
        'SELECT * FROM "SEOKeyword" WHERE keyword = $1 LIMIT 1',
        [query]
      );

      if (keywordResult.rows.length > 0) {
        keyword = keywordResult.rows[0];
      } else {
        const newKeywordId = randomUUID();
        const insertResult = await client.query(
          'INSERT INTO "SEOKeyword" (id, keyword, "isActive", priority, "createdAt") VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
          [newKeywordId, query, true, 5]
        );
        keyword = insertResult.rows[0];
      }
      keywordMap.set(query, keyword);
    }

    // Create or update performance record
    const dateKey = dateStr.replace(/-/g, '');
    const date = new Date(dateStr);

    const existingResult = await client.query(
      'SELECT * FROM "SEOPerformance" WHERE "keywordId" = $1 AND "dateKey" = $2 LIMIT 1',
      [keyword.id, dateKey]
    );

    if (existingResult.rows.length > 0) {
      await client.query(
        'UPDATE "SEOPerformance" SET clicks = $1, impressions = $2, ctr = $3, position = $4, "pagePath" = $5 WHERE id = $6',
        [clicks, impressions, ctr, position, page, existingResult.rows[0].id]
      );
      recordsUpdated++;
    } else {
      const newId = randomUUID();
      await client.query(
        'INSERT INTO "SEOPerformance" (id, "keywordId", "dateKey", date, clicks, impressions, ctr, position, "pagePath", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())',
        [newId, keyword.id, dateKey, date, clicks, impressions, ctr, position, page]
      );
      recordsCreated++;
    }
  }

  return {
    recordsCreated,
    recordsUpdated,
    totalKeywords: keywordMap.size
  };
}

/**
 * Main sync function
 */
async function main() {
  const timestamp = new Date().toISOString();
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    // Ensure log directory exists
    await mkdir('/home/ubuntu/seo_automation_logs', { recursive: true });
    
    logMessage('========================================');
    logMessage('Starting Daily GA Sync');
    logMessage('========================================');
    
    // Connect to database
    await client.connect();
    logMessage('✅ Connected to database');
    
    // Get SEO settings
    const settingsResult = await client.query('SELECT * FROM "SEOSettings" LIMIT 1');
    
    if (settingsResult.rows.length === 0) {
      throw new Error('No SEO settings found in database');
    }
    
    const settings = settingsResult.rows[0];
    
    if (!settings.googleAuthTokens || !settings.googleSearchConsoleSiteUrl) {
      throw new Error('Google Analytics not configured - missing auth tokens or site URL');
    }
    
    // Parse tokens
    const tokens = typeof settings.googleAuthTokens === 'string' 
      ? JSON.parse(settings.googleAuthTokens)
      : settings.googleAuthTokens;
    
    if (!tokens.access_token) {
      throw new Error('No access token found in settings');
    }
    
    // Check if token is expired
    if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
      logMessage('⚠️  Access token is expired - sync may fail');
    }
    
    logMessage(`Site URL: ${settings.googleSearchConsoleSiteUrl}`);
    
    // Calculate date range (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const formatDate = (date) => date.toISOString().split('T')[0];
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    logMessage(`Fetching data from ${startDateStr} to ${endDateStr}`);
    
    // Fetch Search Console data
    logMessage('Fetching Google Search Console data...');
    const rows = await fetchSearchConsoleData(
      settings.googleSearchConsoleSiteUrl,
      startDateStr,
      endDateStr,
      tokens.access_token
    );
    
    logMessage(`Received ${rows.length} rows from GSC`);
    
    if (rows.length === 0) {
      logMessage('⚠️  No data returned from GSC API');
      
      // Log audit entry
      const auditId1 = randomUUID();
      await client.query(
        'INSERT INTO "SEOAuditLog" (id, action, "entityType", "performedBy", changes, timestamp) VALUES ($1, $2, $3, $4, $5, NOW())',
        [auditId1, 'automated_ga_sync', 'analytics', 'system', JSON.stringify({
          syncedAt: timestamp,
          status: 'no_data',
          message: 'No rows returned from GSC API'
        })]
      );
      
      logMessage('========================================');
      logMessage('Daily GA Sync Completed (No New Data)');
      logMessage('========================================');
      
      await client.end();
      return;
    }
    
    // Store data in database
    logMessage('Storing performance data in database...');
    const results = await storePerformanceData(client, rows);
    
    logMessage(`✅ Created ${results.recordsCreated} new records`);
    logMessage(`✅ Updated ${results.recordsUpdated} existing records`);
    logMessage(`✅ Tracked ${results.totalKeywords} unique keywords`);
    
    // Log audit entry
    const auditId2 = randomUUID();
    await client.query(
      'INSERT INTO "SEOAuditLog" (id, action, "entityType", "performedBy", changes, timestamp) VALUES ($1, $2, $3, $4, $5, NOW())',
      [auditId2, 'automated_ga_sync', 'analytics', 'system', JSON.stringify({
        syncedAt: timestamp,
        recordsCreated: results.recordsCreated,
        recordsUpdated: results.recordsUpdated,
        totalKeywords: results.totalKeywords,
        status: 'success'
      })]
    );
    
    logMessage('========================================');
    logMessage('Daily GA Sync Completed Successfully');
    logMessage(`Records Created: ${results.recordsCreated}`);
    logMessage(`Records Updated: ${results.recordsUpdated}`);
    logMessage(`Keywords Synced: ${results.totalKeywords}`);
    logMessage('========================================');
    
    await client.end();
    
  } catch (error) {
    const errorMessage = error.message || String(error);
    logMessage(`❌ ERROR: ${errorMessage}`);
    if (error.stack) {
      logMessage(`Stack: ${error.stack}`);
    }
    
    logMessage('========================================');
    logMessage('Daily GA Sync Failed');
    logMessage('========================================');
    
    try {
      await client.end();
    } catch (e) {
      // Ignore
    }
    
    process.exit(1);
  }
}

main();
