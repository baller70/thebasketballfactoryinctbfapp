/**
 * Daily Google Analytics Sync Execution Script
 * Runs the automatedGASync function and logs results
 */

import { automatedGASync } from './nextjs_space/lib/seo-automation';
import { sendEmail } from './nextjs_space/lib/email';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

async function executeDailyGASync() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  console.log(`[${timestamp}] Starting Daily Google Analytics Sync...`);
  
  try {
    // Step 1: Execute the GA sync
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
    console.log(`[${timestamp}] Sync completed. Status: ${result.success ? 'SUCCESS' : 'FAILURE'}`);
    console.log(`[${timestamp}] Message: ${result.message}`);
    
    // Step 3: If sync fails, send alert email
    if (!result.success) {
      console.log(`[${timestamp}] Sync failed. Sending alert email...`);
      
      const emailResult = await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .error-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 Daily GA Sync Failed</h1>
  </div>
  
  <div class="content">
    <p>The automated Google Analytics sync failed at <strong>${timestamp}</strong>.</p>
    
    <div class="error-box">
      <h3>Error Details:</h3>
      <p><strong>Message:</strong> ${result.message}</p>
    </div>
    
    <p>Please check the following:</p>
    <ul>
      <li>Google Analytics API credentials are valid</li>
      <li>Google Search Console connection is active</li>
      <li>Database connection is working</li>
      <li>Check logs at: /home/ubuntu/seo_automation_logs/daily_ga_sync.log</li>
    </ul>
    
    <p>The system will retry at the next scheduled time (2 AM daily).</p>
  </div>
  
  <div class="footer">
    <p>This is an automated alert from Rise As One AAU SEO Automation System</p>
    <p><a href="https://thebasketballfactoryinc.com/admin/seo">View SEO Dashboard</a></p>
  </div>
</body>
</html>
        `
      });
      
      if (emailResult.success) {
        const alertLogEntry = `Alert email sent to khouston@thebasketballfactorynj.com at ${timestamp}\n`;
        appendFileSync(logFile, alertLogEntry);
        console.log(`[${timestamp}] Alert email sent successfully`);
      } else {
        const alertLogEntry = `Failed to send alert email at ${timestamp}\n`;
        appendFileSync(logFile, alertLogEntry);
        console.log(`[${timestamp}] Failed to send alert email`);
      }
    }
    
    process.exit(result.success ? 0 : 1);
    
  } catch (error: any) {
    const errorTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const errorLogEntry = `
========================================
Timestamp: ${errorTimestamp}
Status: ERROR
Message: ${error.message}
Stack: ${error.stack}
========================================
`;
    
    appendFileSync(logFile, errorLogEntry);
    console.error(`[${errorTimestamp}] Fatal error:`, error);
    
    // Try to send alert email
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Critical Error - Rise As One AAU',
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .error-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚨 Daily GA Sync Critical Error</h1>
  </div>
  
  <div class="content">
    <p>A critical error occurred during the automated Google Analytics sync at <strong>${errorTimestamp}</strong>.</p>
    
    <div class="error-box">
      <h3>Error Details:</h3>
      <p><strong>Message:</strong> ${error.message}</p>
      <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;">${error.stack}</pre>
    </div>
    
    <p>Immediate action required. Please investigate the error and check system logs.</p>
  </div>
  
  <div class="footer">
    <p>This is an automated alert from Rise As One AAU SEO Automation System</p>
  </div>
</body>
</html>
        `
      });
    } catch (emailError) {
      console.error(`[${errorTimestamp}] Failed to send critical error email:`, emailError);
    }
    
    process.exit(1);
  }
}

// Execute the sync
executeDailyGASync();
