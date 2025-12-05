#!/usr/bin/env tsx

/**
 * Daily Google Analytics Sync Script
 * Runs automatedGASync() and logs results
 */

import { automatedGASync } from './nextjs_space/lib/seo-automation';
import { prisma } from './nextjs_space/lib/db';
import { sendEmail } from './nextjs_space/lib/email';
import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';

async function logMessage(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logEntry);
  console.log(logEntry.trim());
}

async function sendAlertEmail(errorMessage: string) {
  try {
    await sendEmail({
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
    await logMessage('Alert email sent successfully');
  } catch (emailError: any) {
    await logMessage(`Failed to send alert email: ${emailError.message}`);
  }
}

async function main() {
  await logMessage('=== Starting Daily GA Sync ===');
  
  try {
    // Run the automated GA sync
    const result = await automatedGASync();
    
    if (result.success) {
      // Get keyword count from database
      const keywordCount = await prisma.sEOKeyword.count({
        where: { isActive: true }
      });
      
      await logMessage(`✅ SUCCESS: ${result.message}`);
      await logMessage(`Keywords synced: ${keywordCount}`);
      await logMessage('=== Daily GA Sync Completed Successfully ===');
    } else {
      // Sync failed
      await logMessage(`❌ FAILURE: ${result.message}`);
      await logMessage('=== Daily GA Sync Failed ===');
      
      // Send alert email
      await sendAlertEmail(result.message);
    }
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    await logMessage(`❌ EXCEPTION: ${errorMessage}`);
    await logMessage(`Stack trace: ${error.stack || 'N/A'}`);
    await logMessage('=== Daily GA Sync Failed with Exception ===');
    
    // Send alert email
    await sendAlertEmail(errorMessage);
  } finally {
    // Close database connection
    await prisma.$disconnect();
  }
}

main();
