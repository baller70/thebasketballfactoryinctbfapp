/**
 * Execute Daily GA Sync - Scheduled Task
 * Runs the automatedGASync function and logs results
 */

import { automatedGASync } from './nextjs_space/lib/seo-automation';
import { appendFileSync } from 'fs';
import { format } from 'date-fns';

async function executeDailyGASync() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  try {
    console.log(`[${timestamp}] Starting Daily GA Sync...`);
    
    // Execute the sync
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
    
    if (!result.success) {
      console.error(`[${timestamp}] GA Sync failed:`, result.message);
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error: any) {
    const errorLog = `
========================================
Timestamp: ${timestamp}
Status: ERROR
Message: ${error.message}
Stack: ${error.stack}
========================================
`;
    
    appendFileSync(logFile, errorLog);
    console.error(`[${timestamp}] Fatal error:`, error);
    process.exit(1);
  }
}

executeDailyGASync();
