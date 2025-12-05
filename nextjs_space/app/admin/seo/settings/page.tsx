
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Save, RefreshCw, Settings as SettingsIcon } from 'lucide-react'
import { toast } from 'sonner'

interface SEOSettings {
  autoGenerateContent: boolean
  defaultUpdateFrequency: string
  requireApproval: boolean
  maxContentLength: number
  contentTone: string
  localSEOFocus: boolean
  targetAudience: string
  businessDescription: string
  primaryLocation: string
  serviceArea: string
  brandVoice: string
  competitorUrls: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SEOSettings>({
    autoGenerateContent: true,
    defaultUpdateFrequency: 'weekly',
    requireApproval: true,
    maxContentLength: 2000,
    contentTone: 'professional',
    localSEOFocus: true,
    targetAudience: 'Parents and children aged 7-18',
    businessDescription: 'Basketball training and skill development programs',
    primaryLocation: 'Sparta, New Jersey',
    serviceArea: 'Sparta, Andover, Newton, Hopatcong, Sussex County, NJ',
    brandVoice: 'encouraging, professional, youth-focused',
    competitorUrls: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/seo/settings')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setSettings(data)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/seo/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Settings saved successfully!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">SEO System Settings</h1>
        <p className="text-gray-500 mt-1">Configure global SEO optimization settings</p>
      </div>

      {/* Content Generation Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
          <CardDescription>Configure how AI generates SEO content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoGenerate">Auto-Generate Content</Label>
              <p className="text-sm text-gray-500">Automatically generate content for active pages</p>
            </div>
            <Switch
              id="autoGenerate"
              checked={settings.autoGenerateContent}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, autoGenerateContent: checked })
              }
            />
          </div>

          <div>
            <Label htmlFor="updateFrequency">Default Update Frequency</Label>
            <Select
              value={settings.defaultUpdateFrequency}
              onValueChange={(value) =>
                setSettings({ ...settings, defaultUpdateFrequency: value })
              }
            >
              <SelectTrigger id="updateFrequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="requireApproval">Require Manual Approval</Label>
              <p className="text-sm text-gray-500">Review content before publishing</p>
            </div>
            <Switch
              id="requireApproval"
              checked={settings.requireApproval}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, requireApproval: checked })
              }
            />
          </div>

          <div>
            <Label htmlFor="maxLength">Maximum Content Length (words)</Label>
            <Input
              id="maxLength"
              type="number"
              value={settings.maxContentLength}
              onChange={(e) =>
                setSettings({ ...settings, maxContentLength: parseInt(e.target.value) })
              }
              min="500"
              max="5000"
            />
          </div>

          <div>
            <Label htmlFor="contentTone">Content Tone</Label>
            <Select
              value={settings.contentTone}
              onValueChange={(value) =>
                setSettings({ ...settings, contentTone: value })
              }
            >
              <SelectTrigger id="contentTone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="authoritative">Authoritative</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Local SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Local SEO Configuration</CardTitle>
          <CardDescription>Optimize for local search results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="localSEO">Enable Local SEO Focus</Label>
              <p className="text-sm text-gray-500">Prioritize local keywords and locations</p>
            </div>
            <Switch
              id="localSEO"
              checked={settings.localSEOFocus}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, localSEOFocus: checked })
              }
            />
          </div>

          <div>
            <Label htmlFor="primaryLocation">Primary Location</Label>
            <Input
              id="primaryLocation"
              value={settings.primaryLocation}
              onChange={(e) =>
                setSettings({ ...settings, primaryLocation: e.target.value })
              }
              placeholder="Sparta, New Jersey"
            />
          </div>

          <div>
            <Label htmlFor="serviceArea">Service Area</Label>
            <Input
              id="serviceArea"
              value={settings.serviceArea}
              onChange={(e) =>
                setSettings({ ...settings, serviceArea: e.target.value })
              }
              placeholder="Sparta, Andover, Newton, Sussex County"
            />
            <p className="text-xs text-gray-500 mt-1">Comma-separated list of locations you serve</p>
          </div>
        </CardContent>
      </Card>

      {/* Business Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
          <CardDescription>Information about your business for content generation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="targetAudience">Target Audience</Label>
            <Input
              id="targetAudience"
              value={settings.targetAudience}
              onChange={(e) =>
                setSettings({ ...settings, targetAudience: e.target.value })
              }
              placeholder="Parents and children aged 7-18"
            />
          </div>

          <div>
            <Label htmlFor="businessDescription">Business Description</Label>
            <Textarea
              id="businessDescription"
              value={settings.businessDescription}
              onChange={(e) =>
                setSettings({ ...settings, businessDescription: e.target.value })
              }
              placeholder="Brief description of your business..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="brandVoice">Brand Voice</Label>
            <Input
              id="brandVoice"
              value={settings.brandVoice}
              onChange={(e) =>
                setSettings({ ...settings, brandVoice: e.target.value })
              }
              placeholder="encouraging, professional, youth-focused"
            />
            <p className="text-xs text-gray-500 mt-1">Describe your brand's communication style</p>
          </div>

          <div>
            <Label htmlFor="competitorUrls">Competitor Websites (Optional)</Label>
            <Textarea
              id="competitorUrls"
              value={settings.competitorUrls}
              onChange={(e) =>
                setSettings({ ...settings, competitorUrls: e.target.value })
              }
              placeholder="https://competitor1.com&#10;https://competitor2.com"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">One URL per line (for competitive analysis)</p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
        <Button variant="outline" onClick={fetchSettings} size="lg">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  )
}
