#!/usr/bin/env node

/**
 * Simple Daily Google Analytics Sync
 * Logs sync attempt and checks database configuration
 */

const fs = require('fs');
const { PrismaClient } = require('/home/ubuntu/rise_as_one_aau/nextjs_space/node_modules/@prisma/client');

const prisma = new PrismaClient();

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
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

async function runGASync() {
  logMessage('========================================');
  logMessage('Starting Daily Google Analytics Sync');
  logMessage('========================================');

  try {
    // Get SEO settings from database
    logMessage('Checking SEO settings...');
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      throw new Error('SEO settings not found in database');
    }

    logMessage('SEO settings found');
    logMessage(`Property ID: ${settings.googleAnalyticsPropertyId || 'NOT SET'}`);
    logMessage(`Search Console URL: ${settings.googleSearchConsoleSiteUrl || 'NOT SET'}`);
    logMessage(`Auth Tokens: ${settings.googleAuthTokens ? 'CONFIGURED' : 'NOT CONFIGURED'}`);

    if (!settings.googleAuthTokens) {
      throw new Error('Google Auth tokens not configured');
    }

    if (!settings.googleAnalyticsPropertyId) {
      throw new Error('Google Analytics Property ID not configured');
    }

    if (!settings.googleSearchConsoleSiteUrl) {
      throw new Error('Google Search Console Site URL not configured');
    }

    // Count current keywords
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });
    logMessage(`Active keywords in database: ${keywordCount}`);

    // Check recent performance data
    const recentPerformance = await prisma.sEOPerformance.count({
      where: {
        date: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }
    });
    logMessage(`Performance records (last 7 days): ${recentPerformance}`);

    // Log the sync attempt
    await prisma.sEOAuditLog.create({
      data: {
        action: 'automated_ga_sync_check',
        entityType: 'analytics',
        performedBy: 'system',
        changes: {
          syncedAt: new Date().toISOString(),
          keywordCount,
          recentPerformanceRecords: recentPerformance,
          status: 'Configuration verified - manual sync required via dashboard'
        }
      }
    });

    logMessage('✅ Configuration check completed successfully');
    logMessage('Note: Automatic data sync requires the Next.js application to be running');
    logMessage('Please trigger manual sync via the SEO dashboard at:');
    logMessage('https://thebasketballfactoryinc.com/admin/seo');
    
    logMessage('========================================');
    logMessage('Daily GA Sync check completed');
    logMessage('========================================\n');

    process.exit(0);

  } catch (error) {
    logMessage('❌ GA Sync check failed');
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
            alertEmail: ALERT_EMAIL
          }
        }
      });
      logMessage('Error logged to audit table');
    } catch (auditError) {
      logMessage(`Failed to create audit log: ${auditError.message}`);
    }

    logMessage('========================================');
    logMessage('Daily GA Sync check failed - see errors above');
    logMessage(`Alert should be sent to: ${ALERT_EMAIL}`);
    logMessage('========================================\n');

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync
runGASync();
