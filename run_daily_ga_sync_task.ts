/**
 * Daily Google Analytics Sync Task
 * Runs the automated GA sync and logs results
 */

import { automatedGASync } from './nextjs_space/lib/seo-automation';
import { sendEmail } from './nextjs_space/lib/email';
import { prisma } from './nextjs_space/lib/db';
import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';

async function logToFile(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  try {
    fs.appendFileSync(LOG_FILE, logEntry);
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

async function runDailyGASync() {
  console.log('Starting Daily Google Analytics Sync...');
  await logToFile('=== Daily GA Sync Started ===');
  
  try {
    // Step 1: Run the automated GA sync
    const result = await automatedGASync();
    
    // Get keyword count
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });
    
    // Step 2: Log the results
    if (result.success) {
      const successMessage = `SUCCESS: ${result.message} | Keywords tracked: ${keywordCount}`;
      console.log(successMessage);
      await logToFile(successMessage);
      await logToFile('=== Daily GA Sync Completed Successfully ===\n');
    } else {
      // Step 3: Handle failure
      const errorMessage = `FAILURE: ${result.message}`;
      console.error(errorMessage);
      await logToFile(errorMessage);
      await logToFile('=== Daily GA Sync Failed ===\n');
      
      // Send alert email
      try {
        await sendEmail({
          to: 'khouston@thebasketballfactorynj.com',
          subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
          html: `
            <h2>Daily Google Analytics Sync Failed</h2>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Error:</strong> ${result.message}</p>
            <p>Please check the logs at: ${LOG_FILE}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is an automated alert from the Rise As One AAU SEO system.</p>
          `
        });
        await logToFile('Alert email sent to khouston@thebasketballfactorynj.com');
      } catch (emailError: any) {
        await logToFile(`Failed to send alert email: ${emailError.message}`);
      }
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error: any) {
    const errorMessage = `CRITICAL ERROR: ${error.message}`;
    console.error(errorMessage);
    await logToFile(errorMessage);
    await logToFile(`Stack trace: ${error.stack}`);
    await logToFile('=== Daily GA Sync Failed with Critical Error ===\n');
    
    // Send alert email for critical errors
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 CRITICAL: Daily GA Sync Error - Rise As One AAU',
        html: `
          <h2>Critical Error in Daily Google Analytics Sync</h2>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <p><strong>Stack Trace:</strong></p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error.stack}</pre>
          <p>Please check the logs at: ${LOG_FILE}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated alert from the Rise As One AAU SEO system.</p>
        `
      });
      await logToFile('Critical error alert email sent');
    } catch (emailError: any) {
      await logToFile(`Failed to send critical error email: ${emailError.message}`);
    }
    
    process.exit(1);
  }
}

// Run the sync
runDailyGASync();
