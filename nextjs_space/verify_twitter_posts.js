const fs = require('fs');
const path = require('path');

async function verifyTwitterPosts() {
  try {
    // Load Twitter API credentials
    const secretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return;
    }

    const { TwitterApi } = require('twitter-api-v2');

    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: twitterCreds.secrets.api_key.value,
      appSecret: twitterCreds.secrets.api_secret.value,
      accessToken: twitterCreds.secrets.access_token.value,
      accessSecret: twitterCreds.secrets.access_token_secret.value,
    });

    // Get recent tweets from the authenticated user
    const me = await client.v2.me();
    console.log(`\n✅ Connected to Twitter account: @${me.data.username}`);
    console.log(`   Name: ${me.data.name}`);
    console.log(`   ID: ${me.data.id}\n`);

    // Get recent tweets
    const tweets = await client.v2.userTimeline(me.data.id, {
      max_results: 5,
      'tweet.fields': ['created_at', 'text']
    });

    console.log('📱 Recent Tweets:\n');
    
    if (tweets.data && tweets.data.data) {
      tweets.data.data.forEach((tweet, index) => {
        console.log(`Tweet ${index + 1}:`);
        console.log(`  Posted: ${tweet.created_at}`);
        console.log(`  Text: ${tweet.text}`);
        console.log('---\n');
      });
    } else {
      console.log('No recent tweets found.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.data) {
      console.error('Error details:', JSON.stringify(error.data, null, 2));
    }
  }
}

verifyTwitterPosts();
