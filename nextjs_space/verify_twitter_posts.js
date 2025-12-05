const fs = require('fs');
const path = require('path');

async function verifyTwitterConnection() {
  try {
    const secretsPath = path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.log('❌ Twitter credentials not found');
      return;
    }

    console.log('✅ Twitter credentials found');
    console.log('Account:', twitterCreds.secrets.screen_name?.value || 'Unknown');
    console.log('API Key present:', !!twitterCreds.secrets.api_key?.value);
    console.log('Access Token present:', !!twitterCreds.secrets.access_token?.value);
    
    // Try to verify the connection
    const { TwitterApi } = require('twitter-api-v2');
    
    const client = new TwitterApi({
      appKey: twitterCreds.secrets.api_key.value,
      appSecret: twitterCreds.secrets.api_secret.value,
      accessToken: twitterCreds.secrets.access_token.value,
      accessSecret: twitterCreds.secrets.access_token_secret.value,
    });

    const me = await client.v2.me();
    console.log('\n✅ Twitter API Connection Verified!');
    console.log('Authenticated as:', me.data.username);
    console.log('Account name:', me.data.name);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyTwitterConnection();
