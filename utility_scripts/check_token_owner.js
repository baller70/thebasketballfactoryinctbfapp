const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkTokenAccount() {
  try {
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings || !settings.googleAuthTokens) {
      console.log('No Google auth tokens found');
      return;
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
    
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    console.log('\n=== TOKEN OWNER INFO ===');
    console.log('Email:', userInfo.data.email);
    console.log('Name:', userInfo.data.name);
    console.log('========================\n');
    
  } catch (error) {
    console.error('Error checking token owner:', error.message);
    if (error.response) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkTokenAccount();
