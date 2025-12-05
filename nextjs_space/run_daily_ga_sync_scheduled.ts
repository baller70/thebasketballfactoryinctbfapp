#!/usr/bin/env tsx

/**
 * Daily Google Analytics Sync - Scheduled Task
 * Runs daily at 2 AM to sync GA and GSC data
 */

import { automatedGASync } from '@/lib/seo-automation';
import { sendEmail } from '@/lib/email';
import { appendFileSync } from 'fs';
import { format } from 'date-fns';

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';

async function runDailyGASync() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  
  console.log(`[${timestamp}] Starting Daily GA Sync...`);
  
  try {
    // Step 1: Run the automated GA sync
    const result = await automatedGASync();
    
    // Step 2: Log the results
    const logEntry = `
[${timestamp}] Daily GA Sync Execution
Status: ${result.success ? 'SUCCESS' : 'FAILED'}
Message: ${result.message}
${result.success ? `Keywords synced: Data updated for last 30 days` : ''}
-------------------------------------------
`;
    
    appendFileSync(LOG_FILE, logEntry);
    console.log(`[${timestamp}] Sync completed. Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Step 3: If sync fails, send alert email
    if (!result.success) {
      console.error(`[${timestamp}] Sync failed. Sending alert email...`);
      
      try {
        await sendEmail({
          to: 'khouston@thebasketballfactorynj.com',
          subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
          html: `
            <h2>Daily Google Analytics Sync Failed</h2>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p><strong>Error Message:</strong> ${result.message}</p>
            <p>Please check the logs at: ${LOG_FILE}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is an automated alert from the SEO automation system.</p>
          `
        });
        
        const alertLogEntry = `[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com\n`;
        appendFileSync(LOG_FILE, alertLogEntry);
        console.log(`[${timestamp}] Alert email sent successfully`);
      } catch (emailError: any) {
        const emailErrorLog = `[${timestamp}] Failed to send alert email: ${emailError.message}\n`;
        appendFileSync(LOG_FILE, emailErrorLog);
        console.error(`[${timestamp}] Failed to send alert email:`, emailError);
      }
    }
    
    return result;
  } catch (error: any) {
    const errorTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const errorLogEntry = `
[${errorTimestamp}] Daily GA Sync Execution
Status: ERROR
Error: ${error.message}
Stack: ${error.stack}
-------------------------------------------
`;
    
    appendFileSync(LOG_FILE, errorLogEntry);
    console.error(`[${errorTimestamp}] Unexpected error:`, error);
    
    // Send alert email for unexpected errors
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Error - Rise As One AAU',
        html: `
          <h2>Daily Google Analytics Sync Error</h2>
          <p><strong>Timestamp:</strong> ${errorTimestamp}</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <pre>${error.stack}</pre>
          <p>Please check the logs at: ${LOG_FILE}</p>
          <hr>
          <p style="color: #666; font-size: 12px;">This is an automated alert from the SEO automation system.</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send error alert email:', emailError);
    }
    
    throw error;
  }
}

// Run the sync
runDailyGASync()
  .then((result) => {
    console.log('Daily GA Sync completed:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Daily GA Sync failed with error:', error);
    process.exit(1);
  });
