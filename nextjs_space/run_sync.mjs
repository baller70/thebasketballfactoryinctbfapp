/**
 * Daily Google Analytics Sync Script
 * Uses Next.js runtime to execute the automatedGASync function
 */

import { execSync } from 'child_process';
import fs from 'fs';

const timestamp = new Date().toISOString();
const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';

console.log(`[${timestamp}] Starting daily GA sync...`);

try {
  // Execute the sync via Next.js API route
  const result = execSync(
    'curl -X POST http://localhost:3000/api/seo/sync-ga -H "Content-Type: application/json" -d \'{"automated":true}\'',
    { encoding: 'utf-8', timeout: 120000 }
  );
  
  const response = JSON.parse(result);
  
  // Log the results
  const logEntry = `[${timestamp}] GA Sync ${response.success ? 'SUCCESS' : 'FAILED'} - ${response.message || 'No message'} - Keywords synced: ${response.keywordCount || 0}\n`;
  
  fs.appendFileSync(logFile, logEntry);
  console.log(logEntry.trim());
  
  // If sync fails, send alert email
  if (!response.success) {
    console.log('Sync failed, sending alert email...');
    
    const emailResult = execSync(
      `curl -X POST http://localhost:3000/api/seo/send-alert -H "Content-Type: application/json" -d '${JSON.stringify({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
        error: response.message || 'Unknown error',
        timestamp: timestamp
      })}'`,
      { encoding: 'utf-8', timeout: 30000 }
    );
    
    const emailResponse = JSON.parse(emailResult);
    
    if (emailResponse.success) {
      const alertLogEntry = `[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com\n`;
      fs.appendFileSync(logFile, alertLogEntry);
      console.log(alertLogEntry.trim());
    } else {
      const alertFailEntry = `[${timestamp}] Failed to send alert email: ${emailResponse.error}\n`;
      fs.appendFileSync(logFile, alertFailEntry);
      console.error(alertFailEntry.trim());
    }
  }
  
  process.exit(response.success ? 0 : 1);
  
} catch (error) {
  const errorMessage = error.message || String(error);
  const errorLogEntry = `[${timestamp}] CRITICAL ERROR - ${errorMessage}\n`;
  
  fs.appendFileSync(logFile, errorLogEntry);
  console.error(errorLogEntry.trim());
  console.error('Full error:', error);
  
  process.exit(1);
}
