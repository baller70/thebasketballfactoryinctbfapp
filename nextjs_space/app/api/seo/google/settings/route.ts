
/**
 * Google Analytics Settings API
 * Manages GA property ID and Search Console site URL
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    console.log('[Settings API] Starting settings save');
    const body = await request.json();
    console.log('[Settings API] Received body:', { propertyId: body.propertyId, siteUrl: body.siteUrl });
    
    const { propertyId, siteUrl } = body;

    if (!propertyId || !siteUrl) {
      console.error('[Settings API] Missing required fields');
      return NextResponse.json(
        { error: 'Property ID and Site URL are required' },
        { status: 400 }
      );
    }

    // Get or create settings
    console.log('[Settings API] Finding existing settings...');
    let settings = await prisma.sEOSettings.findFirst();
    console.log('[Settings API] Found settings:', settings ? `ID: ${settings.id}` : 'None found');
    
    if (!settings) {
      console.log('[Settings API] Creating new settings record...');
      settings = await prisma.sEOSettings.create({ data: {} });
      console.log('[Settings API] Created settings with ID:', settings.id);
    }

    // Update settings
    console.log('[Settings API] Updating settings...');
    const updatedSettings = await prisma.sEOSettings.update({
      where: { id: settings.id },
      data: {
        googleAnalyticsPropertyId: propertyId,
        googleSearchConsoleSiteUrl: siteUrl,
      },
    });
    console.log('[Settings API] Settings updated successfully:', {
      propertyId: updatedSettings.googleAnalyticsPropertyId,
      siteUrl: updatedSettings.googleSearchConsoleSiteUrl
    });

    return NextResponse.json({
      success: true,
      message: 'Settings saved successfully',
    });
  } catch (error: any) {
    console.error('[Settings API] ERROR:', error);
    console.error('[Settings API] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to save settings', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settings = await prisma.sEOSettings.findFirst();

    return NextResponse.json({
      propertyId: settings?.googleAnalyticsPropertyId || '',
      siteUrl: settings?.googleSearchConsoleSiteUrl || '',
    });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    console.log('[Settings API] Starting Google Analytics disconnect');
    
    // Get settings
    const settings = await prisma.sEOSettings.findFirst();
    
    if (!settings) {
      console.log('[Settings API] No settings found to disconnect');
      return NextResponse.json({
        success: true,
        message: 'Already disconnected',
      });
    }

    console.log('[Settings API] Clearing Google auth tokens and settings...');
    
    // Clear Google auth tokens and configuration
    await prisma.sEOSettings.update({
      where: { id: settings.id },
      data: {
        googleAuthTokens: Prisma.JsonNull,
        googleAnalyticsPropertyId: null,
        googleSearchConsoleSiteUrl: null,
      },
    });

    // Log the disconnection
    await prisma.sEOAuditLog.create({
      data: {
        action: 'google_disconnected',
        entityType: 'settings',
        reason: 'Google Analytics and Search Console disconnected by admin',
      },
    });

    console.log('[Settings API] Google Analytics disconnected successfully');

    return NextResponse.json({
      success: true,
      message: 'Google Analytics disconnected successfully',
    });
  } catch (error: any) {
    console.error('[Settings API] ERROR during disconnect:', error);
    console.error('[Settings API] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: 'Failed to disconnect Google Analytics', details: error.message },
      { status: 500 }
    );
  }
}
