#!/usr/bin/env node

/**
 * Daily Google Analytics Sync Script
 * Standalone script that syncs GA data and logs results
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const prisma = new PrismaClient();

async function runDailyGASync() {
  const timestamp = new Date().toISOString();
  const logFile = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
  
  console.log(`[${timestamp}] Starting daily GA sync...`);
  
  try {
    // Step 1: Check if Google Analytics is configured
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings?.googleAuthTokens || !settings?.googleAnalyticsPropertyId || !settings?.googleSearchConsoleSiteUrl) {
      const errorMsg = 'Google Analytics not configured';
      const logEntry = `[${timestamp}] GA Sync FAILED - ${errorMsg} - Keywords synced: 0\n`;
      fs.appendFileSync(logFile, logEntry);
      console.error(logEntry.trim());
      
      // Send alert email
      await sendAlertEmail(timestamp, errorMsg);
      
      await prisma.$disconnect();
      process.exit(1);
    }
    
    // Step 1: Call the API endpoint to trigger sync
    console.log(`[${timestamp}] Triggering GA sync via API...`);
    
    const fetch = require('node-fetch');
    
    // Make sure the dev server is running
    let serverRunning = false;
    try {
      const healthCheck = await fetch('http://localhost:3000/api/seo/google/sync', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      serverRunning = healthCheck.ok || healthCheck.status === 401;
    } catch (e) {
      console.log('Dev server not running, will log sync attempt only');
    }
    
    let result = { success: false, error: 'Server not running' };
    
    if (serverRunning) {
      try {
        const response = await fetch('http://localhost:3000/api/seo/google/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId: settings.googleAnalyticsPropertyId,
            siteUrl: settings.googleSearchConsoleSiteUrl,
            days: 30
          })
        });
        
        result = await response.json();
        console.log(`[${timestamp}] Sync result:`, result);
      } catch (error) {
        console.error(`[${timestamp}] API call failed:`, error);
        result = { success: false, error: error.message };
      }
    } else {
      // Log that sync was attempted but server wasn't running
      console.log(`[${timestamp}] Dev server not running - logging sync attempt`);
      result = { 
        success: false, 
        error: 'Dev server not running. Sync scheduled but not executed.' 
      };
    }
    
    // Get keyword count
    let keywordCount = 0;
    try {
      keywordCount = await prisma.sEOKeyword.count({
        where: { isActive: true }
      });
    } catch (error) {
      console.error('Failed to get keyword count:', error);
    }
    
    // Log the sync to audit log
    await prisma.sEOAuditLog.create({
      data: {
        action: 'automated_ga_sync',
        entityType: 'analytics',
        performedBy: 'system',
        changes: { 
          syncedAt: timestamp,
          success: result.success,
          message: result.success ? 'GA sync successful' : result.error || 'GA sync failed',
          dataPoints: result.metrics ? 1 : 0,
          warnings: result.warnings || []
        }
      }
    });
    
    // Step 2: Log the results
    const logEntry = `[${timestamp}] GA Sync ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.success ? 'GA sync successful' : result.error || 'GA sync failed'} - Keywords synced: ${keywordCount}\n`;
    
    fs.appendFileSync(logFile, logEntry);
    console.log(logEntry.trim());
    
    // Step 3: If sync fails, send alert email
    if (!result.success) {
      console.log('Sync failed, sending alert email...');
      await sendAlertEmail(timestamp, result.error || 'Unknown error');
    }
    
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
      await sendAlertEmail(timestamp, errorMessage);
    } catch (emailError) {
      console.error('Failed to send critical error email:', emailError);
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function sendAlertEmail(timestamp, errorMessage) {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center;">
          <h1>⚠️ GA Sync Alert</h1>
          <p>Daily Google Analytics sync has failed</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #dc2626;">Error Details</h2>
          <div style="background: white; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
            <p><strong>Timestamp:</strong> ${timestamp}</p>
            <p><strong>Error Message:</strong> ${errorMessage}</p>
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
    `;
    
    const result = await resend.emails.send({
      from: 'Rise As One AAU <onboarding@resend.dev>',
      to: 'khouston@thebasketballfactorynj.com',
      subject: '🚨 Daily GA Sync Failed - Rise As One AAU',
      html: emailHtml
    });
    
    if (result.error) {
      console.error('Failed to send alert email:', result.error);
      const alertFailEntry = `[${timestamp}] Failed to send alert email: ${result.error.message}\n`;
      fs.appendFileSync('/home/ubuntu/seo_automation_logs/daily_ga_sync.log', alertFailEntry);
    } else {
      console.log('Alert email sent successfully');
      const alertLogEntry = `[${timestamp}] Alert email sent to khouston@thebasketballfactorynj.com\n`;
      fs.appendFileSync('/home/ubuntu/seo_automation_logs/daily_ga_sync.log', alertLogEntry);
    }
  } catch (error) {
    console.error('Exception while sending alert email:', error);
  }
}

// Run the sync
runDailyGASync();
