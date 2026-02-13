#!/usr/bin/env tsx

/**
 * Daily Google Analytics Sync - Scheduled Task Execution
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
    
    // Log the results
    const logEntry = `[${timestamp}] GA Sync ${result.success ? 'SUCCESS' : 'FAILED'}: ${result.message}\n`;
    appendFileSync(logFile, logEntry);
    
    console.log(`[${timestamp}] ${result.success ? 'SUCCESS' : 'FAILED'}: ${result.message}`);
    
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
          <p>Please check the logs at /home/ubuntu/seo_automation_logs/daily_ga_sync.log for more details.</p>
        `
      });
      console.log(`[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com`);
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    const logEntry = `[${timestamp}] GA Sync ERROR: ${errorMessage}\n`;
    appendFileSync(logFile, logEntry);
    
    console.error(`[${timestamp}] ERROR: ${errorMessage}`);
    
    // Send alert email on error
    try {
      const { sendEmail } = await import('./nextjs_space/lib/email');
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Error',
        html: `
          <h2>Daily Google Analytics Sync Error</h2>
          <p><strong>Time:</strong> ${timestamp}</p>
          <p><strong>Error:</strong> ${errorMessage}</p>
          <p><strong>Stack:</strong> <pre>${error.stack || 'N/A'}</pre></p>
          <p>Please check the logs at /home/ubuntu/seo_automation_logs/daily_ga_sync.log for more details.</p>
        `
      });
      console.log(`[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com`);
    } catch (emailError) {
      console.error(`[${timestamp}] Failed to send alert email:`, emailError);
    }
    
    process.exit(1);
  }
}

runDailyGASync();
