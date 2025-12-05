/**
 * Daily GA Sync Task Runner
 * Executes the automated GA sync and logs results
 */

import { automatedGASync } from '@/lib/seo-automation';
import { appendFileSync } from 'fs';
import { format } from 'date-fns';
import { sendEmail } from '@/lib/email';

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';

async function runDailyGASync() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  console.log(`[${timestamp}] Starting Daily GA Sync...`);
  
  try {
    // Step 1: Run the GA sync
    const result = await automatedGASync();
    
    // Step 2: Log the results
    const logEntry = `
[${timestamp}] Daily GA Sync Execution
Status: ${result.success ? 'SUCCESS' : 'FAILED'}
Message: ${result.message}
${result.success ? 'Data synced for last 30 days' : ''}
-------------------------------------------
`;
    
    appendFileSync(LOG_FILE, logEntry);
    console.log(`[${timestamp}] Sync completed. Status: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    
    // Step 3: Send alert if sync failed
    if (!result.success) {
      console.error(`[${timestamp}] Sync failed. Sending alert email...`);
      
      try {
        await sendEmail({
          to: 'khouston@thebasketballfactorynj.com',
          subject: '⚠️ Daily GA Sync Failed',
          html: `
            <h2>Daily Google Analytics Sync Failed</h2>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p><strong>Error Message:</strong> ${result.message}</p>
            <p>Please check the logs at: ${LOG_FILE}</p>
            <p>This is an automated alert from the SEO automation system.</p>
          `,
          text: `Daily GA Sync Failed\n\nTimestamp: ${timestamp}\nError: ${result.message}\n\nCheck logs at: ${LOG_FILE}`
        });
        
        console.log(`[${timestamp}] Alert email sent successfully`);
        appendFileSync(LOG_FILE, `[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com\n`);
      } catch (emailError: any) {
        console.error(`[${timestamp}] Failed to send alert email:`, emailError.message);
        appendFileSync(LOG_FILE, `[${timestamp}] ERROR: Failed to send alert email - ${emailError.message}\n`);
      }
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error: any) {
    const errorLog = `
[${timestamp}] Daily GA Sync Execution
Status: FAILED
Error: ${error.message}
Stack: ${error.stack}
-------------------------------------------
`;
    
    appendFileSync(LOG_FILE, errorLog);
    console.error(`[${timestamp}] Fatal error:`, error);
    
    // Try to send alert email
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Critical Error',
        html: `
          <h2>Daily Google Analytics Sync Critical Error</h2>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p><strong>Error:</strong> ${error.message}</p>
          <pre>${error.stack}</pre>
          <p>Please check the logs at: ${LOG_FILE}</p>
        `,
        text: `Daily GA Sync Critical Error\n\nTimestamp: ${timestamp}\nError: ${error.message}\n\nStack: ${error.stack}`
      });
    } catch (emailError) {
      console.error('Failed to send critical error email:', emailError);
    }
    
    process.exit(1);
  }
}

// Run the sync
runDailyGASync();
