#!/usr/bin/env tsx

/**
 * Daily Google Analytics Sync - Scheduled Task Execution
 * Runs the automatedGASync function and logs results
 */

import { automatedGASync } from './nextjs_space/lib/seo-automation';
import { appendFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const LOG_DIR = '/home/ubuntu/seo_automation_logs';
const LOG_FILE = join(LOG_DIR, 'daily_ga_sync.log');

function logMessage(message: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  try {
    mkdirSync(LOG_DIR, { recursive: true });
    appendFileSync(LOG_FILE, logEntry);
    console.log(logEntry.trim());
  } catch (error) {
    console.error('Failed to write to log file:', error);
  }
}

async function main() {
  logMessage('=== Daily GA Sync Task Started ===');
  
  try {
    // Step 1: Run the automatedGASync function
    logMessage('Calling automatedGASync() to fetch last 30 days of GA and GSC data...');
    const result = await automatedGASync();
    
    // Step 2: Log the results
    if (result.success) {
      logMessage(`✅ SUCCESS: ${result.message}`);
      logMessage('GA and Search Console data synced successfully');
    } else {
      logMessage(`❌ FAILURE: ${result.message}`);
      
      // Step 3: Send alert notification on failure
      logMessage('Attempting to send alert notification...');
      
      try {
        const { sendEmail } = await import('./nextjs_space/lib/email');
        const emailResult = await sendEmail({
          to: 'khouston@thebasketballfactorynj.com',
          subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
                <h1>⚠️ GA Sync Alert</h1>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <h2>Daily Google Analytics Sync Failed</h2>
                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Error:</strong> ${result.message}</p>
                <p>The automated daily sync of Google Analytics and Search Console data has failed. Please check the system logs and verify your Google API credentials.</p>
                <div style="background: white; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0;">
                  <strong>Action Required:</strong>
                  <ul>
                    <li>Check Google Analytics API credentials</li>
                    <li>Verify Search Console connection</li>
                    <li>Review error logs at: /home/ubuntu/seo_automation_logs/daily_ga_sync.log</li>
                  </ul>
                </div>
              </div>
              <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
                <p>This is an automated alert from Rise As One AAU SEO System</p>
              </div>
            </div>
          `
        });
        
        if (emailResult.success) {
          logMessage('✅ Alert notification sent successfully to khouston@thebasketballfactorynj.com');
        } else {
          logMessage(`❌ Failed to send alert notification: ${emailResult.error || 'Unknown error'}`);
        }
      } catch (emailError: any) {
        logMessage(`❌ Error sending alert notification: ${emailError.message}`);
      }
    }
    
    logMessage('=== Daily GA Sync Task Completed ===\n');
    
    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
    
  } catch (error: any) {
    logMessage(`❌ CRITICAL ERROR: ${error.message}`);
    logMessage(`Stack trace: ${error.stack}`);
    logMessage('=== Daily GA Sync Task Failed ===\n');
    
    // Try to send critical error notification
    try {
      const { sendEmail } = await import('./nextjs_space/lib/email');
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 CRITICAL: Daily GA Sync Crashed - Rise As One AAU',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #7f1d1d; color: white; padding: 20px; text-align: center;">
              <h1>🚨 CRITICAL ERROR</h1>
            </div>
            <div style="padding: 30px; background: #fee2e2;">
              <h2>Daily GA Sync Task Crashed</h2>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Error:</strong> ${error.message}</p>
              <pre style="background: white; padding: 15px; overflow-x: auto; font-size: 12px;">${error.stack}</pre>
              <p><strong>Immediate action required to restore automated SEO monitoring.</strong></p>
            </div>
          </div>
        `
      });
      logMessage('Critical error notification sent');
    } catch (criticalEmailError) {
      logMessage('Failed to send critical error notification');
    }
    
    process.exit(1);
  }
}

main();
