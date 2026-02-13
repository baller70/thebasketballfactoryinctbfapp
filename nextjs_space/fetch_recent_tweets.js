const fs = require('fs');
const path = require('path');

async function fetchRecentTweets() {
  try {
    // Load Twitter credentials
    const secretsPath = path.join(process.env.HOME, '.config', 'abacusai_auth_secrets.json');
    const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
    
    const twitterCreds = secrets['x (twitter) - basketball factory'];
    if (!twitterCreds || !twitterCreds.secrets) {
      console.error('❌ Twitter credentials not found');
      return;
    }

    const accessToken = twitterCreds.secrets.access_token?.value;
    const accessSecret = twitterCreds.secrets.access_token_secret?.value;
    const apiKey = twitterCreds.secrets.api_key?.value;
    const apiSecret = twitterCreds.secrets.api_secret?.value;

    if (!accessToken || !accessSecret || !apiKey || !apiSecret) {
      console.error('❌ Missing Twitter API credentials');
      return;
    }

    console.log('✅ Twitter credentials loaded');
    console.log('📱 Attempting to fetch recent tweets...\n');

    // Use Twitter API v2 to get user's recent tweets
    const TwitterApi = require('twitter-api-v2').TwitterApi;
    
    const client = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    // Get authenticated user
    const me = await client.v2.me();
    console.log(`👤 Authenticated as: @${me.data.username} (${me.data.name})\n`);

    // Get recent tweets
    const tweets = await client.v2.userTimeline(me.data.id, {
      max_results: 10,
      'tweet.fields': ['created_at', 'text']
    });

    console.log('📊 Recent Tweets:\n');
    let count = 0;
    for await (const tweet of tweets) {
      count++;
      console.log(`${count}. [${tweet.created_at}]`);
      console.log(`   ${tweet.text}`);
      console.log('');
    }

    if (count === 0) {
      console.log('No tweets found.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.data) {
      console.error('Details:', JSON.stringify(error.data, null, 2));
    }
  }
}

fetchRecentTweets();
