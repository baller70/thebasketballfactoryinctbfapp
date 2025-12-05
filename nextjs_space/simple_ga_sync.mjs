/**
 * Simple GA Sync - Direct Database Access
 */

import pg from 'pg';
import fs from 'fs';
import { appendFileSync } from 'fs';

const { Pool } = pg;

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';

// Get DATABASE_URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  console.log(logEntry.trim());
  
  // Ensure log directory exists
  const logDir = '/home/ubuntu/seo_automation_logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  appendFileSync(LOG_FILE, logEntry);
}

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

async function main() {
  const timestamp = new Date().toISOString();
  
  try {
    logMessage('========================================');
    logMessage('Starting Daily GA Sync');
    logMessage('========================================');
    
    // Get SEO settings from database
    const settingsResult = await pool.query('SELECT * FROM "SEOSettings" LIMIT 1');
    
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
    
    logMessage(`Site URL: ${settings.googleSearchConsoleSiteUrl}`);
    
    // Check if token is expired
    if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
      logMessage('⚠️  Access token is expired - sync may fail');
    }
    
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
      try {
        await pool.query(
          `INSERT INTO "SEOAuditLog" (action, "entityType", "performedBy", changes, timestamp) 
           VALUES ($1, $2, $3, $4, $5)`,
          ['automated_ga_sync', 'analytics', 'system', JSON.stringify({
            syncedAt: timestamp,
            status: 'no_data',
            message: 'No rows returned from GSC API'
          }), new Date()]
        );
      } catch (auditError) {
        logMessage(`⚠️  Could not log audit entry: ${auditError.message}`);
      }
      
      logMessage('========================================');
      logMessage('Daily GA Sync Completed (No New Data)');
      logMessage('========================================');
      
      await pool.end();
      return;
    }
    
    // Store data in database
    logMessage('Storing performance data in database...');
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
        const keywordResult = await pool.query(
          'SELECT * FROM "SEOKeyword" WHERE keyword = $1 LIMIT 1',
          [query]
        );
        
        if (keywordResult.rows.length > 0) {
          keyword = keywordResult.rows[0];
        } else {
          const insertResult = await pool.query(
            `INSERT INTO "SEOKeyword" (keyword, "targetPage", "currentPosition", "isActive") 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [query, page, position, true]
          );
          keyword = insertResult.rows[0];
        }
        keywordMap.set(query, keyword);
      }
      
      // Create or update performance record
      const dateKey = dateStr.replace(/-/g, '');
      const date = new Date(dateStr);
      
      const existingResult = await pool.query(
        'SELECT * FROM "SEOPerformance" WHERE "keywordId" = $1 AND "dateKey" = $2 LIMIT 1',
        [keyword.id, dateKey]
      );
      
      if (existingResult.rows.length > 0) {
        await pool.query(
          `UPDATE "SEOPerformance" 
           SET clicks = $1, impressions = $2, ctr = $3, position = $4, "pagePath" = $5
           WHERE id = $6`,
          [clicks, impressions, ctr, position, page, existingResult.rows[0].id]
        );
        recordsUpdated++;
      } else {
        await pool.query(
          `INSERT INTO "SEOPerformance" ("keywordId", "dateKey", date, clicks, impressions, ctr, position, "pagePath") 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [keyword.id, dateKey, date, clicks, impressions, ctr, position, page]
        );
        recordsCreated++;
      }
    }
    
    logMessage(`✅ Created ${recordsCreated} new records`);
    logMessage(`✅ Updated ${recordsUpdated} existing records`);
    logMessage(`✅ Tracked ${keywordMap.size} unique keywords`);
    
    // Log audit entry
    try {
      await pool.query(
        `INSERT INTO "SEOAuditLog" (action, "entityType", "performedBy", changes, timestamp) 
         VALUES ($1, $2, $3, $4, $5)`,
        ['automated_ga_sync', 'analytics', 'system', JSON.stringify({
          syncedAt: timestamp,
          recordsCreated,
          recordsUpdated,
          totalKeywords: keywordMap.size,
          status: 'success'
        }), new Date()]
      );
    } catch (auditError) {
      logMessage(`⚠️  Could not log audit entry: ${auditError.message}`);
    }
    
    logMessage('========================================');
    logMessage('Daily GA Sync Completed Successfully');
    logMessage('========================================');
    
  } catch (error) {
    const errorMessage = error.message || String(error);
    logMessage(`❌ ERROR: ${errorMessage}`);
    logMessage(`Stack: ${error.stack || 'N/A'}`);
    
    logMessage('========================================');
    logMessage('Daily GA Sync Failed');
    logMessage('========================================');
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
