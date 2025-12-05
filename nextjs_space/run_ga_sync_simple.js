#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import the automation library
const path = require('path');
const fs = require('fs');

async function runSync() {
  try {
    console.log('[Daily GA Sync] Starting...');
    
    // We need to use the TypeScript library, so let's use tsx to run it
    const { execSync } = require('child_process');
    
    // Create a simple TypeScript runner
    const tsCode = `
import { automatedGASync } from './lib/seo-automation';

async function run() {
  try {
    const result = await automatedGASync();
    console.log('Sync result:', JSON.stringify(result, null, 2));
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('Sync error:', error);
    process.exit(1);
  }
}

run();
`;
    
    fs.writeFileSync('/tmp/ga_sync_runner.ts', tsCode);
    
    // Run with tsx
    const result = execSync('npx tsx /tmp/ga_sync_runner.ts', {
      cwd: '/home/ubuntu/rise_as_one_aau/nextjs_space',
      stdio: 'inherit'
    });
    
    console.log('[Daily GA Sync] Completed successfully');
    
  } catch (error) {
    console.error('[Daily GA Sync] Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runSync();
