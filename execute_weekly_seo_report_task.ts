#!/usr/bin/env tsx

/**
 * Weekly SEO Report Email Task Executor
 * Generates and sends comprehensive weekly SEO report
 */

import { sendWeeklySEOReport, generateWeeklyReport } from './nextjs_space/lib/seo-automation';
import { writeFileSync, appendFileSync } from 'fs';
import { format } from 'date-fns';

const RECIPIENT_EMAIL = 'khouston@thebasketballfactorynj.com';
const LOG_FILE = '/home/ubuntu/seo_automation_logs/weekly_reports.log';
const REPORT_DIR = '/home/ubuntu/seo_automation_logs/weekly_reports';

async function executeWeeklySEOReportTask() {
  const startTime = new Date();
  const dateStr = format(startTime, 'yyyy-MM-dd_HH-mm-ss');
  
  console.log('='.repeat(80));
  console.log('WEEKLY SEO REPORT EMAIL TASK');
  console.log('='.repeat(80));
  console.log(`Started at: ${startTime.toISOString()}`);
  console.log(`Recipient: ${RECIPIENT_EMAIL}`);
  console.log('');

  try {
    // Step 1 & 2: Generate report data and send email
    console.log('Step 1-2: Generating report and sending email...');
    const reportData = await generateWeeklyReport();
    const emailSent = await sendWeeklySEOReport(RECIPIENT_EMAIL);

    if (!emailSent) {
      throw new Error('Failed to send email');
    }

    console.log('✅ Email sent successfully');
    console.log('');
    console.log('Report Summary:');
    console.log(`  Date Range: ${reportData.dateRange}`);
    console.log(`  Impressions: ${reportData.metrics.impressions.toLocaleString()}`);
    console.log(`  Clicks: ${reportData.metrics.clicks.toLocaleString()}`);
    console.log(`  CTR: ${reportData.metrics.ctr.toFixed(2)}%`);
    console.log(`  Avg Position: ${reportData.metrics.avgPosition.toFixed(1)}`);
    console.log(`  Alerts: ${reportData.alerts.length}`);
    console.log(`  Top Keywords: ${reportData.topKeywords.length}`);
    console.log(`  Ranking Changes: ${reportData.rankingChanges.length}`);
    console.log('');

    // Step 3: Save report data to JSON
    console.log('Step 3: Saving report data to JSON...');
    const reportFilePath = `${REPORT_DIR}/report_${dateStr}.json`;
    writeFileSync(reportFilePath, JSON.stringify(reportData, null, 2));
    console.log(`✅ Report saved to: ${reportFilePath}`);
    console.log('');

    // Step 4: Log the execution
    console.log('Step 4: Logging execution status...');
    const logEntry = `[${startTime.toISOString()}] SUCCESS - Weekly SEO report sent to ${RECIPIENT_EMAIL} | Impressions: ${reportData.metrics.impressions} | Clicks: ${reportData.metrics.clicks} | Alerts: ${reportData.alerts.length}\n`;
    appendFileSync(LOG_FILE, logEntry);
    console.log(`✅ Logged to: ${LOG_FILE}`);
    console.log('');

    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;

    console.log('='.repeat(80));
    console.log('TASK COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log(`Duration: ${duration.toFixed(2)}s`);
    console.log(`Report file: ${reportFilePath}`);
    console.log(`Email sent to: ${RECIPIENT_EMAIL}`);
    console.log('');

    process.exit(0);
  } catch (error: any) {
    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;

    console.error('');
    console.error('='.repeat(80));
    console.error('TASK FAILED');
    console.error('='.repeat(80));
    console.error(`Error: ${error.message}`);
    console.error(`Duration: ${duration.toFixed(2)}s`);
    console.error('');

    // Log the failure
    const logEntry = `[${startTime.toISOString()}] FAILURE - Weekly SEO report failed | Error: ${error.message}\n`;
    appendFileSync(LOG_FILE, logEntry);

    process.exit(1);
  }
}

// Execute the task
executeWeeklySEOReportTask();
