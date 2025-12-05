
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Download, FileJson, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ImportPage() {
  const [importType, setImportType] = useState('keywords');
  const [importData, setImportData] = useState('');
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors?: string[] } | null>(null);

  const templates = {
    keywords: `keyword,searchVolume,difficulty,category,targetLocation,priority
basketball training sparta nj,140,35,local,"Sparta, NJ",8
youth basketball programs,500,45,generic,"",7
private basketball lessons,300,40,local,"Sparta, NJ",8`,
    performance: `date,keyword,pagePath,impressions,clicks,ctr,position,organicTraffic,pageViews,bounceRate,conversions
2025-11-12,basketball training sparta nj,/private-lessons,500,25,5.0,3.2,150,200,45.5,5
2025-11-12,youth basketball programs,/programs,800,40,5.0,4.1,200,250,50.0,8`,
    competitors: `name,website,domainRating,organicKeywords,organicTraffic,referringDomains,category,notes
Brian Thomas Basketball,brianthomas-basketball.com,4.5,12,0,58,direct_competitor,Local competitor in Morris County
DST Basketball,dstbasketball.net,6,55,5,73,direct_competitor,Sussex County competitor
MAS Basketball,masbasketball.com,9,132,5,235,direct_competitor,More established competitor`,
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error('Please paste your data');
      return;
    }

    setImporting(true);
    setImportResult(null);

    try {
      // Parse CSV data
      const lines = importData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });

      const response = await fetch('/api/seo/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          type: importType,
          source: 'manual',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setImportResult(result);
      toast.success(`Successfully imported ${result.imported} records`);
      
      if (result.errors && result.errors.length > 0) {
        console.error('Import errors:', result.errors);
      }
    } catch (error: any) {
      console.error('Import error:', error);
      toast.error(error.message || 'Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = templates[importType as keyof typeof templates];
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">IMPORT SEO DATA</h1>
        <p className="text-gray-600 mt-1">Upload CSV or JSON data from Google Analytics, Search Console, or Ahrefs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>IMPORT DATA</CardTitle>
              <CardDescription>Select data type and paste your CSV data below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="importType">Data Type</Label>
                <Select value={importType} onValueChange={setImportType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keywords">Keywords</SelectItem>
                    <SelectItem value="performance">Performance / Analytics</SelectItem>
                    <SelectItem value="competitors">Competitors</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="importData">CSV Data</Label>
                  <Button variant="link" size="sm" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 mr-1" />
                    Download Template
                  </Button>
                </div>
                <Textarea
                  id="importData"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Export your data from Ahrefs, Google Analytics, or Search Console as CSV and paste it here
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleImport} disabled={importing || !importData.trim()}>
                  <Upload className="w-4 h-4 mr-2" />
                  {importing ? 'Importing...' : 'Import Data'}
                </Button>
                <Button variant="outline" onClick={() => setImportData('')}>
                  Clear
                </Button>
              </div>

              {importResult && (
                <div className={`p-4 rounded-lg ${importResult.errors && importResult.errors.length > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-start gap-3">
                    {importResult.errors && importResult.errors.length > 0 ? (
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">
                        Import {importResult.errors && importResult.errors.length > 0 ? 'Partially ' : ''}Complete
                      </h4>
                      <p className="text-sm text-gray-700">
                        Successfully imported {importResult.imported} records
                      </p>
                      {importResult.errors && importResult.errors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Errors ({importResult.errors.length}):</p>
                          <ul className="mt-1 text-xs text-gray-600 space-y-1">
                            {importResult.errors.slice(0, 5).map((err, i) => (
                              <li key={i}>• {err}</li>
                            ))}
                            {importResult.errors.length > 5 && (
                              <li className="text-gray-500">... and {importResult.errors.length - 5} more</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">INSTRUCTIONS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">1. Choose Data Type</h4>
                <p className="text-gray-600">Select the type of data you want to import</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">2. Download Template</h4>
                <p className="text-gray-600">Click "Download Template" to get a CSV template with the correct format</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">3. Prepare Your Data</h4>
                <p className="text-gray-600">Fill in the template with your data or export from Ahrefs/Google</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">4. Paste & Import</h4>
                <p className="text-gray-600">Copy the CSV content and paste it in the text area, then click Import</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">DATA SOURCES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Ahrefs</h4>
                <p className="text-gray-600">Export organic keywords, competitors, or backlinks from Site Explorer</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Google Analytics</h4>
                <p className="text-gray-600">Export organic traffic data and conversion metrics</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Search Console</h4>
                <p className="text-gray-600">Export impressions, clicks, CTR, and position data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
