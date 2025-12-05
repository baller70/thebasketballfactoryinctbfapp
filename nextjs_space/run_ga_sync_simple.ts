#!/usr/bin/env tsx

/**
 * Daily GA Sync Task Runner
 * Executes the automated Google Analytics sync and logs results
 */

import { automatedGASync } from './lib/seo-automation';
import { sendEmail } from './lib/email';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  const timestamp = new Date().toISOString();
  
  try {
    console.log(`[${timestamp}] Starting Daily GA Sync...`);
    
    // Run the sync
    const result = await automatedGASync();
    
    // Get keyword count
    const keywordCount = await prisma.sEOKeyword.count({
      where: { isActive: true }
    });
    
    // Log the result
    const logEntry = `
========================================
Timestamp: ${timestamp}
Status: ${result.success ? 'SUCCESS' : 'FAILED'}
Message: ${result.message}
Keywords Synced: ${keywordCount}
========================================
`;
    
    // Append to log file
    fs.appendFileSync(logFile, logEntry);
    
    console.log(`[${timestamp}] GA Sync completed: ${result.success ? 'SUCCESS' : 'FAILED'}`);
    console.log(`Message: ${result.message}`);
    console.log(`Keywords tracked: ${keywordCount}`);
    
    // If sync failed, send alert email
    if (!result.success) {
      console.error(`[${timestamp}] Sync failed, attempting to send alert email...`);
      
      const emailResult = await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Failed',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #dc2626;">Daily GA Sync Failed</h2>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p><strong>Error Message:</strong> ${result.message}</p>
            <p>Please check the logs at: <code>${logFile}</code></p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is an automated alert from The Basketball Factory Inc. SEO Automation System</p>
          </div>
        `
      });
      
      if (emailResult.success) {
        console.log(`[${timestamp}] Alert email sent successfully`);
        fs.appendFileSync(logFile, `Alert email sent to khouston@thebasketballfactorynj.com\n`);
      } else {
        console.error(`[${timestamp}] Failed to send alert email`);
        fs.appendFileSync(logFile, `Failed to send alert email\n`);
      }
    }
    
    await prisma.$disconnect();
    process.exit(result.success ? 0 : 1);
    
  } catch (error: any) {
    console.error(`[${timestamp}] Error running GA sync:`, error);
    
    const errorLogEntry = `
========================================
Timestamp: ${timestamp}
Status: ERROR
Error: ${error.message}
Stack: ${error.stack}
========================================
`;
    
    fs.appendFileSync(logFile, errorLogEntry);
    
    // Try to send alert email
    try {
      await sendEmail({
        to: 'khouston@thebasketballfactorynj.com',
        subject: '🚨 Daily GA Sync Error',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #dc2626;">Daily GA Sync Error</h2>
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">${error.stack}</pre>
            <p>Please check the logs at: <code>${logFile}</code></p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is an automated alert from The Basketball Factory Inc. SEO Automation System</p>
          </div>
        `
      });
      
      console.log(`[${timestamp}] Error alert email sent`);
    } catch (emailError) {
      console.error(`[${timestamp}] Failed to send error alert email:`, emailError);
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
