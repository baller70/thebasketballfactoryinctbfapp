const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');

const prisma = new PrismaClient();

async function refreshTokens() {
  try {
    // Get current settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings || !settings.googleAuthTokens) {
      console.error('❌ No Google auth tokens found in database');
      process.exit(1);
    }
    
    const tokens = settings.googleAuthTokens;
    console.log('Current tokens:', {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiry: new Date(tokens.expiry_date).toISOString()
    });
    
    if (!tokens.refresh_token) {
      console.error('❌ No refresh token available. Need to re-authenticate.');
      process.exit(1);
    }
    
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'https://thebasketballfactoryinc.com/api/seo/google/callback'
    );
    
    // Set refresh token
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    });
    
    console.log('🔄 Refreshing access token...');
    
    // Refresh the token
    const { credentials } = await oauth2Client.refreshAccessToken();
    
    console.log('✅ Token refreshed successfully');
    
    // Update in database
    const updatedTokens = {
      access_token: credentials.access_token,
      refresh_token: tokens.refresh_token, // Keep the same refresh token
      expiry_date: credentials.expiry_date || Date.now() + 3600 * 1000
    };
    
    await prisma.sEOSettings.update({
      where: { id: settings.id },
      data: {
        googleAuthTokens: updatedTokens
      }
    });
    
    console.log('✅ Updated tokens in database');
    console.log('New expiry:', new Date(updatedTokens.expiry_date).toISOString());
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

refreshTokens();
