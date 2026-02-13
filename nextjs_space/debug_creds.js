const fs = require('fs');
const path = require('path');

const secretsPath = path.join(process.env.HOME, '.config', 'abacusai_auth_secrets.json');
const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));

const twitterCreds = secrets['x (twitter) - basketball factory'];
console.log('Twitter Creds:', JSON.stringify(twitterCreds, null, 2));

if (twitterCreds && twitterCreds.secrets) {
  console.log('\nAccess Token:', twitterCreds.secrets.access_token?.value ? 'EXISTS' : 'MISSING');
  console.log('Access Secret:', twitterCreds.secrets.access_token_secret?.value ? 'EXISTS' : 'MISSING');
  console.log('API Key:', twitterCreds.secrets.api_key?.value ? 'EXISTS' : 'MISSING');
  console.log('API Secret:', twitterCreds.secrets.api_secret?.value ? 'EXISTS' : 'MISSING');
}
