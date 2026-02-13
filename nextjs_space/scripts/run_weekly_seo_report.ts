#!/usr/bin/env tsx

/**
 * Weekly SEO Report Runner
 * Executes the sendWeeklySEOReport function and logs results
 */

import { sendWeeklySEOReport, generateWeeklyReport } from '@/lib/seo-automation';
import * as fs from 'fs';
import * as path from 'path';

async function runWeeklySEOReport() {
  const recipientEmail = 'khouston@thebasketballfactorynj.com';
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toISOString().split('T')[0];
  
  console.log(`[${timestamp}] Starting weekly SEO report generation...`);
  console.log(`[${timestamp}] Recipient: ${recipientEmail}`);

  try {
    // Generate the report data first
    console.log(`[${timestamp}] Generating report data...`);
    const reportData = await generateWeeklyReport();
    
    // Save report data to JSON file
    const reportsDir = '/home/ubuntu/seo_automation_logs/weekly_reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportFilePath = path.join(reportsDir, `report_${dateStr}.json`);
    fs.writeFileSync(reportFilePath, JSON.stringify(reportData, null, 2));
    console.log(`[${timestamp}] Report data saved to: ${reportFilePath}`);
    
    // Send the email
    console.log(`[${timestamp}] Sending email report...`);
    const success = await sendWeeklySEOReport(recipientEmail);
    
    // Log the result
    const logDir = '/home/ubuntu/seo_automation_logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFilePath = path.join(logDir, 'weekly_reports.log');
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ${success ? 'SUCCESS' : 'FAILURE'} - Recipient: ${recipientEmail} - Report saved: ${reportFilePath}\n`;
    
    fs.appendFileSync(logFilePath, logEntry);
    
    if (success) {
      console.log(`[${timestamp}] ✅ Weekly SEO report sent successfully to ${recipientEmail}`);
      console.log(`[${timestamp}] Log entry added to: ${logFilePath}`);
      process.exit(0);
    } else {
      console.error(`[${timestamp}] ❌ Failed to send weekly SEO report`);
      process.exit(1);
    }
    
  } catch (error: any) {
    const errorTimestamp = new Date().toISOString();
    console.error(`[${errorTimestamp}] ❌ Error running weekly SEO report:`, error);
    
    // Log the error
    const logDir = '/home/ubuntu/seo_automation_logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFilePath = path.join(logDir, 'weekly_reports.log');
    const logEntry = `[${errorTimestamp}] Weekly SEO Report - Status: ERROR - Recipient: ${recipientEmail} - Error: ${error.message}\n`;
    
    fs.appendFileSync(logFilePath, logEntry);
    
    process.exit(1);
  }
}

// Run the report
runWeeklySEOReport();
