const fs = require('fs');
const path = require('path');

async function checkTwitterPosts() {
  try {
    const { TwitterApi } = require('twitter-api-v2');
    
    // Load credentials
    const secretsPath = path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return;
    }

    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: twitterCreds.secrets.api_key.value,
      appSecret: twitterCreds.secrets.api_secret.value,
      accessToken: twitterCreds.secrets.access_token.value,
      accessSecret: twitterCreds.secrets.access_token_secret.value,
    });

    // Get recent tweets from authenticated user
    const me = await client.v2.me();
    console.log(`\n📱 Checking tweets for: @${me.data.username}\n`);
    
    const tweets = await client.v2.userTimeline(me.data.id, {
      max_results: 10,
      'tweet.fields': ['created_at', 'text']
    });

    console.log(`📊 Found ${tweets.data.data?.length || 0} recent tweets:\n`);
    
    if (tweets.data.data) {
      tweets.data.data.forEach((tweet, idx) => {
        console.log(`${idx + 1}. ${tweet.created_at}`);
        console.log(`   ${tweet.text.substring(0, 100)}...\n`);
      });
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkTwitterPosts();
