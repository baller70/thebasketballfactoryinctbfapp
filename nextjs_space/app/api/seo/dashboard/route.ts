
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfDay, subDays, format } from 'date-fns';

export const dynamic = 'force-dynamic';

// GET dashboard overview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const startDate = startOfDay(subDays(new Date(), days));
    const prevStartDate = startOfDay(subDays(new Date(), days * 2));

    // Get current period performance
    const currentPerformance = await prisma.sEOPerformance.findMany({
      where: {
        date: {
          gte: startDate,
        },
      },
    });

    // Get previous period performance for comparison
    const previousPerformance = await prisma.sEOPerformance.findMany({
      where: {
        date: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
    });

    // Calculate current period metrics
    const currentMetrics = {
      impressions: currentPerformance.reduce((sum, d) => sum + d.impressions, 0),
      clicks: currentPerformance.reduce((sum, d) => sum + d.clicks, 0),
      organicTraffic: currentPerformance.reduce((sum, d) => sum + d.organicTraffic, 0),
      conversions: currentPerformance.reduce((sum, d) => sum + d.conversions, 0),
      avgPosition: currentPerformance.length > 0
        ? currentPerformance.reduce((sum, d) => sum + (d.position || 0), 0) / currentPerformance.length
        : 0,
    };

    // Calculate previous period metrics
    const previousMetrics = {
      impressions: previousPerformance.reduce((sum, d) => sum + d.impressions, 0),
      clicks: previousPerformance.reduce((sum, d) => sum + d.clicks, 0),
      organicTraffic: previousPerformance.reduce((sum, d) => sum + d.organicTraffic, 0),
      conversions: previousPerformance.reduce((sum, d) => sum + d.conversions, 0),
      avgPosition: previousPerformance.length > 0
        ? previousPerformance.reduce((sum, d) => sum + (d.position || 0), 0) / previousPerformance.length
        : 0,
    };

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return parseFloat((((current - previous) / previous) * 100).toFixed(2));
    };

    const changes = {
      impressions: calculateChange(currentMetrics.impressions, previousMetrics.impressions),
      clicks: calculateChange(currentMetrics.clicks, previousMetrics.clicks),
      organicTraffic: calculateChange(currentMetrics.organicTraffic, previousMetrics.organicTraffic),
      conversions: calculateChange(currentMetrics.conversions, previousMetrics.conversions),
      avgPosition: calculateChange(previousMetrics.avgPosition, currentMetrics.avgPosition), // Note: Lower is better
    };

    // Get total keywords
    const totalKeywords = await prisma.sEOKeyword.count({
      where: { isActive: true },
    });

    // Get top performing keywords
    const keywordsWithPerformance = await prisma.sEOKeyword.findMany({
      where: { isActive: true },
      include: {
        performanceData: {
          where: {
            date: {
              gte: startDate,
            },
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
      take: 10,
    });

    const topKeywords = keywordsWithPerformance
      .map(kw => {
        const totalClicks = kw.performanceData.reduce((sum, d) => sum + d.clicks, 0);
        const totalImpressions = kw.performanceData.reduce((sum, d) => sum + d.impressions, 0);
        const avgPosition = kw.performanceData.length > 0
          ? kw.performanceData.reduce((sum, d) => sum + (d.position || 0), 0) / kw.performanceData.length
          : 0;

        return {
          keyword: kw.keyword,
          clicks: totalClicks,
          impressions: totalImpressions,
          position: parseFloat(avgPosition.toFixed(2)),
          ctr: totalImpressions > 0 ? parseFloat((totalClicks / totalImpressions * 100).toFixed(2)) : 0,
        };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);

    // Get performance trend (daily data)
    const dailyData = await prisma.sEOPerformance.groupBy({
      by: ['dateKey'],
      where: {
        date: {
          gte: startDate,
        },
      },
      _sum: {
        impressions: true,
        clicks: true,
        organicTraffic: true,
        conversions: true,
      },
      orderBy: {
        dateKey: 'asc',
      },
    });

    const chartData = dailyData.map(d => ({
      date: d.dateKey,
      impressions: d._sum.impressions || 0,
      clicks: d._sum.clicks || 0,
      traffic: d._sum.organicTraffic || 0,
      conversions: d._sum.conversions || 0,
    }));

    // Get recent audit log
    const recentActivity = await prisma.sEOAuditLog.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({
      currentMetrics: {
        ...currentMetrics,
        avgPosition: parseFloat(currentMetrics.avgPosition.toFixed(2)),
        ctr: currentMetrics.impressions > 0
          ? parseFloat((currentMetrics.clicks / currentMetrics.impressions * 100).toFixed(2))
          : 0,
        conversionRate: currentMetrics.organicTraffic > 0
          ? parseFloat((currentMetrics.conversions / currentMetrics.organicTraffic * 100).toFixed(2))
          : 0,
      },
      changes,
      totalKeywords,
      topKeywords,
      chartData,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
