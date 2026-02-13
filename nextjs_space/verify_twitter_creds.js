const fs = require('fs');
const path = require('path');

const secretsPath = path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));

const twitterCreds = secrets['x (twitter) - basketball factory'];

if (twitterCreds && twitterCreds.secrets) {
  console.log('✅ Twitter credentials found');
  console.log('Keys available:', Object.keys(twitterCreds.secrets));
} else {
  console.log('❌ Twitter credentials not found');
}
