
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const prisma = new PrismaClient();

interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

async function testGoogleConnection() {
  console.log('\n=== TESTING GOOGLE ANALYTICS CONNECTION ===\n');

  try {
    // Step 1: Check if tokens exist in database
    console.log('Step 1: Checking database for Google tokens...');
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.error('❌ No SEO settings found in database');
      return;
    }

    if (!settings.googleAuthTokens) {
      console.error('❌ No Google auth tokens found in database');
      return;
    }

    console.log('✅ Tokens found in database');
    
    // Parse tokens if they're stored as a string
    let tokens: GoogleTokens;
    if (typeof settings.googleAuthTokens === 'string') {
      console.log('Tokens are stored as string, parsing...');
      tokens = JSON.parse(settings.googleAuthTokens) as GoogleTokens;
    } else {
      tokens = settings.googleAuthTokens as GoogleTokens;
    }
    
    // Check token expiry
    const now = Date.now();
    const isExpired = tokens.expiry_date && tokens.expiry_date < now;
    if (tokens.expiry_date) {
      try {
        console.log(`Token expiry: ${new Date(tokens.expiry_date).toISOString()}`);
        console.log(`Is expired: ${isExpired}`);
      } catch {
        console.log(`Token expiry: ${tokens.expiry_date} (invalid date format)`);
      }
    } else {
      console.log('Token expiry: Not set');
    }
    
    if (!tokens.access_token) {
      console.error('❌ Access token is missing');
      return;
    }
    
    console.log(`Access token preview: ${tokens.access_token.substring(0, 20)}...`);

    // Step 2: Test OAuth2 client
    console.log('\nStep 2: Testing OAuth2 client...');
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials(tokens);

    // Get user info to verify token works
    try {
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const userInfo = await oauth2.userinfo.get();
      console.log('✅ OAuth2 client working');
      console.log(`Authenticated as: ${userInfo.data.email}`);
    } catch (error: any) {
      console.error('❌ OAuth2 client failed:', error.message);
      return;
    }

    // Step 3: Test Google Analytics Data API
    console.log('\nStep 3: Testing Google Analytics Data API...');
    
    if (!settings.googleAnalyticsPropertyId) {
      console.error('❌ No GA4 Property ID configured');
      return;
    }

    console.log(`Using Property ID: ${settings.googleAnalyticsPropertyId}`);

    try {
      const analyticsClient = new BetaAnalyticsDataClient({
        credentials: {
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          refresh_token: tokens.refresh_token,
          type: 'authorized_user',
        }
      });

      const [response] = await analyticsClient.runReport({
        property: `properties/${settings.googleAnalyticsPropertyId}`,
        dateRanges: [
          {
            startDate: '7daysAgo',
            endDate: 'today',
          },
        ],
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' }
        ],
      });

      console.log('✅ Google Analytics API working');
      console.log(`Rows returned: ${response.rows?.length || 0}`);
      
      if (response.rows && response.rows.length > 0) {
        console.log('Sample data (first row):');
        console.log(`  Date: ${response.rows[0].dimensionValues?.[0].value}`);
        console.log(`  Active Users: ${response.rows[0].metricValues?.[0].value}`);
        console.log(`  Sessions: ${response.rows[0].metricValues?.[1].value}`);
      } else {
        console.warn('⚠️  No data returned (property might be new or have no data)');
      }
    } catch (error: any) {
      console.error('❌ Google Analytics API failed');
      console.error(`Error code: ${error.code}`);
      console.error(`Error message: ${error.message}`);
      
      if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
        console.error('\n🔍 PERMISSION DENIED - This means:');
        console.error('  1. The Property ID might be incorrect');
        console.error('  2. The authenticated Google account does not have access to this property');
        console.error('  3. The Google Analytics Data API is not enabled in your Google Cloud project');
      }
      return;
    }

    // Step 4: Test Search Console API
    console.log('\nStep 4: Testing Search Console API...');
    
    if (!settings.googleSearchConsoleSiteUrl) {
      console.error('❌ No Search Console Site URL configured');
      return;
    }

    console.log(`Using Site URL: ${settings.googleSearchConsoleSiteUrl}`);

    try {
      const searchConsole = google.searchconsole({ version: 'v1', auth: oauth2Client });
      
      const response = await searchConsole.searchanalytics.query({
        siteUrl: settings.googleSearchConsoleSiteUrl,
        requestBody: {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          dimensions: ['query'],
          rowLimit: 5,
        },
      });

      console.log('✅ Search Console API working');
      console.log(`Rows returned: ${response.data.rows?.length || 0}`);
      
      if (response.data.rows && response.data.rows.length > 0) {
        console.log('Sample queries:');
        response.data.rows.slice(0, 3).forEach((row, i) => {
          console.log(`  ${i + 1}. ${row.keys?.[0]} - ${row.clicks} clicks`);
        });
      } else {
        console.warn('⚠️  No Search Console data (property might be new or not verified)');
      }
    } catch (error: any) {
      console.error('❌ Search Console API failed');
      console.error(`Error code: ${error.code}`);
      console.error(`Error message: ${error.message}`);
      
      if (error.code === 403) {
        console.error('\n🔍 PERMISSION DENIED - This means:');
        console.error('  1. The Site URL might be incorrect');
        console.error('  2. The authenticated Google account is not verified owner in Search Console');
        console.error('  3. The Search Console API is not enabled in your Google Cloud project');
      }
      return;
    }

    console.log('\n✅ ALL TESTS PASSED - Google Analytics connection is working!\n');

  } catch (error: any) {
    console.error('\n❌ TEST FAILED WITH ERROR:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testGoogleConnection();
