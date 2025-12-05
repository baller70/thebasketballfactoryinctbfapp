#!/usr/bin/env tsx

/**
 * Daily GA Sync Scheduled Task
 * Runs automatedGASync and logs results
 */

import { automatedGASync } from './nextjs_space/lib/seo-automation';
import { appendFileSync } from 'fs';
import { format } from 'date-fns';

async function runDailyGASync() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  try {
    console.log(`[${timestamp}] Starting Daily GA Sync...`);
    
    // Call the automatedGASync function
    const result = await automatedGASync();
    
    // Prepare log entry
    const logEntry = `
========================================
Timestamp: ${timestamp}
Status: ${result.success ? 'SUCCESS' : 'FAILURE'}
Message: ${result.message}
========================================
`;
    
    // Write to log file
    appendFileSync(logFile, logEntry);
    
    console.log(`[${timestamp}] GA Sync completed:`, result);
    
    // If sync failed, we'll handle the alert in the next step
    if (!result.success) {
      console.error(`[${timestamp}] GA Sync failed: ${result.message}`);
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    const logEntry = `
========================================
Timestamp: ${timestamp}
Status: ERROR
Message: ${errorMessage}
Stack: ${error.stack || 'N/A'}
========================================
`;
    
    appendFileSync(logFile, logEntry);
    console.error(`[${timestamp}] Fatal error:`, error);
    process.exit(1);
  }
}

runDailyGASync();
