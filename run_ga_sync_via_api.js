#!/usr/bin/env node

/**
 * Daily Google Analytics Sync via API
 * Calls the Next.js API endpoint to trigger GA sync
 */

const fs = require('fs');
const { PrismaClient } = require('/home/ubuntu/rise_as_one_aau/nextjs_space/node_modules/@prisma/client');

const prisma = new PrismaClient();

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
const API_URL = 'http://localhost:3000/api/seo/google/sync';
const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console.log(logEntry.trim());
  
  // Ensure log directory exists
  const logDir = '/home/ubuntu/seo_automation_logs';
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
}

async function sendAlertEmail(errorMessage) {
  try {
    // Use Prisma to log the alert
    await prisma.sEOAuditLog.create({
      data: {
        action: 'ga_sync_alert_needed',
        entityType: 'analytics',
        performedBy: 'system',
        changes: {
          alertEmail: ALERT_EMAIL,
          error: errorMessage,
          timestamp: new Date().toISOString()
        }
      }
    });
    
    logMessage(`Alert logged for ${ALERT_EMAIL}`);
  } catch (error) {
    logMessage(`Failed to log alert: ${error.message}`);
  }
}

async function runGASync() {
  logMessage('========================================');
  logMessage('Starting Daily Google Analytics Sync');
  logMessage('========================================');

  try {
    // Get SEO settings from database
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      throw new Error('SEO settings not found in database');
    }

    if (!settings.googleAuthTokens) {
      throw new Error('Google Auth tokens not configured');
    }

    if (!settings.googleAnalyticsPropertyId) {
      throw new Error('Google Analytics Property ID not configured');
    }

    if (!settings.googleSearchConsoleSiteUrl) {
      throw new Error('Google Search Console Site URL not configured');
    }

    logMessage(`Property ID: ${settings.googleAnalyticsPropertyId}`);
    logMessage(`Search Console URL: ${settings.googleSearchConsoleSiteUrl}`);
    logMessage('Calling API to sync last 30 days of data...');

    // Call the API endpoint
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        propertyId: settings.googleAnalyticsPropertyId,
        siteUrl: settings.googleSearchConsoleSiteUrl,
        days: 30
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      // Count keywords synced
      const keywordCount = await prisma.sEOKeyword.count({
        where: { isActive: true }
      });

      logMessage('✅ GA Sync completed successfully');
      logMessage(`Keywords tracked: ${keywordCount}`);
      
      if (result.metrics) {
        logMessage(`Metrics synced: ${JSON.stringify(result.metrics)}`);
      }

      if (result.warnings && result.warnings.length > 0) {
        logMessage(`Warnings: ${result.warnings.join(', ')}`);
      }

      logMessage('========================================');
      logMessage('Daily GA Sync completed successfully');
      logMessage('========================================\n');

      process.exit(0);
    } else {
      throw new Error(result.error || `API returned status ${response.status}`);
    }

  } catch (error) {
    logMessage('❌ GA Sync failed');
    logMessage(`Error: ${error.message}`);
    if (error.stack) {
      logMessage(`Stack: ${error.stack}`);
    }

    // Log to audit table
    try {
      await prisma.sEOAuditLog.create({
        data: {
          action: 'automated_ga_sync_failed',
          entityType: 'analytics',
          performedBy: 'system',
          changes: {
            syncedAt: new Date().toISOString(),
            success: false,
            error: error.message,
            stack: error.stack || 'N/A'
          }
        }
      });
    } catch (auditError) {
      logMessage(`Failed to create audit log: ${auditError.message}`);
    }

    // Send alert email
    await sendAlertEmail(error.message);

    logMessage('========================================');
    logMessage('Daily GA Sync failed - see errors above');
    logMessage('========================================\n');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync
runGASync();
