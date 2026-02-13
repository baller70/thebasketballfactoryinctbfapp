import { sendWeeklySEOReport } from './nextjs_space/lib/seo-automation';
import { writeFileSync, appendFileSync } from 'fs';
import { join } from 'path';

async function executeWeeklySEOReport() {
  const recipientEmail = 'khouston@thebasketballactorynj.com';
  const logDir = '/home/ubuntu/seo_automation_logs/weekly_reports';
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toISOString().split('T')[0];
  
  console.log(`[${timestamp}] Starting Weekly SEO Report generation...`);
  console.log(`Recipient: ${recipientEmail}`);
  
  try {
    // Step 1 & 2: Call the sendWeeklySEOReport function
    console.log('Calling sendWeeklySEOReport()...');
    const result = await sendWeeklySEOReport(recipientEmail);
    
    console.log('Report generation completed successfully');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    // Step 3: Save report data to JSON file
    const reportPath = join(logDir, `report_${dateStr}.json`);
    writeFileSync(reportPath, JSON.stringify(result, null, 2));
    console.log(`Report data saved to: ${reportPath}`);
    
    // Step 4: Log the email send status
    const logEntry = `[${timestamp}] SUCCESS - Weekly SEO report generated and sent to ${recipientEmail}\n`;
    appendFileSync(join(logDir, '../weekly_reports.log'), logEntry);
    console.log('Status logged to weekly_reports.log');
    
    console.log('\n✅ Weekly SEO Report task completed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('Error generating weekly SEO report:', error);
    
    // Step 4: Log the failure
    const logEntry = `[${timestamp}] FAILURE - Error generating weekly SEO report: ${error instanceof Error ? error.message : String(error)}\n`;
    appendFileSync(join(logDir, '../weekly_reports.log'), logEntry);
    
    console.log('\n❌ Weekly SEO Report task failed');
    process.exit(1);
  }
}

executeWeeklySEOReport();
