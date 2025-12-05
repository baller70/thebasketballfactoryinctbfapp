#!/usr/bin/env tsx

/**
 * Weekly SEO Report Email Execution Script
 * Generates and sends comprehensive weekly SEO report
 */

import { sendWeeklySEOReport, generateWeeklyReport } from '@/lib/seo-automation';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

const RECIPIENT_EMAIL = 'khouston@thebasketballfactorynj.com';
const LOG_FILE = '/home/ubuntu/seo_automation_logs/weekly_reports.log';
const REPORT_DIR = '/home/ubuntu/seo_automation_logs/weekly_reports';

async function main() {
  const timestamp = new Date().toISOString();
  const dateStr = format(new Date(), 'yyyy-MM-dd');
  
  console.log(`[${timestamp}] Starting weekly SEO report generation...`);
  
  try {
    // Step 1: Generate report data
    console.log('Step 1: Generating report data...');
    const reportData = await generateWeeklyReport();
    
    // Step 2: Save report data to JSON file
    console.log('Step 2: Saving report data...');
    const reportPath = `${REPORT_DIR}/report_${dateStr}.json`;
    writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`Report data saved to: ${reportPath}`);
    
    // Step 3: Send email report
    console.log('Step 3: Sending email report...');
    const emailSent = await sendWeeklySEOReport(RECIPIENT_EMAIL);
    
    // Step 4: Log the result
    const logEntry = `[${timestamp}] Weekly SEO Report - Email: ${emailSent ? 'SUCCESS' : 'FAILED'} - Recipient: ${RECIPIENT_EMAIL} - Report saved: ${reportPath}\n`;
    appendFileSync(LOG_FILE, logEntry);
    
    if (emailSent) {
      console.log('✅ Weekly SEO report sent successfully!');
      console.log(`   Recipient: ${RECIPIENT_EMAIL}`);
      console.log(`   Report saved: ${reportPath}`);
      console.log(`   Log updated: ${LOG_FILE}`);
      
      // Print summary
      console.log('\n📊 Report Summary:');
      console.log(`   Date Range: ${reportData.dateRange}`);
      console.log(`   Impressions: ${reportData.metrics.impressions.toLocaleString()}`);
      console.log(`   Clicks: ${reportData.metrics.clicks.toLocaleString()}`);
      console.log(`   CTR: ${reportData.metrics.ctr.toFixed(2)}%`);
      console.log(`   Avg Position: ${reportData.metrics.avgPosition.toFixed(1)}`);
      console.log(`   Alerts: ${reportData.alerts.length}`);
      console.log(`   Top Keywords: ${reportData.topKeywords.length}`);
      console.log(`   Ranking Changes: ${reportData.rankingChanges.length}`);
      
      process.exit(0);
    } else {
      console.error('❌ Failed to send weekly SEO report email');
      process.exit(1);
    }
  } catch (error: any) {
    const errorLog = `[${timestamp}] Weekly SEO Report - ERROR: ${error.message}\n`;
    appendFileSync(LOG_FILE, errorLog);
    console.error('❌ Error generating/sending weekly report:', error);
    process.exit(1);
  }
}

main();
