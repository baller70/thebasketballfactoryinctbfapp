/**
 * Daily GA Sync Execution Script
 * Runs the automatedGASync function and logs results
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
Status: ${result.success ? 'SUCCESS' : 'FAILED'}
Message: ${result.message}
========================================
`;
    
    // Write to log file
    appendFileSync(logFile, logEntry);
    
    console.log(`[${timestamp}] GA Sync completed:`, result);
    console.log(`Log written to: ${logFile}`);
    
    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
    
  } catch (error: any) {
    const errorEntry = `
========================================
Timestamp: ${timestamp}
Status: ERROR
Message: ${error.message}
Stack: ${error.stack}
========================================
`;
    
    appendFileSync(logFile, errorEntry);
    console.error(`[${timestamp}] GA Sync failed with error:`, error);
    
    process.exit(1);
  }
}

// Run the sync
runDailyGASync();
