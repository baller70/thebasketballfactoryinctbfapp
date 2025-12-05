const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSettings() {
  try {
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.log('No SEO settings found');
      return;
    }
    
    console.log('Email Configuration:');
    console.log('- Has resendApiKey:', !!settings.resendApiKey);
    console.log('- Has sendgridApiKey:', !!settings.sendgridApiKey);
    console.log('- Has mailgunApiKey:', !!settings.mailgunApiKey);
    console.log('- Has smtpConfig:', !!settings.smtpConfig);
    
    if (settings.resendApiKey) {
      console.log('- Resend API key (first 10 chars):', settings.resendApiKey.substring(0, 10) + '...');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSettings();
