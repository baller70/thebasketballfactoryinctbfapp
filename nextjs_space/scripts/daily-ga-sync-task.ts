#!/usr/bin/env tsx

/**
 * Daily Google Analytics Sync Task
 * Executes the automatedGASync function and logs results
 */

import { automatedGASync } from '@/lib/seo-automation';
import { sendEmail } from '@/lib/email';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';

async function main() {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  console.log(`[${timestamp}] Starting Daily Google Analytics Sync...`);

  try {
    // Step 1: Execute the automatedGASync function
    const result = await automatedGASync();

    // Step 2: Log the results
    const logEntry = `
========================================
Timestamp: ${timestamp}
Status: ${result.success ? 'SUCCESS' : 'FAILURE'}
Message: ${result.message}
========================================
`;

    appendFileSync(LOG_FILE, logEntry);
    console.log(`[${timestamp}] Sync completed. Status: ${result.success ? 'SUCCESS' : 'FAILURE'}`);
    console.log(`[${timestamp}] Message: ${result.message}`);

    // Step 3: If sync fails, send alert email
    if (!result.success) {
      console.log(`[${timestamp}] Sync failed. Sending alert email to ${ALERT_EMAIL}...`);
      
      const emailResult = await sendEmail({
        to: ALERT_EMAIL,
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

    <p>Please check the system logs and Google Analytics configuration.</p>
    
    <p><strong>Log File:</strong> ${LOG_FILE}</p>
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
        console.log(`[${timestamp}] Alert email sent successfully.`);
        appendFileSync(LOG_FILE, `Alert email sent to ${ALERT_EMAIL}\n`);
      } else {
        console.error(`[${timestamp}] Failed to send alert email: ${emailResult.error}`);
        appendFileSync(LOG_FILE, `Failed to send alert email: ${emailResult.error}\n`);
      }
    }

    process.exit(result.success ? 0 : 1);
  } catch (error: any) {
    const errorTimestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const errorLog = `
========================================
Timestamp: ${errorTimestamp}
Status: FAILURE
Error: ${error.message}
Stack: ${error.stack}
========================================
`;

    appendFileSync(LOG_FILE, errorLog);
    console.error(`[${errorTimestamp}] Fatal error:`, error);

    // Send alert email for fatal errors
    try {
      await sendEmail({
        to: ALERT_EMAIL,
        subject: '🚨 Daily GA Sync Fatal Error - Rise As One AAU',
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
    <h1>🚨 Daily GA Sync Fatal Error</h1>
  </div>
  <div class="content">
    <p>The automated Google Analytics sync encountered a fatal error at <strong>${errorTimestamp}</strong>.</p>
    
    <div class="error-box">
      <h3>Error Details:</h3>
      <p><strong>Message:</strong> ${error.message}</p>
      <pre style="background: #f5f5f5; padding: 10px; overflow-x: auto;">${error.stack}</pre>
    </div>

    <p>Immediate attention required. Please check the system logs.</p>
    
    <p><strong>Log File:</strong> ${LOG_FILE}</p>
  </div>
  <div class="footer">
    <p>This is an automated alert from Rise As One AAU SEO Automation System</p>
    <p><a href="https://thebasketballfactoryinc.com/admin/seo">View SEO Dashboard</a></p>
  </div>
</body>
</html>
        `
      });
    } catch (emailError) {
      console.error(`[${errorTimestamp}] Failed to send fatal error email:`, emailError);
    }

    process.exit(1);
  }
}

main();
