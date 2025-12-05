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

async function getSettingsFromAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '100.106.34.98',
      port: 3001,
      path: '/api/seo/google/sync',
      method: 'GET',
      timeout: 30000
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
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

    req.end();
  });
}

async function callSyncAPI(propertyId, siteUrl) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      propertyId,
      siteUrl,
      days: 30
    });

    const options = {
      hostname: '100.106.34.98',
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

async function runGASync() {
  logMessage('========================================');
  logMessage('Starting Daily Google Analytics Sync');
  logMessage('========================================');

  try {
    // Get settings from API
    logMessage('Fetching SEO settings from API...');
    const settings = await getSettingsFromAPI();
    
    logMessage(`Connected: ${settings.connected}`);
    logMessage(`Configured: ${settings.configured}`);

    if (!settings.connected) {
      throw new Error('Google Analytics not connected');
    }

    if (!settings.configured) {
      throw new Error('Google Analytics not configured - missing Property ID or Site URL');
    }

    logMessage(`Property ID: ${settings.propertyId}`);
    logMessage(`Search Console URL: ${settings.siteUrl}`);
    logMessage('Calling sync API...');

    // Call the API
    const response = await callSyncAPI(
      settings.propertyId,
      settings.siteUrl
    );

    if (response.statusCode === 200 && response.data.success) {
      logMessage('✅ GA Sync completed successfully');
      
      if (response.data.metrics) {
        logMessage(`Metrics: ${JSON.stringify(response.data.metrics)}`);
      }

      if (response.data.warnings && response.data.warnings.length > 0) {
        logMessage(`Warnings: ${response.data.warnings.join(', ')}`);
      }

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

    logMessage(`Alert: Would send email to ${ALERT_EMAIL}`);

    logMessage('========================================');
    logMessage('Daily GA Sync failed - see errors above');
    logMessage('========================================\n');

    process.exit(1);
  }
}

// Run the sync
runGASync();
