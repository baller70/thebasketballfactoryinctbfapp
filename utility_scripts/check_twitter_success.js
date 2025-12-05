const fs = require('fs');

// Check if credentials exist and are properly formatted
const secretsPath = '/home/ubuntu/.config/abacusai_auth_secrets.json';
const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));

const twitterCreds = secrets['x (twitter) - basketball factory'];

if (twitterCreds && twitterCreds.secrets) {
  console.log('✅ Twitter credentials found and properly formatted');
  console.log('Available credential keys:', Object.keys(twitterCreds.secrets));
  
  // Check if all required keys exist
  const requiredKeys = ['api_key', 'api_secret', 'access_token', 'access_token_secret'];
  const hasAllKeys = requiredKeys.every(key => twitterCreds.secrets[key]);
  
  if (hasAllKeys) {
    console.log('✅ All required Twitter API credentials present');
  } else {
    console.log('❌ Missing some required credentials');
  }
} else {
  console.log('❌ Twitter credentials not properly configured');
}
