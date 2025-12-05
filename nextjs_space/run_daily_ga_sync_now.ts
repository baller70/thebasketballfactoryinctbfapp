#!/usr/bin/env tsx
/**
 * Daily Google Analytics Sync Script
 * Runs the automated GA sync and logs results
 */

import { automatedGASync } from '@/lib/seo-automation';
import { sendEmail } from '@/lib/email';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOG_DIR = '/home/ubuntu/seo_automation_logs';
const LOG_FILE = join(LOG_DIR, 'daily_ga_sync.log');

async function runDailyGASync() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting Daily Google Analytics Sync...`);
  
  try {
    // Ensure log directory exists
    mkdirSync(LOG_DIR, { recursive: true });
    
    // Run the GA sync
    const result = await automatedGASync();
    
    // Prepare log entry
    const logEntry = `
========================================
Timestamp: ${timestamp}
Status: ${result.success ? 'SUCCESS' : 'FAILED'}
Message: ${result.message}
========================================
`;
    
    // Write to log file
    appendFileSync(LOG_FILE, logEntry);
    
    console.log(`[${timestamp}] GA Sync completed:`, result);
    
    if (!result.success) {
      console.error(`[${timestamp}] GA Sync failed:`, result.message);
      
      // Send alert email
      try {
        await sendEmail({
          to: 'khouston@thebasketballfactorynj.com',
          subject: '⚠️ Daily GA Sync Failed',
          html: `
            <h2>Daily Google Analytics Sync Failed</h2>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p><strong>Error:</strong> ${result.message}</p>
            <p>Please check the logs at ${LOG_FILE} for more details.</p>
          `
        });
        console.log(`[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com`);
      } catch (emailError: any) {
        console.error(`[${timestamp}] Failed to send alert email:`, emailError.message);
        appendFileSync(LOG_FILE, `Email Alert Failed: ${emailError.message}\n`);
      }
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error: any) {
    const errorTimestamp = new Date().toISOString();
    const errorLog = `
========================================
Timestamp: ${errorTimestamp}
Status: ERROR
Error: ${error.message}
Stack: ${error.stack}
========================================
`;
    
    appendFileSync(LOG_FILE, errorLog);
    console.error(`[${errorTimestamp}] Fatal error:`, error);
    
    // Try to send alert email
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Critical Error',
        html: `
          <h2>Daily Google Analytics Sync Critical Error</h2>
          <p><strong>Timestamp:</strong> ${errorTimestamp}</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <pre>${error.stack}</pre>
          <p>Please check the logs at ${LOG_FILE} for more details.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send critical error email:', emailError);
    }
    
    process.exit(1);
  }
}

// Run the sync
runDailyGASync();
