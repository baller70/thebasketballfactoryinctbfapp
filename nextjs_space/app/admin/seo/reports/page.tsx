
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { format, subDays } from 'date-fns'

interface Report {
  id: string
  reportType: string
  startDate: string
  endDate: string
  totalImpressions: number
  totalClicks: number
  totalConversions: number
  avgCTR: number
  avgPosition: number
  generatedAt: string
  topKeywords?: Array<{
    keyword: string
    impressions: number
    clicks: number
    position: number
  }>
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [reportType, setReportType] = useState('weekly')
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  })

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/seo/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Failed to load reports')
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/seo/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        })
      })

      if (response.ok) {
        toast.success('Report generated successfully!')
        fetchReports()
      } else {
        toast.error('Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      toast.error('Failed to generate report')
    } finally {
      setGenerating(false)
    }
  }

  const downloadReport = (report: Report) => {
    const data = {
      report: {
        type: report.reportType,
        period: `${format(new Date(report.startDate), 'MMM d, yyyy')} - ${format(new Date(report.endDate), 'MMM d, yyyy')}`,
        generated: format(new Date(report.generatedAt), 'MMM d, yyyy h:mm a')
      },
      metrics: {
        impressions: report.totalImpressions,
        clicks: report.totalClicks,
        conversions: report.totalConversions,
        avgCTR: `${report.avgCTR.toFixed(2)}%`,
        avgPosition: report.avgPosition.toFixed(1)
      },
      topKeywords: report.topKeywords || []
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seo-report-${report.reportType}-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report downloaded')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SEO Analytics Reports</h1>
          <p className="text-gray-500 mt-1">Generate and view detailed performance reports</p>
        </div>
      </div>

      {/* Generate New Report */}
      <Card>
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Create a custom SEO performance report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Report</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <Button onClick={generateReport} disabled={generating} className="w-full md:w-auto">
            {generating ? (
              <>
                <BarChart3 className="mr-2 h-4 w-4 animate-pulse" />
                Generating Report...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Reports</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : reports.length > 0 ? (
          reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="capitalize">{report.reportType} Report</CardTitle>
                    <CardDescription>
                      {format(new Date(report.startDate), 'MMM d, yyyy')} - {format(new Date(report.endDate), 'MMM d, yyyy')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    <Calendar className="mr-1 h-3 w-3" />
                    {format(new Date(report.generatedAt), 'MMM d, yyyy')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">
                      {report.totalImpressions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Impressions</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">
                      {report.totalClicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Clicks</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">
                      {report.avgCTR.toFixed(2)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Avg CTR</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-700">
                      {report.avgPosition.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Avg Position</div>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <div className="text-2xl font-bold text-pink-700">
                      {report.totalConversions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Conversions</div>
                  </div>
                </div>

                {/* Top Keywords */}
                {report.topKeywords && report.topKeywords.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-sm">Top Keywords</h4>
                    <div className="space-y-2">
                      {report.topKeywords.slice(0, 5).map((kw, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium">{kw.keyword}</span>
                          <div className="flex gap-3 text-xs text-gray-600">
                            <span>{kw.impressions.toLocaleString()} views</span>
                            <span>{kw.clicks} clicks</span>
                            <span>Pos: {kw.position.toFixed(1)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => downloadReport(report)}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              No reports generated yet. Create your first report above!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
