#!/usr/bin/env node

/**
 * Daily Google Analytics Sync Task
 * Calls the Next.js API to sync GA data
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

const LOG_FILE = '/home/ubuntu/seo_automation_logs/daily_ga_sync.log';
const ALERT_EMAIL = 'khouston@thebasketballfactorynj.com';
const API_URL = 'http://localhost:3001/api/seo/google/sync';

function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  
  console.log(logEntry.trim());
  
  // Ensure log directory exists
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(LOG_FILE, logEntry, 'utf8');
}

async function getSettings() {
  // Read settings from database using a simple query
  const { PrismaClient } = require('/home/ubuntu/rise_as_one_aau/nextjs_space/node_modules/@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const settings = await prisma.sEOSettings.findFirst();
    await prisma.$disconnect();
    return settings;
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}

async function callSyncAPI(propertyId, siteUrl) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      propertyId,
      siteUrl,
      days: 30
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/seo/google/sync',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 120000 // 2 minutes timeout
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: result });
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
}

async function sendAlertEmail(errorMessage) {
  try {
    const { PrismaClient } = require('/home/ubuntu/rise_as_one_aau/nextjs_space/node_modules/@prisma/client');
    const prisma = new PrismaClient();
    
    // Get email settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (settings && settings.emailSettings) {
      // Use nodemailer or similar to send email
      // For now, just log it
      logMessage(`Would send alert email to ${ALERT_EMAIL}: ${errorMessage}`);
    }
    
    await prisma.$disconnect();
  } catch (error) {
    logMessage(`Failed to send alert email: ${error.message}`);
  }
}

async function runGASync() {
  logMessage('========================================');
  logMessage('Starting Daily Google Analytics Sync');
  logMessage('========================================');

  try {
    // Get settings
    logMessage('Fetching SEO settings...');
    const settings = await getSettings();
    
    if (!settings) {
      throw new Error('SEO settings not found in database');
    }

    if (!settings.googleAuthTokens) {
      throw new Error('Google Auth tokens not configured');
    }

    if (!settings.googleAnalyticsPropertyId) {
      throw new Error('Google Analytics Property ID not configured');
    }

    if (!settings.googleSearchConsoleSiteUrl) {
      throw new Error('Google Search Console Site URL not configured');
    }

    logMessage(`Property ID: ${settings.googleAnalyticsPropertyId}`);
    logMessage(`Search Console URL: ${settings.googleSearchConsoleSiteUrl}`);
    logMessage('Calling sync API...');

    // Call the API
    const response = await callSyncAPI(
      settings.googleAnalyticsPropertyId,
      settings.googleSearchConsoleSiteUrl
    );

    if (response.statusCode === 200 && response.data.success) {
      logMessage('✅ GA Sync completed successfully');
      
      if (response.data.metrics) {
        logMessage(`Metrics: ${JSON.stringify(response.data.metrics)}`);
      }

      if (response.data.warnings && response.data.warnings.length > 0) {
        logMessage(`Warnings: ${response.data.warnings.join(', ')}`);
      }

      // Count keywords
      const { PrismaClient } = require('/home/ubuntu/rise_as_one_aau/nextjs_space/node_modules/@prisma/client');
      const prisma = new PrismaClient();
      const keywordCount = await prisma.sEOKeyword.count({
        where: { isActive: true }
      });
      await prisma.$disconnect();

      logMessage(`Keywords tracked: ${keywordCount}`);
      logMessage('========================================');
      logMessage('Daily GA Sync completed successfully');
      logMessage('========================================\n');

      process.exit(0);
    } else {
      const errorMsg = response.data.error || `API returned status ${response.statusCode}`;
      throw new Error(errorMsg);
    }

  } catch (error) {
    logMessage('❌ GA Sync failed');
    logMessage(`Error: ${error.message}`);
    if (error.stack) {
      logMessage(`Stack: ${error.stack}`);
    }

    // Send alert email
    await sendAlertEmail(error.message);

    logMessage('========================================');
    logMessage('Daily GA Sync failed - see errors above');
    logMessage('========================================\n');

    process.exit(1);
  }
}

// Run the sync
runGASync();
