#!/usr/bin/env tsx

/**
 * Daily Google Analytics Sync Task
 * Runs the automated GA sync and logs results
 */

import { prisma } from '@/lib/db';
import { syncGAData } from '@/lib/google-analytics';
import { sendEmail } from '@/lib/email';
import fs from 'fs';
import path from 'path';

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';

async function logMessage(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Ensure log directory exists
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logEntry);
  console.log(logEntry.trim());
}

async function sendAlertEmail(errorMessage: string) {
  try {
    await sendEmail({
      to: 'khouston@thebasketballfactorynj.com',
      subject: '🚨 Daily GA Sync Failed',
      html: `
        <h2>Daily Google Analytics Sync Failed</h2>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Error:</strong></p>
        <pre>${errorMessage}</pre>
        <p>Please check the logs at: ${LOG_FILE}</p>
      `
    });
    
    await logMessage('Alert email sent successfully');
  } catch (emailError: any) {
    await logMessage(`Failed to send alert email: ${emailError.message}`);
  }
}

async function runDailyGASync() {
  await logMessage('========================================');
  await logMessage('Starting Daily Google Analytics Sync');
  await logMessage('========================================');
  
  try {
    // Get SEO settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings?.googleAuthTokens || !settings?.googleAnalyticsPropertyId || !settings?.googleSearchConsoleSiteUrl) {
      const errorMsg = 'Google Analytics not configured - missing credentials';
      await logMessage(`ERROR: ${errorMsg}`);
      await sendAlertEmail(errorMsg);
      return;
    }
    
    await logMessage('Configuration validated');
    await logMessage(`Property ID: ${settings.googleAnalyticsPropertyId}`);
    await logMessage(`Search Console URL: ${settings.googleSearchConsoleSiteUrl}`);
    
    // Run the sync
    await logMessage('Fetching last 30 days of GA and GSC data...');
    
    const result = await syncGAData(
      settings.googleAnalyticsPropertyId,
      settings.googleSearchConsoleSiteUrl,
      30 // Last 30 days
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
      
      await logMessage(`✅ SUCCESS: GA sync completed successfully`);
      await logMessage(`Keywords synced: ${keywordCount}`);
      
      if (result.warnings && result.warnings.length > 0) {
        await logMessage(`Warnings: ${result.warnings.join(', ')}`);
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
            warnings: result.warnings || []
          }
        }
      });
      
      await logMessage('Audit log entry created');
      
    } else {
      const errorMsg = result.error || 'Unknown error during sync';
      await logMessage(`❌ FAILED: ${errorMsg}`);
      await sendAlertEmail(errorMsg);
    }
    
  } catch (error: any) {
    const errorMsg = `Exception during sync: ${error.message}\n${error.stack}`;
    await logMessage(`❌ EXCEPTION: ${errorMsg}`);
    await sendAlertEmail(errorMsg);
  } finally {
    await logMessage('========================================');
    await logMessage('Daily GA Sync Task Completed');
    await logMessage('========================================\n');
    await prisma.$disconnect();
  }
}

// Run the sync
runDailyGASync().catch(console.error);
