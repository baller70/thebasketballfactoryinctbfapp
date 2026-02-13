const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');

async function verifyTweets() {
  const secretsPath = '/home/ubuntu/.config/abacusai_auth_secrets.json';
  const secrets = JSON.parse(fs.readFileSync(secretsPath, 'utf8'));
  const twitterCreds = secrets['x (twitter) - basketball factory'];
  
  const client = new TwitterApi({
    appKey: twitterCreds.secrets.api_key.value,
    appSecret: twitterCreds.secrets.api_secret.value,
    accessToken: twitterCreds.secrets.access_token.value,
    accessSecret: twitterCreds.secrets.access_token_secret.value,
  });
  
  const tweetIds = [
    '1999616635825778862',
    '1999616636601721235',
    '1999616637318889812'
  ];
  
  console.log('🔍 Verifying tweets...\n');
  
  for (const id of tweetIds) {
    try {
      const tweet = await client.v2.singleTweet(id, {
        'tweet.fields': ['created_at', 'text', 'public_metrics']
      });
      
      console.log(`✅ Tweet ${id}:`);
      console.log(`   Text: ${tweet.data.text.substring(0, 60)}...`);
      console.log(`   Created: ${tweet.data.created_at}`);
      if (tweet.data.public_metrics) {
        console.log(`   Likes: ${tweet.data.public_metrics.like_count}`);
        console.log(`   Retweets: ${tweet.data.public_metrics.retweet_count}`);
      }
      console.log('');
    } catch (error) {
      console.log(`❌ Tweet ${id}: ${error.message}\n`);
    }
  }
}

verifyTweets();
