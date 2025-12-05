import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function checkTokens() {
  try {
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.log('❌ No SEO settings found');
      return;
    }
    
    const tokens = typeof settings.googleAuthTokens === 'string' 
      ? JSON.parse(settings.googleAuthTokens)
      : settings.googleAuthTokens;
    
    console.log('Token Status:');
    console.log('- Has access token:', !!tokens.access_token);
    console.log('- Has refresh token:', !!tokens.refresh_token);
    console.log('- Expiry date:', tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : 'N/A');
    console.log('- Is expired:', tokens.expiry_date ? tokens.expiry_date < Date.now() : 'Unknown');
    console.log('- Time until expiry:', tokens.expiry_date ? Math.round((tokens.expiry_date - Date.now()) / 1000 / 60) + ' minutes' : 'N/A');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTokens();
