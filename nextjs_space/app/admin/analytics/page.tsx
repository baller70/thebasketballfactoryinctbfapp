'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  MousePointerClick,
  Eye
} from 'lucide-react'

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    totalEvents: 0,
    conversionRate: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    topPages: [] as { page: string, views: number }[],
    topEvents: [] as { event: string, count: number }[],
    deviceBreakdown: [] as { device: string, count: number }[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      const data = await response.json()
      setAnalytics(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Page Views',
      value: analytics.pageViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Total page views'
    },
    {
      title: 'Unique Visitors',
      value: analytics.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Unique site visitors'
    },
    {
      title: 'Total Events',
      value: analytics.totalEvents.toLocaleString(),
      icon: MousePointerClick,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'User interactions'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      description: 'Visitor to conversion'
    },
    {
      title: 'Avg Session Duration',
      value: `${Math.round(analytics.avgSessionDuration / 60)}m`,
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Average time on site'
    },
    {
      title: 'Bounce Rate',
      value: `${analytics.bounceRate}%`,
      icon: DollarSign,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      description: 'Single page sessions'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-xl font-semibold">Loading analytics...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Comprehensive website performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most viewed pages</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topPages.length === 0 ? (
              <p className="text-sm text-gray-500">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.topPages.slice(0, 8).map((page, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{page.page}</span>
                    <span className="text-sm font-semibold ml-4">{page.views}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
            <CardDescription>Most common user actions</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.topEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.topEvents.slice(0, 8).map((event, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm truncate flex-1">{event.event}</span>
                    <span className="text-sm font-semibold ml-4">{event.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Traffic by device type</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.deviceBreakdown.length === 0 ? (
              <p className="text-sm text-gray-500">No data available</p>
            ) : (
              <div className="space-y-3">
                {analytics.deviceBreakdown.map((device, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{device.device || 'Unknown'}</span>
                    <span className="text-sm font-semibold">{device.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Chart visualization coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
