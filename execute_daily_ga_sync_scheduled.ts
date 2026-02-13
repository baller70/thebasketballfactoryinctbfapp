#!/usr/bin/env tsx

/**
 * Daily Google Analytics Sync - Scheduled Task Execution
 * Runs daily at 2 AM to sync GA and GSC data
 */

import { automatedGASync } from './nextjs_space/lib/seo-automation';
import { appendFileSync } from 'fs';
import { format } from 'date-fns';

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';

async function main() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
  console.log(`[${timestamp}] Starting Daily Google Analytics Sync...`);
  
  try {
    // Execute the GA sync
    const result = await automatedGASync();
    
    // Log the results
    const logEntry = `[${timestamp}] GA Sync ${result.success ? 'SUCCESS' : 'FAILED'}: ${result.message}\n`;
    appendFileSync(LOG_FILE, logEntry);
    
    console.log(logEntry);
    
    if (!result.success) {
      // Send alert email on failure
      const { sendEmail } = await import('./nextjs_space/lib/email');
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Failed',
        html: `
          <h2>Daily Google Analytics Sync Failed</h2>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>Error:</strong> ${result.message}</p>
          <p>Please check the logs at ${LOG_FILE} for more details.</p>
        `
      });
      
      console.error('Alert email sent to khouston@thebasketballfactorynj.com');
      process.exit(1);
    }
    
    console.log('Daily GA Sync completed successfully');
    process.exit(0);
  } catch (error: any) {
    const errorMsg = error.message || String(error);
    const logEntry = `[${timestamp}] GA Sync ERROR: ${errorMsg}\n`;
    appendFileSync(LOG_FILE, logEntry);
    
    console.error(logEntry);
    
    // Send alert email on error
    try {
      const { sendEmail } = await import('./nextjs_space/lib/email');
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Error',
        html: `
          <h2>Daily Google Analytics Sync Error</h2>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>Error:</strong> ${errorMsg}</p>
          <p><strong>Stack:</strong> <pre>${error.stack || 'N/A'}</pre></p>
          <p>Please check the logs at ${LOG_FILE} for more details.</p>
        `
      });
      
      console.error('Alert email sent to khouston@thebasketballfactorynj.com');
    } catch (emailError) {
      console.error('Failed to send alert email:', emailError);
    }
    
    process.exit(1);
  }
}

main();
