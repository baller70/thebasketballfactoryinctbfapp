
/**
 * Google Analytics OAuth Authentication Initiation
 * Redirects user to Google consent screen
 */

import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/google-analytics';

export async function GET() {
  try {
    const authUrl = getAuthUrl();
    
    return NextResponse.json({ authUrl });
  } catch (error: any) {
    console.error('Error generating auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL', details: error.message },
      { status: 500 }
    );
  }
}
