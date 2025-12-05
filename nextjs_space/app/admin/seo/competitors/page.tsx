
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink, TrendingUp, Users, Link as LinkIcon } from 'lucide-react';

export default function CompetitorsPage() {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seo/competitors');
      if (response.ok) {
        const data = await response.json();
        setCompetitors(data);
      }
    } catch (error) {
      console.error('Error fetching competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">COMPETITOR ANALYSIS</h1>
        <p className="text-gray-600 mt-1">Monitor your competition and identify opportunities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">TOTAL COMPETITORS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{competitors.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {competitors.length === 0 ? 'No data yet' : 'Tracked in your market'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">OPPORTUNITIES FOUND</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {competitors.reduce((sum, c) => sum + (c.contentGaps?.length || 0), 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {competitors.length === 0 ? 'No data yet' : 'Keyword gaps to target'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">OPPORTUNITY SCORE</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-600">-</div>
            <p className="text-xs text-gray-500 mt-1">
              {competitors.length === 0 ? 'No data yet' : 'Weak competition overall'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Competitors Table */}
      <Card>
        <CardHeader>
          <CardTitle>COMPETITOR OVERVIEW</CardTitle>
          <CardDescription>
            {competitors.length === 0 
              ? 'No competitor data available. Sync Google Analytics or import competitor data to view analysis.'
              : 'Based on Ahrefs research and local market analysis'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {competitors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No competitor data available yet</p>
              <p className="text-sm text-gray-500">
                Import competitor data or sync with Google Analytics to start tracking your competition
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>COMPETITOR</TableHead>
                    <TableHead className="text-right">DR</TableHead>
                    <TableHead className="text-right">KEYWORDS</TableHead>
                    <TableHead className="text-right">TRAFFIC</TableHead>
                    <TableHead className="text-right">DOMAINS</TableHead>
                    <TableHead>CATEGORY</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitors.map((comp, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{comp.name}</p>
                          <a
                            href={`https://${comp.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            {comp.website}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-semibold ${
                            comp.domainRating >= 8
                              ? 'text-green-600'
                              : comp.domainRating >= 5
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {comp.domainRating}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{comp.organicKeywords}</TableCell>
                      <TableCell className="text-right">{comp.organicTraffic}/mo</TableCell>
                      <TableCell className="text-right">{comp.referringDomains}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {comp.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`https://${comp.website}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analysis - Only show when there's data */}
      {competitors.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {competitors.map((comp, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                {comp.name}
                <span className={`text-sm font-normal ${
                  comp.domainRating >= 8 ? 'text-green-600' :
                  comp.domainRating >= 5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  DR: {comp.domainRating}
                </span>
              </CardTitle>
              <CardDescription>
                <a
                  href={`https://${comp.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {comp.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Keywords</p>
                  <p className="font-semibold">{comp.organicKeywords}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Traffic/mo</p>
                  <p className="font-semibold">{comp.organicTraffic}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Domains</p>
                  <p className="font-semibold">{comp.referringDomains}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-green-700 mb-2">✓ Strengths</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {comp.strengths.map((strength: string, i: number) => (
                    <li key={i}>• {strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-red-700 mb-2">✗ Weaknesses</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {comp.weaknesses.map((weakness: string, i: number) => (
                    <li key={i}>• {weakness}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Key Insights - Only show when there's data */}
      {competitors.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">🎯 KEY OPPORTUNITIES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-green-900">
            <div>
              <h4 className="font-semibold mb-1">1. Local Keyword Gap (BIGGEST OPPORTUNITY!)</h4>
              <p>NONE of your 4 competitors rank for "basketball training sparta nj" or similar local keywords. This is your GOLD opportunity!</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">2. Content Freshness Gap</h4>
              <p>All competitors have outdated content (2023) or minimal pages. Your fresh 2025-2026 program content gives you an advantage.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">3. Backlink Quality Gap</h4>
              <p>You already have 57 referring domains (more than Triple Threat's 27!). Focus on quality local partnerships that competitors are missing.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">4. Different Audience Focus</h4>
              <p>Triple Threat focuses on AAU/travel teams. You can dominate the "basketball training" niche for local skills development.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
