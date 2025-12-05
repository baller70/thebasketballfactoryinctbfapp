/**
 * Daily GA Sync - Scheduled Task Execution
 * Runs automatedGASync and logs results
 */

import { automatedGASync } from '@/lib/seo-automation';
import { sendEmail } from '@/lib/email';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

async function runDailyGASync() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  console.log(`[${timestamp}] Starting Daily GA Sync...`);
  
  try {
    // Step 1: Run the automated GA sync
    const result = await automatedGASync();
    
    // Step 2: Log the results
    const logEntry = `
========================================
Timestamp: ${timestamp}
Status: ${result.success ? 'SUCCESS' : 'FAILURE'}
Message: ${result.message}
========================================
`;
    
    appendFileSync(logFile, logEntry);
    console.log(`[${timestamp}] Sync completed:`, result);
    
    // Step 3: Handle failures - send alert email
    if (!result.success) {
      console.error(`[${timestamp}] Sync failed, sending alert email...`);
      
      const emailResult = await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Failed',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
              <h1>⚠️ Daily GA Sync Failed</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2>Error Details</h2>
              <p><strong>Timestamp:</strong> ${timestamp}</p>
              <p><strong>Error Message:</strong></p>
              <pre style="background: white; padding: 15px; border-left: 4px solid #dc2626; overflow-x: auto;">${result.message}</pre>
              
              <h3>What to do:</h3>
              <ul>
                <li>Check Google Analytics and Search Console connections</li>
                <li>Verify API credentials are valid</li>
                <li>Review the full log at: ${logFile}</li>
                <li>Visit the <a href="https://thebasketballfactoryinc.com/admin/seo">SEO Dashboard</a> to investigate</li>
              </ul>
            </div>
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>This is an automated alert from The Basketball Factory Inc. SEO Automation System</p>
            </div>
          </div>
        `
      });
      
      if (emailResult.success) {
        console.log(`[${timestamp}] Alert email sent successfully`);
        appendFileSync(logFile, `Alert email sent to khouston@thebasketballfactorynj.com\n`);
      } else {
        console.error(`[${timestamp}] Failed to send alert email:`, emailResult.error);
        appendFileSync(logFile, `Failed to send alert email: ${emailResult.error}\n`);
      }
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    console.error(`[${timestamp}] Fatal error:`, error);
    
    // Log the error
    const errorLogEntry = `
========================================
Timestamp: ${timestamp}
Status: FATAL ERROR
Error: ${errorMessage}
Stack: ${error.stack || 'N/A'}
========================================
`;
    
    appendFileSync(logFile, errorLogEntry);
    
    // Try to send alert email
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync - Fatal Error',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
              <h1>⚠️ Daily GA Sync - Fatal Error</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
              <h2>Fatal Error Details</h2>
              <p><strong>Timestamp:</strong> ${timestamp}</p>
              <p><strong>Error:</strong></p>
              <pre style="background: white; padding: 15px; border-left: 4px solid #dc2626; overflow-x: auto;">${errorMessage}</pre>
              
              <p><strong>Stack Trace:</strong></p>
              <pre style="background: white; padding: 15px; border-left: 4px solid #dc2626; overflow-x: auto; font-size: 11px;">${error.stack || 'N/A'}</pre>
              
              <h3>Immediate Action Required:</h3>
              <ul>
                <li>Review the error details above</li>
                <li>Check the full log at: ${logFile}</li>
                <li>Verify database connectivity</li>
                <li>Check Google API credentials and quotas</li>
              </ul>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error(`[${timestamp}] Failed to send fatal error email:`, emailError);
    }
    
    process.exit(1);
  }
}

// Run the sync
runDailyGASync();
