const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function verifyAccount() {
  try {
    console.log('\n🔍 Checking which Google account is currently authorized...\n');
    
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings || !settings.googleAuthTokens) {
      console.log('❌ No Google auth tokens found in database');
      process.exit(1);
    }
    
    const credentials = JSON.parse(settings.googleAuthTokens);
    
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://thebasketballfactoryinc.com/api/seo/google/callback'
    );
    
    oauth2Client.setCredentials({
      access_token: credentials.access_token,
      refresh_token: credentials.refresh_token,
      expiry_date: credentials.expiry_date
    });
    
    // Try to get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    
    try {
      const { data } = await oauth2.userinfo.get();
      console.log('✅ CURRENT AUTHORIZED GOOGLE ACCOUNT:');
      console.log('   Email:', data.email);
      console.log('   Name:', data.name);
      console.log('\n📊 This is the account that authorized the Google Analytics connection.');
      console.log('\n🎯 EXPECTED ACCOUNT: khouston@thebasketballfactorynj.com');
      
      if (data.email === 'khouston@thebasketballfactorynj.com') {
        console.log('\n✅ ✅ ✅ MATCH! The correct account is connected.');
        console.log('\n🤔 If permissions error persists, the issue might be:');
        console.log('   1. API scopes - need to re-authorize with correct scopes');
        console.log('   2. GA4 API permissions - need specific API access enabled');
      } else {
        console.log('\n❌ ❌ ❌ MISMATCH! Wrong account is connected!');
        console.log('\n💡 SOLUTION: Disconnect and reconnect with khouston@thebasketballfactorynj.com');
      }
      
    } catch (userInfoError) {
      console.log('❌ Could not fetch user info:', userInfoError.message);
      
      // Try Analytics API instead
      console.log('\n🔄 Trying to check via Analytics Admin API...');
      const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });
      
      try {
        const accountSummaries = await analyticsadmin.accountSummaries.list({});
        console.log('\n✅ Token is valid and has Analytics access');
        console.log('Accounts accessible:', accountSummaries.data.accountSummaries?.length || 0);
        
        if (accountSummaries.data.accountSummaries) {
          console.log('\n📋 Google Analytics Accounts:');
          accountSummaries.data.accountSummaries.forEach((account, idx) => {
            console.log(`\n${idx + 1}. ${account.displayName} (${account.account})`);
            if (account.propertySummaries) {
              account.propertySummaries.forEach(prop => {
                const propId = prop.property?.split('/').pop();
                console.log(`   - ${prop.displayName} (ID: ${propId})`);
                if (propId === '412807442') {
                  console.log('     ✅ ✅ ✅ THIS IS YOUR PROPERTY!');
                }
              });
            }
          });
        }
      } catch (analyticsError) {
        console.log('❌ Analytics Admin API Error:', analyticsError.message);
      }
    }
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  } finally {
    await prisma.$disconnect();
  }
}

verifyAccount();
