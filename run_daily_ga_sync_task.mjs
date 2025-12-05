#!/usr/bin/env node

/**
 * Daily GA Sync Task Runner
 * Executes the automated GA sync and logs results
 */

import { PrismaClient } from '@prisma/client';
import { syncGAData } from './nextjs_space/lib/google-analytics.ts';
import { sendEmail } from './nextjs_space/lib/email.ts';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();
const LOG_DIR = '/home/ubuntu/seo_automation_logs';
const LOG_FILE = join(LOG_DIR, 'daily_ga_sync.log');

// Ensure log directory exists
if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR, { recursive: true });
}

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  console.log(logEntry.trim());
  appendFileSync(LOG_FILE, logEntry);
}

async function runDailyGASync() {
  logMessage('=== Starting Daily GA Sync ===');
  
  try {
    // Step 1: Get SEO settings
    logMessage('Fetching SEO settings...');
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings?.googleAuthTokens || !settings?.googleAnalyticsPropertyId || !settings?.googleSearchConsoleSiteUrl) {
      const errorMsg = 'Google Analytics not configured - missing credentials';
      logMessage(`ERROR: ${errorMsg}`);
      
      // Step 3: Send alert email on failure
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: 'Daily GA Sync Failed - Configuration Missing',
        html: `
          <h2>Daily GA Sync Alert</h2>
          <p><strong>Status:</strong> Failed</p>
          <p><strong>Error:</strong> ${errorMsg}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p>Please check the Google Analytics configuration in the admin panel.</p>
        `
      });
      
      logMessage('Alert email sent to khouston@thebasketballfactorynj.com');
      process.exit(1);
    }

    logMessage('SEO settings loaded successfully');
    logMessage(`Property ID: ${settings.googleAnalyticsPropertyId}`);
    logMessage(`Search Console URL: ${settings.googleSearchConsoleSiteUrl}`);

    // Step 1: Execute GA sync for last 30 days
    logMessage('Syncing GA and GSC data for last 30 days...');
    const result = await syncGAData(
      settings.googleAnalyticsPropertyId,
      settings.googleSearchConsoleSiteUrl,
      30
    );

    if (result.success) {
      // Count synced keywords
      const keywordCount = await prisma.sEOKeyword.count({
        where: {
          performanceData: {
            some: {
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            }
          }
        }
      });

      // Step 2: Log success
      logMessage(`SUCCESS: GA sync completed successfully`);
      logMessage(`Keywords synced: ${keywordCount}`);
      logMessage(`Metrics synced: ${result.metrics ? 'Yes' : 'No'}`);
      
      if (result.warnings && result.warnings.length > 0) {
        logMessage(`Warnings: ${result.warnings.join(', ')}`);
      }

      // Log to audit trail
      await prisma.sEOAuditLog.create({
        data: {
          action: 'automated_ga_sync',
          entityType: 'analytics',
          performedBy: 'system',
          changes: {
            syncedAt: new Date().toISOString(),
            keywordCount,
            success: true,
            warnings: result.warnings || []
          }
        }
      });

      logMessage('=== Daily GA Sync Completed Successfully ===\n');
      
    } else {
      // Step 3: Handle failure
      const errorMsg = result.error || 'Unknown error during sync';
      logMessage(`ERROR: ${errorMsg}`);
      
      // Send alert email
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: 'Daily GA Sync Failed',
        html: `
          <h2>Daily GA Sync Alert</h2>
          <p><strong>Status:</strong> Failed</p>
          <p><strong>Error:</strong> ${errorMsg}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p>Please check the logs for more details.</p>
        `
      });
      
      logMessage('Alert email sent to khouston@thebasketballfactorynj.com');
      logMessage('=== Daily GA Sync Failed ===\n');
      
      process.exit(1);
    }

  } catch (error) {
    // Step 3: Handle unexpected errors
    const errorMsg = error.message || String(error);
    logMessage(`CRITICAL ERROR: ${errorMsg}`);
    logMessage(`Stack trace: ${error.stack}`);
    
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: 'Daily GA Sync Critical Error',
        html: `
          <h2>Daily GA Sync Critical Error</h2>
          <p><strong>Status:</strong> Critical Failure</p>
          <p><strong>Error:</strong> ${errorMsg}</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Stack Trace:</strong></p>
          <pre>${error.stack}</pre>
        `
      });
      logMessage('Critical error alert sent to khouston@thebasketballfactorynj.com');
    } catch (emailError) {
      logMessage(`Failed to send alert email: ${emailError.message}`);
    }
    
    logMessage('=== Daily GA Sync Failed with Critical Error ===\n');
    process.exit(1);
    
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the sync
runDailyGASync();
