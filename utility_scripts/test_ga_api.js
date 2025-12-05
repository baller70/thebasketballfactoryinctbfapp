const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { google } = require('googleapis');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function testGA() {
  try {
    console.log('Fetching stored credentials...');
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings || !settings.googleAuthTokens) {
      console.log('ERROR: No Google auth tokens found');
      return;
    }
    
    const credentials = JSON.parse(settings.googleAuthTokens);
    console.log('Credentials loaded');
    console.log('- Has access_token:', !!credentials.access_token);
    console.log('- Has refresh_token:', !!credentials.refresh_token);
    console.log('- Expiry date:', new Date(credentials.expiry_date).toISOString());
    console.log('- Is expired:', credentials.expiry_date < Date.now());
    
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
    
    console.log('\nTrying to fetch GA4 properties list...');
    const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });
    
    try {
      const propertiesResponse = await analyticsadmin.properties.list({});
      console.log('\nGA4 Properties accessible with this token:');
      if (propertiesResponse.data.properties && propertiesResponse.data.properties.length > 0) {
        propertiesResponse.data.properties.forEach(prop => {
          console.log(`- Name: ${prop.displayName}`);
          console.log(`  Property ID: ${prop.name?.split('/').pop()}`);
          console.log(`  Full resource name: ${prop.name}`);
        });
      } else {
        console.log('No properties found - this account may not have access to any GA4 properties');
      }
    } catch (error) {
      console.error('Error fetching properties:', error.message);
      if (error.response) {
        console.error('Response:', JSON.stringify(error.response.data, null, 2));
      }
    }
    
  } catch (error) {
    console.error('\nFATAL ERROR:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testGA();
