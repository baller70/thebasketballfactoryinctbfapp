/**
 * Simple Token Refresh Script
 */

import pg from 'pg';

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

async function refreshAccessToken(refreshToken, clientId, clientSecret) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

async function main() {
  try {
    console.log('Fetching SEO settings from database...');
    
    // Get SEO settings
    const settingsResult = await pool.query('SELECT * FROM "SEOSettings" LIMIT 1');
    
    if (settingsResult.rows.length === 0) {
      throw new Error('No SEO settings found in database');
    }
    
    const settings = settingsResult.rows[0];
    
    if (!settings.googleAuthTokens) {
      throw new Error('No Google auth tokens found in settings');
    }
    
    // Parse tokens
    const tokens = typeof settings.googleAuthTokens === 'string' 
      ? JSON.parse(settings.googleAuthTokens)
      : settings.googleAuthTokens;
    
    if (!tokens.refresh_token) {
      throw new Error('No refresh token found in settings');
    }
    
    console.log('Current token expiry:', new Date(tokens.expiry_date).toISOString());
    
    // Get OAuth credentials from environment
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      throw new Error('GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment');
    }
    
    console.log('Refreshing access token...');
    
    // Refresh the token
    const newTokenData = await refreshAccessToken(
      tokens.refresh_token,
      clientId,
      clientSecret
    );
    
    // Update tokens with new access token
    const updatedTokens = {
      ...tokens,
      access_token: newTokenData.access_token,
      expiry_date: Date.now() + (newTokenData.expires_in * 1000),
    };
    
    console.log('New token expiry:', new Date(updatedTokens.expiry_date).toISOString());
    
    // Update database
    await pool.query(
      'UPDATE "SEOSettings" SET "googleAuthTokens" = $1 WHERE id = $2',
      [JSON.stringify(updatedTokens), settings.id]
    );
    
    console.log('✅ Token refreshed successfully!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
