/**
 * Daily Google Analytics Sync Script
 * Executes the automatedGASync function and logs results
 */

const fs = require('fs');
const path = require('path');

// Set up the Next.js environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

async function runDailyGASync() {
  const timestamp = new Date().toISOString();
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  console.log(`[${timestamp}] Starting daily GA sync...`);
  
  try {
    // Dynamically import the modules
    const { automatedGASync } = await import('./nextjs_space/lib/seo-automation.js');
    const { sendEmail } = await import('./nextjs_space/lib/email.js');
    const { prisma } = await import('./nextjs_space/lib/db.js');
    
    // Step 1: Call automatedGASync
    const result = await automatedGASync();
    
    // Get keyword count
    let keywordCount = 0;
    try {
      keywordCount = await prisma.sEOKeyword.count({
        where: { isActive: true }
      });
    } catch (error) {
      console.error('Failed to get keyword count:', error);
    }
    
    // Step 2: Log the results
    const logEntry = `[${timestamp}] GA Sync ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message} - Keywords synced: ${keywordCount}\n`;
    
    // Append to log file
    fs.appendFileSync(logFile, logEntry);
    console.log(logEntry.trim());
    
    // Step 3: If sync fails, send alert email
    if (!result.success) {
      console.log('Sync failed, sending alert email...');
      
      const emailResult = await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center;">
              <h1>⚠️ GA Sync Alert</h1>
              <p>Daily Google Analytics sync has failed</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <h2 style="color: #dc2626;">Error Details</h2>
              <div style="background: white; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <p><strong>Timestamp:</strong> ${timestamp}</p>
                <p><strong>Error Message:</strong> ${result.message}</p>
                <p><strong>Status:</strong> Failed</p>
              </div>
              
              <h3>Recommended Actions:</h3>
              <ul>
                <li>Check Google Analytics API credentials</li>
                <li>Verify Google Search Console connection</li>
                <li>Review SEO settings in admin dashboard</li>
                <li>Check system logs for detailed error information</li>
              </ul>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://thebasketballfactoryinc.com/admin/seo" 
                   style="background: #C8B273; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View SEO Dashboard
                </a>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>This is an automated alert from Rise As One AAU SEO Automation System</p>
            </div>
          </div>
        `
      });
      
      if (emailResult.success) {
        const alertLogEntry = `[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com\n`;
        fs.appendFileSync(logFile, alertLogEntry);
        console.log(alertLogEntry.trim());
      } else {
        const alertFailEntry = `[${timestamp}] Failed to send alert email: ${emailResult.error}\n`;
        fs.appendFileSync(logFile, alertFailEntry);
        console.error(alertFailEntry.trim());
      }
    }
    
    // Close database connection
    await prisma.$disconnect();
    
    process.exit(result.success ? 0 : 1);
    
  } catch (error) {
    const errorMessage = error.message || String(error);
    const errorLogEntry = `[${timestamp}] CRITICAL ERROR - ${errorMessage}\n`;
    
    fs.appendFileSync(logFile, errorLogEntry);
    console.error(errorLogEntry.trim());
    console.error('Full error:', error);
    
    // Try to send alert email for critical errors
    try {
      const { sendEmail } = await import('./nextjs_space/lib/email.js');
      const { prisma } = await import('./nextjs_space/lib/db.js');
      
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 CRITICAL: Daily GA Sync Script Error',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center;">
              <h1>🚨 Critical Error</h1>
              <p>Daily GA sync script encountered a critical error</p>
            </div>
            
            <div style="padding: 30px; background: #f9f9f9;">
              <div style="background: white; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
                <p><strong>Timestamp:</strong> ${timestamp}</p>
                <p><strong>Error:</strong> ${errorMessage}</p>
              </div>
              
              <p>The sync script failed to execute properly. Please investigate immediately.</p>
            </div>
          </div>
        `
      });
      
      await prisma.$disconnect();
    } catch (emailError) {
      console.error('Failed to send critical error email:', emailError);
    }
    
    process.exit(1);
  }
}

// Run the sync
runDailyGASync();
