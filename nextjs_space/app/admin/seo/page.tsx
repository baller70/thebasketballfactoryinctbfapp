
'use client';

/* Google Analytics Integration Added */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointerClick,
  Users,
  Target,
  ArrowRight,
  Download,
  Upload,
  Search,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { GoogleAnalyticsCard } from './google-analytics';

interface DashboardData {
  currentMetrics: {
    impressions: number;
    clicks: number;
    organicTraffic: number;
    conversions: number;
    avgPosition: number;
    ctr: number;
    conversionRate: number;
  };
  changes: {
    impressions: number;
    clicks: number;
    organicTraffic: number;
    conversions: number;
    avgPosition: number;
  };
  totalKeywords: number;
  topKeywords: Array<{
    keyword: string;
    clicks: number;
    impressions: number;
    position: number;
    ctr: number;
  }>;
  chartData: Array<{
    date: string;
    impressions: number;
    clicks: number;
    traffic: number;
    conversions: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    timestamp: string;
  }>;
}

export default function SEODashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/seo/dashboard?days=${timeRange}`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const renderChangeIndicator = (change: number) => {
    if (change === 0) return null;
    const isPositive = change > 0;
    return (
      <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  if (loading || !dashboardData) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO DASHBOARD</h1>
          <p className="text-gray-600 mt-1">Monitor your search engine performance and rankings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/seo/import">
              <Upload className="w-4 h-4 mr-2" />
              Import Data
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/seo/keywords">
              <Search className="w-4 h-4 mr-2" />
              Keywords
            </Link>
          </Button>
        </div>
      </div>

      {/* Google Analytics Integration */}
      <GoogleAnalyticsCard />

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {[7, 14, 30, 60, 90].map((days) => (
          <Button
            key={days}
            variant={timeRange === days ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(days)}
          >
            {days} days
          </Button>
        ))}
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Impressions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">IMPRESSIONS</CardTitle>
            <Eye className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.currentMetrics.impressions)}</div>
            {renderChangeIndicator(dashboardData.changes.impressions)}
          </CardContent>
        </Card>

        {/* Clicks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CLICKS</CardTitle>
            <MousePointerClick className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.currentMetrics.clicks)}</div>
            {renderChangeIndicator(dashboardData.changes.clicks)}
            <p className="text-xs text-gray-500 mt-1">CTR: {dashboardData.currentMetrics.ctr}%</p>
          </CardContent>
        </Card>

        {/* Organic Traffic */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">ORGANIC TRAFFIC</CardTitle>
            <Users className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.currentMetrics.organicTraffic)}</div>
            {renderChangeIndicator(dashboardData.changes.organicTraffic)}
          </CardContent>
        </Card>

        {/* Conversions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CONVERSIONS</CardTitle>
            <Target className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(dashboardData.currentMetrics.conversions)}</div>
            {renderChangeIndicator(dashboardData.changes.conversions)}
            <p className="text-xs text-gray-500 mt-1">Rate: {dashboardData.currentMetrics.conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>PERFORMANCE TRENDS</CardTitle>
          <CardDescription>Daily search performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" name="Impressions" />
                <Line type="monotone" dataKey="clicks" stroke="#3b82f6" name="Clicks" />
                <Line type="monotone" dataKey="traffic" stroke="#10b981" name="Traffic" />
                <Line type="monotone" dataKey="conversions" stroke="#f59e0b" name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Keywords */}
        <Card>
          <CardHeader>
            <CardTitle>TOP PERFORMING KEYWORDS</CardTitle>
            <CardDescription>Keywords driving the most clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.topKeywords.map((kw, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{kw.keyword}</p>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span>{formatNumber(kw.clicks)} clicks</span>
                      <span>{formatNumber(kw.impressions)} impressions</span>
                      <span>{kw.ctr}% CTR</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">#{kw.position.toFixed(1)}</p>
                    <p className="text-xs text-gray-500">position</p>
                  </div>
                </div>
              ))}
              {dashboardData.topKeywords.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No keyword data available yet</p>
                  <Button asChild variant="link" className="mt-2">
                    <Link href="/admin/seo/import">
                      Import Data <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>QUICK STATS</CardTitle>
            <CardDescription>Current SEO overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-gray-600">Total Keywords</span>
              <span className="text-lg font-semibold">{dashboardData.totalKeywords}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-gray-600">Average Position</span>
              <span className="text-lg font-semibold">#{dashboardData.currentMetrics.avgPosition.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-sm text-gray-600">Click-Through Rate</span>
              <span className="text-lg font-semibold">{dashboardData.currentMetrics.ctr}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-lg font-semibold">{dashboardData.currentMetrics.conversionRate}%</span>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button className="w-full" variant="outline" asChild>
                <Link href="/admin/seo/keywords">
                  <Search className="w-4 h-4 mr-2" />
                  Manage Keywords
                </Link>
              </Button>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/admin/seo/competitors">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Competitors
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
