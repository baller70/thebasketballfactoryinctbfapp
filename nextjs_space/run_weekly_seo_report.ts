import { sendWeeklySEOReport, generateWeeklyReport } from '@/lib/seo-automation';
import { writeFileSync, appendFileSync } from 'fs';

async function main() {
  const recipientEmail = 'khouston@thebasketballfactorynj.com';
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toISOString().split('T')[0];
  
  console.log(`[${timestamp}] Starting weekly SEO report generation...`);
  
  try {
    // Generate report data
    console.log('Generating report data...');
    const reportData = await generateWeeklyReport();
    
    // Save report data to JSON file
    const reportPath = `/home/ubuntu/seo_automation_logs/weekly_reports/report_${dateStr}.json`;
    writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
    console.log(`Report data saved to: ${reportPath}`);
    
    // Send email
    console.log(`Sending email to: ${recipientEmail}`);
    const success = await sendWeeklySEOReport(recipientEmail);
    
    // Log the result
    const logPath = '/home/ubuntu/seo_automation_logs/weekly_reports.log';
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ${success ? 'SUCCESS' : 'FAILURE'} - Recipient: ${recipientEmail} - Report saved: ${reportPath}\n`;
    appendFileSync(logPath, logEntry);
    
    if (success) {
      console.log('✅ Weekly SEO report sent successfully!');
      console.log(`Report data: ${reportPath}`);
      console.log(`Log entry: ${logPath}`);
    } else {
      console.error('❌ Failed to send weekly SEO report');
      process.exit(1);
    }
    
  } catch (error) {
    const logPath = '/home/ubuntu/seo_automation_logs/weekly_reports.log';
    const logEntry = `[${timestamp}] Weekly SEO Report - Status: ERROR - Error: ${error instanceof Error ? error.message : String(error)}\n`;
    appendFileSync(logPath, logEntry);
    
    console.error('Error generating/sending weekly report:', error);
    process.exit(1);
  }
}

main();
