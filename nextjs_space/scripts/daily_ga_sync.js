#!/usr/bin/env node

/**
 * Daily Google Analytics Sync Task
 * Runs the automatedGASync function and logs results
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console.log(logEntry.trim());
  
  // Ensure log directory exists
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
}

async function sendAlertEmail(errorMessage) {
  try {
    // Try to use the email function from the app
    const { sendEmail } = require('../lib/email');
    
    await sendEmail({
      to: ALERT_EMAIL,
      subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1>⚠️ GA Sync Alert</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2>Daily Google Analytics Sync Failed</h2>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Error:</strong></p>
            <pre style="background: white; padding: 15px; border-left: 4px solid #dc2626; overflow-x: auto;">${errorMessage}</pre>
            <p>Please check the logs at: <code>${LOG_FILE}</code></p>
            <p><a href="https://thebasketballfactoryinc.com/admin/seo" style="display: inline-block; background: #C8B273; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px;">View SEO Dashboard</a></p>
          </div>
          <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
            <p>This is an automated alert from Rise As One AAU SEO System</p>
          </div>
        </div>
      `
    });
    
    logMessage('Alert email sent successfully');
  } catch (emailError) {
    logMessage(`Failed to send alert email: ${emailError.message}`);
  }
}

async function runGASync() {
  logMessage('========================================');
  logMessage('Starting Daily Google Analytics Sync');
  logMessage('========================================');

  try {
    // Get SEO settings
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
    logMessage('Syncing last 30 days of data...');

    // Import and run the sync function
    const { syncGAData } = require('../lib/google-analytics');
    
    const result = await syncGAData(
      settings.googleAnalyticsPropertyId,
      settings.googleSearchConsoleSiteUrl,
      30 // Last 30 days
    );

    if (result.success) {
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

      // Log to audit table
      await prisma.sEOAuditLog.create({
        data: {
          action: 'automated_ga_sync',
          entityType: 'analytics',
          performedBy: 'system',
          changes: {
            syncedAt: new Date().toISOString(),
            success: true,
            keywordCount,
            warnings: result.warnings || []
          }
        }
      });

      logMessage('Audit log created');
      logMessage('========================================');
      logMessage('Daily GA Sync completed successfully');
      logMessage('========================================\n');

      process.exit(0);
    } else {
      throw new Error(result.error || 'GA sync failed with unknown error');
    }

  } catch (error) {
    logMessage('❌ GA Sync failed');
    logMessage(`Error: ${error.message}`);
    logMessage(`Stack: ${error.stack}`);

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
            stack: error.stack
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
