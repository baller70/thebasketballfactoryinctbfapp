import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSettings() {
  try {
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.log('No SEO settings found');
      return;
    }
    
    console.log('SEO Settings:');
    console.log('- Has Google Auth Tokens:', !!settings.googleAuthTokens);
    console.log('- Google Analytics Property ID:', settings.googleAnalyticsPropertyId || 'Not set');
    console.log('- Google Search Console Site URL:', settings.googleSearchConsoleSiteUrl || 'Not set');
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    await prisma.$disconnect();
  }
}

checkSettings();
