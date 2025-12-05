const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTokens() {
  try {
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.log('No SEO settings found');
      return;
    }
    
    console.log('Google Analytics Property ID:', settings.googleAnalyticsPropertyId || 'Not set');
    console.log('Google Search Console Site URL:', settings.googleSearchConsoleSiteUrl || 'Not set');
    
    if (settings.googleAuthTokens) {
      const tokens = typeof settings.googleAuthTokens === 'string' 
        ? JSON.parse(settings.googleAuthTokens)
        : settings.googleAuthTokens;
      
      console.log('\nGoogle Auth Tokens:');
      console.log('- Has access_token:', !!tokens.access_token);
      console.log('- Has refresh_token:', !!tokens.refresh_token);
      console.log('- Token expiry:', tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'Not set');
      console.log('- Is expired:', tokens.expiry_date ? new Date(tokens.expiry_date) < new Date() : 'Unknown');
      
      if (tokens.access_token) {
        console.log('- Access token (first 20 chars):', tokens.access_token.substring(0, 20) + '...');
      }
    } else {
      console.log('\nNo Google Auth Tokens found');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTokens();
