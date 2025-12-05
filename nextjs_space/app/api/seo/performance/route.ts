
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfDay, subDays, format } from 'date-fns';

// GET performance data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const keywordId = searchParams.get('keywordId');
    const pagePath = searchParams.get('pagePath');

    const startDate = startOfDay(subDays(new Date(), days));

    const where: any = {
      date: {
        gte: startDate,
      },
    };

    if (keywordId) where.keywordId = keywordId;
    if (pagePath) where.pagePath = pagePath;

    const performanceData = await prisma.sEOPerformance.findMany({
      where,
      include: {
        keyword: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Aggregate metrics
    const totalImpressions = performanceData.reduce((sum, d) => sum + d.impressions, 0);
    const totalClicks = performanceData.reduce((sum, d) => sum + d.clicks, 0);
    const totalTraffic = performanceData.reduce((sum, d) => sum + d.organicTraffic, 0);
    const totalConversions = performanceData.reduce((sum, d) => sum + d.conversions, 0);
    const avgCTR = totalClicks / totalImpressions * 100 || 0;
    const avgPosition = performanceData.length > 0
      ? performanceData.reduce((sum, d) => sum + (d.position || 0), 0) / performanceData.length
      : 0;

    return NextResponse.json({
      performanceData,
      summary: {
        totalImpressions,
        totalClicks,
        totalTraffic,
        totalConversions,
        avgCTR: parseFloat(avgCTR.toFixed(2)),
        avgPosition: parseFloat(avgPosition.toFixed(2)),
        conversionRate: totalTraffic > 0 ? parseFloat((totalConversions / totalTraffic * 100).toFixed(2)) : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching performance data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}

// POST add performance data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      keywordId,
      date,
      pagePath,
      impressions = 0,
      clicks = 0,
      ctr,
      position,
      organicTraffic = 0,
      uniqueVisitors = 0,
      pageViews = 0,
      bounceRate,
      avgSessionDuration,
      conversions = 0,
      conversionRate,
      source,
      device,
      location,
    } = body;

    const dateObj = date ? new Date(date) : new Date();
    const dateKey = format(dateObj, 'yyyy-MM-dd');

    const performanceEntry = await prisma.sEOPerformance.create({
      data: {
        keywordId,
        date: dateObj,
        dateKey,
        pagePath,
        impressions,
        clicks,
        ctr,
        position,
        organicTraffic,
        uniqueVisitors,
        pageViews,
        bounceRate,
        avgSessionDuration,
        conversions,
        conversionRate,
        source,
        device,
        location,
      },
    });

    return NextResponse.json({ performance: performanceEntry }, { status: 201 });
  } catch (error) {
    console.error('Error creating performance entry:', error);
    return NextResponse.json(
      { error: 'Failed to create performance entry' },
      { status: 500 }
    );
  }
}
