#!/usr/bin/env tsx

/**
 * Daily GA Sync Scheduled Task
 * Runs automatedGASync and logs results
 * Sends alert email on failure
 */

import { automatedGASync } from '@/lib/seo-automation';
import { sendEmail } from '@/lib/email';
import { appendFileSync } from 'fs';
import { format } from 'date-fns';

const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';

async function sendAlertEmail(errorMessage: string, timestamp: string) {
  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
    .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background: #f9f9f9; }
    .error-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚠️ Daily GA Sync Failed</h1>
  </div>
  <div class="content">
    <p><strong>Time:</strong> ${timestamp}</p>
    <div class="error-box">
      <h3>Error Details:</h3>
      <pre>${errorMessage}</pre>
    </div>
    <p><strong>Action Required:</strong></p>
    <ul>
      <li>Check the log file at: /home/ubuntu/seo_automation_logs/daily_ga_sync.log</li>
      <li>Verify Google Analytics and Search Console credentials</li>
      <li>Check if the Next.js application is running</li>
      <li>Review the SEO dashboard at: <a href="https://thebasketballfactoryinc.com/admin/seo">https://thebasketballfactoryinc.com/admin/seo</a></li>
    </ul>
  </div>
  <div class="footer">
    <p>This is an automated alert from The Basketball Factory Inc. SEO Automation System</p>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to: ALERT_EMAIL,
      subject: `🚨 Daily GA Sync Failed - ${timestamp}`,
      html: emailHtml
    });

    if (result.success) {
      console.log(`✅ Alert email sent to ${ALERT_EMAIL}`);
    } else {
      console.error(`❌ Failed to send alert email:`, result.error);
    }

    return result.success;
  } catch (error) {
    console.error('❌ Exception sending alert email:', error);
    return false;
  }
}

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
    
    // If sync failed, send alert email
    if (!result.success) {
      console.log(`[${timestamp}] Sync failed, sending alert email...`);
      await sendAlertEmail(result.message, timestamp);
    }
    
    return result;
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
    
    // Send alert email for exception
    await sendAlertEmail(`${errorMessage}\n\nStack Trace:\n${error.stack || 'N/A'}`, timestamp);
    
    throw error;
  }
}

runDailyGASync()
  .then((result) => {
    if (!result.success) {
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
