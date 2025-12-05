
/**
 * SEO Social Media Auto-Posting
 * Automatically posts SEO insights and content updates to Twitter/X
 */

interface SocialMediaPost {
  platform: 'twitter' | 'facebook' | 'instagram';
  content: string;
  url?: string;
  imageUrl?: string;
  scheduled?: Date;
}

interface TwitterCredentials {
  api_key: string;
  api_secret: string;
  access_token: string;
  access_token_secret: string;
  bearer_token?: string;
}

export async function getTwitterCredentials(): Promise<TwitterCredentials | null> {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const authSecretsPath = process.env.AUTH_SECRETS_PATH || path.join(process.env.HOME || '', '.config', 'abacusai_auth_secrets.json');

    if (!fs.existsSync(authSecretsPath)) {
      console.log('Auth secrets file not found');
      return null;
    }

    const authData = JSON.parse(fs.readFileSync(authSecretsPath, 'utf-8'));

    // Check for Rise As One AAU credentials first (preferred)
    if (authData['x (twitter) - riseasoneaau']?.secrets) {
      const secrets = authData['x (twitter) - riseasoneaau'].secrets;
      return {
        api_key: secrets.api_key?.value || '',
        api_secret: secrets.api_secret?.value || '',
        access_token: secrets.access_token?.value || '',
        access_token_secret: secrets.access_token_secret?.value || '',
        bearer_token: secrets.bearer_token?.value,
      };
    }

    // Fallback to Basketball Factory credentials
    if (authData['x (twitter) - basketball factory']?.secrets) {
      const secrets = authData['x (twitter) - basketball factory'].secrets;
      return {
        api_key: secrets.api_key?.value || '',
        api_secret: secrets.api_secret?.value || '',
        access_token: secrets.access_token?.value || '',
        access_token_secret: secrets.access_token_secret?.value || '',
      };
    }

    console.log('No Twitter credentials found');
    return null;
  } catch (error) {
    console.error('Error loading Twitter credentials:', error);
    return null;
  }
}

export async function postToTwitter(content: string): Promise<boolean> {
  try {
    const credentials = await getTwitterCredentials();

    if (!credentials) {
      console.log('Twitter credentials not available');
      return false;
    }

    // Use Twitter API v2
    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${credentials.bearer_token}`,
      },
      body: JSON.stringify({
        text: content,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twitter API error:', error);
      return false;
    }

    const data = await response.json();
    console.log('Tweet posted successfully:', data);
    return true;
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    return false;
  }
}

export function generateSEOUpdatePost(data: {
  type: 'keyword_ranking' | 'traffic_increase' | 'new_content' | 'performance';
  details: any;
}): string {
  const { type, details } = data;

  switch (type) {
    case 'keyword_ranking':
      return `🏀 SEO Update: We're now ranking #${details.position} for "${details.keyword}"! ${details.change > 0 ? '📈' : ''} Check out our basketball programs: https://thebasketballfactoryinc.com`;

    case 'traffic_increase':
      return `📊 Great news! Our website traffic increased by ${details.percentage}% this week! More families discovering our basketball programs. 🏀 #BasketballTraining #NewJersey`;

    case 'new_content':
      return `📝 New: ${details.title}\n\nLearn more about our basketball training programs in NJ.\n\n${details.url}\n\n#BasketballTraining #YouthSports`;

    case 'performance':
      return `💪 This month: ${details.clicks} clicks, ${details.impressions} impressions on Google!\n\nJoin the #1 basketball training facility in NJ.\n\nhttps://thebasketballfactoryinc.com`;

    default:
      return `🏀 The Basketball Factory - Premier basketball training in NJ for all ages! https://thebasketballfactoryinc.com`;
  }
}

export async function autoPostSEOUpdates(): Promise<{ posted: number; failed: number }> {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    let posted = 0;
    let failed = 0;

    // Check for significant keyword ranking improvements
    const keywordPerformance = await prisma.sEOPerformance.findMany({
      where: {
        date: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
        position: {
          lte: 5, // Top 5 positions
        },
      },
      include: { keyword: true },
      orderBy: { position: 'asc' },
      take: 1,
    });

    if (keywordPerformance.length > 0) {
      const perf = keywordPerformance[0];
      const post = generateSEOUpdatePost({
        type: 'keyword_ranking',
        details: {
          keyword: perf.keyword?.keyword,
          position: perf.position,
          change: 0,
        },
      });

      const success = await postToTwitter(post);
      if (success) {
        posted++;
        await prisma.sEOAuditLog.create({
          data: {
            action: 'social_media_posted',
            entityType: 'seo',
            entityId: perf.id.toString(),
            performedBy: 'system_automation',
            changes: {
              platform: 'twitter',
              content: post,
              keyword: perf.keyword?.keyword,
            },
          },
        });
      } else {
        failed++;
      }
    }

    await prisma.$disconnect();
    return { posted, failed };
  } catch (error) {
    await prisma.$disconnect();
    throw error;
  }
}
