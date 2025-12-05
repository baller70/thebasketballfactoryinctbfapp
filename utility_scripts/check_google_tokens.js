const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkGoogleTokens() {
  try {
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.log('No SEO settings found');
      return;
    }
    
    console.log('SEO Settings found:');
    console.log('- Google Analytics Property ID:', settings.googleAnalyticsPropertyId || 'NOT SET');
    console.log('- Google Search Console Site URL:', settings.googleSearchConsoleSiteUrl || 'NOT SET');
    console.log('- Has Google Auth Tokens:', !!settings.googleAuthTokens);
    
    if (settings.googleAuthTokens) {
      try {
        const tokens = JSON.parse(settings.googleAuthTokens);
        console.log('\nGoogle Auth Tokens:');
        console.log('- Has Access Token:', !!tokens.access_token);
        console.log('- Has Refresh Token:', !!tokens.refresh_token);
        console.log('- Expiry Date:', tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'NOT SET');
        console.log('- Is Expired:', tokens.expiry_date ? (tokens.expiry_date < Date.now()) : 'UNKNOWN');
      } catch (e) {
        console.log('ERROR: Failed to parse googleAuthTokens:', e.message);
        console.log('Raw tokens:', settings.googleAuthTokens);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkGoogleTokens();
