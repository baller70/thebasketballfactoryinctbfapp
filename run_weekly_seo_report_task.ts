#!/usr/bin/env tsx

/**
 * Weekly SEO Report Task Runner
 * Generates and emails comprehensive weekly SEO performance report
 */

import { sendWeeklySEOReport, generateWeeklyReport } from './nextjs_space/lib/seo-automation';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

const RECIPIENT_EMAIL = 'khouston@thebasketballfactorynj.com';
const LOG_DIR = '/home/ubuntu/seo_automation_logs/weekly_reports';
const LOG_FILE = `${LOG_DIR}/weekly_reports.log`;

async function runWeeklyReport() {
  const timestamp = new Date().toISOString();
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  
  console.log(`[${timestamp}] Starting Weekly SEO Report generation...`);
  
  try {
    // Step 1 & 2: Generate and send the report
    console.log(`[${timestamp}] Generating report data...`);
    const reportData = await generateWeeklyReport();
    
    console.log(`[${timestamp}] Sending email to ${RECIPIENT_EMAIL}...`);
    const emailSent = await sendWeeklySEOReport(RECIPIENT_EMAIL);
    
    // Step 3: Save report data to JSON
    const reportFilePath = `${LOG_DIR}/report_${dateStr}.json`;
    console.log(`[${timestamp}] Saving report data to ${reportFilePath}...`);
    writeFileSync(reportFilePath, JSON.stringify(reportData, null, 2));
    
    // Step 4: Log the status
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ${emailSent ? 'SUCCESS' : 'FAILED'} - Recipient: ${RECIPIENT_EMAIL} - Report saved: ${reportFilePath}\n`;
    appendFileSync(LOG_FILE, logEntry);
    
    if (emailSent) {
      console.log(`[${timestamp}] ✅ Weekly SEO report sent successfully!`);
      console.log(`[${timestamp}] Report metrics:`, {
        impressions: reportData.metrics.impressions,
        clicks: reportData.metrics.clicks,
        ctr: reportData.metrics.ctr.toFixed(2) + '%',
        avgPosition: reportData.metrics.avgPosition.toFixed(1),
        topKeywords: reportData.topKeywords.length,
        alerts: reportData.alerts.length,
        recommendations: reportData.recommendations.length
      });
    } else {
      console.error(`[${timestamp}] ❌ Failed to send weekly SEO report`);
      process.exit(1);
    }
    
  } catch (error: any) {
    const errorMsg = `[${timestamp}] ERROR: ${error.message}\n${error.stack}\n`;
    console.error(errorMsg);
    appendFileSync(LOG_FILE, errorMsg);
    process.exit(1);
  }
}

runWeeklyReport();
