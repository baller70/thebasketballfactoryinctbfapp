/**
 * Daily Google Analytics Sync Task
 * Fetches data from Google Search Console and stores in database
 */

const { PrismaClient } = require('@prisma/client');
const { appendFileSync } = require('fs');
const { mkdir } = require('fs/promises');

const prisma = new PrismaClient();
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
 * Send alert email on failure
 */
async function sendAlertEmail(errorMessage) {
  try {
    // Check if email is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      logMessage('Email not configured - skipping alert email');
      return;
    }

    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: ALERT_EMAIL,
      subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .alert-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; }
            .error-details { background: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace; }
          </style>
        </head>
        <body>
          <h2>🚨 Daily Google Analytics Sync Failed</h2>
          <div class="alert-box">
            <strong>Error occurred during automated GA sync</strong>
            <p>Time: ${new Date().toLocaleString()}</p>
          </div>
          <h3>Error Details:</h3>
          <div class="error-details">
            ${errorMessage}
          </div>
          <p>Please check the logs at: <code>${LOG_FILE}</code></p>
          <p>You may need to re-authenticate Google Analytics or check the configuration.</p>
        </body>
        </html>
      `
    });
    
    logMessage('✅ Alert email sent successfully');
  } catch (emailError) {
    logMessage(`❌ Failed to send alert email: ${emailError.message}`);
  }
}

/**
 * Fetch data from Google Search Console
 */
async function fetchSearchConsoleData(siteUrl, startDate, endDate, accessToken) {
  const fetch = (await import('node-fetch')).default;
  
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
async function storePerformanceData(rows) {
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
      keyword = await prisma.sEOKeyword.findFirst({
        where: { keyword: query }
      });

      if (!keyword) {
        keyword = await prisma.sEOKeyword.create({
          data: {
            keyword: query,
            isActive: true,
            priority: 5
          }
        });
      }
      keywordMap.set(query, keyword);
    }

    // Create or update performance record
    const dateKey = dateStr.replace(/-/g, '');
    const date = new Date(dateStr);

    const existing = await prisma.sEOPerformance.findFirst({
      where: {
        keywordId: keyword.id,
        dateKey: dateKey
      }
    });

    if (existing) {
      await prisma.sEOPerformance.update({
        where: { id: existing.id },
        data: {
          clicks,
          impressions,
          ctr,
          position,
          pagePath: page
        }
      });
      recordsUpdated++;
    } else {
      await prisma.sEOPerformance.create({
        data: {
          keywordId: keyword.id,
          dateKey,
          date,
          clicks,
          impressions,
          ctr,
          position,
          pagePath: page
        }
      });
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
  
  try {
    // Ensure log directory exists
    await mkdir('/home/ubuntu/seo_automation_logs', { recursive: true });
    
    logMessage('========================================');
    logMessage('Starting Daily GA Sync');
    logMessage('========================================');
    
    // Get SEO settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      throw new Error('No SEO settings found in database');
    }
    
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
      await prisma.sEOAuditLog.create({
        data: {
          action: 'automated_ga_sync',
          entityType: 'analytics',
          performedBy: 'system',
          changes: {
            syncedAt: timestamp,
            status: 'no_data',
            message: 'No rows returned from GSC API'
          }
        }
      });
      
      logMessage('========================================');
      logMessage('Daily GA Sync Completed (No New Data)');
      logMessage('========================================');
      
      await prisma.$disconnect();
      return;
    }
    
    // Store data in database
    logMessage('Storing performance data in database...');
    const results = await storePerformanceData(rows);
    
    logMessage(`✅ Created ${results.recordsCreated} new records`);
    logMessage(`✅ Updated ${results.recordsUpdated} existing records`);
    logMessage(`✅ Tracked ${results.totalKeywords} unique keywords`);
    
    // Log audit entry
    await prisma.sEOAuditLog.create({
      data: {
        action: 'automated_ga_sync',
        entityType: 'analytics',
        performedBy: 'system',
        changes: {
          syncedAt: timestamp,
          recordsCreated: results.recordsCreated,
          recordsUpdated: results.recordsUpdated,
          totalKeywords: results.totalKeywords,
          status: 'success'
        }
      }
    });
    
    logMessage('========================================');
    logMessage('Daily GA Sync Completed Successfully');
    logMessage(`Records Created: ${results.recordsCreated}`);
    logMessage(`Records Updated: ${results.recordsUpdated}`);
    logMessage(`Keywords Synced: ${results.totalKeywords}`);
    logMessage('========================================');
    
  } catch (error) {
    const errorMessage = error.message || String(error);
    logMessage(`❌ ERROR: ${errorMessage}`);
    if (error.stack) {
      logMessage(`Stack: ${error.stack}`);
    }
    
    // Send alert email
    await sendAlertEmail(errorMessage);
    
    logMessage('========================================');
    logMessage('Daily GA Sync Failed');
    logMessage('========================================');
    
    await prisma.$disconnect();
    process.exit(1);
  }
  
  await prisma.$disconnect();
}

main();
