const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function updateTokens() {
  try {
    // Read the auth secrets
    const authData = JSON.parse(fs.readFileSync('/home/ubuntu/.config/abacusai_auth_secrets.json', 'utf8'));
    
    // Get the Google Drive token (which is the same as Google API token)
    const googleToken = authData?.googledriveuser?.secrets?.access_token?.value;
    
    if (!googleToken) {
      console.error('❌ No Google token found in auth secrets');
      process.exit(1);
    }
    
    console.log('✅ Found Google token');
    
    // Get current settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.error('❌ No SEO settings found in database');
      process.exit(1);
    }
    
    console.log('Current token expiry:', settings.googleAuthTokens?.expiry_date);
    
    // Update the tokens
    const newExpiry = Date.now() + (3600 * 1000); // 1 hour from now
    const updatedTokens = {
      ...settings.googleAuthTokens,
      access_token: googleToken,
      expiry_date: newExpiry
    };
    
    await prisma.sEOSettings.update({
      where: { id: settings.id },
      data: {
        googleAuthTokens: updatedTokens
      }
    });
    
    console.log('✅ Updated Google tokens in database');
    console.log('New expiry:', new Date(newExpiry).toISOString());
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateTokens();
