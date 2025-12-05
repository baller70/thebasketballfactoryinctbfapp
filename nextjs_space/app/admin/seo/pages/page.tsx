
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, RefreshCw, FileText, Target, TrendingUp, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface PageConfig {
  id: string
  pagePath: string
  pageTitle: string
  metaDescription?: string
  targetKeywords: Array<{ keyword: { id: string; keyword: string } }>
  contentSections?: any
  autoUpdate: boolean
  updateFrequency?: string
  status: string // "active", "paused", "archived"
  lastGenerated?: string
  _count?: {
    contentVersions: number
  }
}

interface Keyword {
  id: string
  keyword: string
  category?: string
}

export default function PagesManagement() {
  const [pages, setPages] = useState<PageConfig[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<PageConfig | null>(null)
  const [selectedPrimaryKeyword, setSelectedPrimaryKeyword] = useState<string>('')
  const [selectedSecondaryKeywords, setSelectedSecondaryKeywords] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [formData, setFormData] = useState({
    pagePath: '',
    pageTitle: '',
    metaDescription: '',
    autoUpdate: true,
    updateFrequency: 'weekly'
  })

  useEffect(() => {
    fetchPages()
    fetchKeywords()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/seo/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast.error('Failed to load pages')
    } finally {
      setLoading(false)
    }
  }

  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/seo/keywords')
      if (response.ok) {
        const data = await response.json()
        setKeywords(data.filter((k: Keyword) => k))
      }
    } catch (error) {
      console.error('Error fetching keywords:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPrimaryKeyword) {
      toast.error('Please select a primary keyword (Google SEO best practice: 1 primary keyword per page)')
      return
    }

    try {
      const method = editingPage ? 'PUT' : 'POST'
      const allKeywords = [selectedPrimaryKeyword, ...selectedSecondaryKeywords]
      const body = editingPage 
        ? { id: editingPage.id, ...formData, keywordIds: allKeywords }
        : { ...formData, keywordIds: allKeywords }

      const response = await fetch('/api/seo/pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast.success(editingPage ? 'Page updated' : 'Page added')
        setDialogOpen(false)
        resetForm()
        fetchPages()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Operation failed')
      }
    } catch (error) {
      console.error('Error saving page:', error)
      toast.error('Failed to save page')
    }
  }

  const resetForm = () => {
    setEditingPage(null)
    setSelectedPrimaryKeyword('')
    setSelectedSecondaryKeywords([])
    setFormData({
      pagePath: '',
      pageTitle: '',
      metaDescription: '',
      autoUpdate: true,
      updateFrequency: 'weekly'
    })
  }

  const handleEdit = (page: PageConfig) => {
    setEditingPage(page)
    setFormData({
      pagePath: page.pagePath,
      pageTitle: page.pageTitle,
      metaDescription: page.metaDescription || '',
      autoUpdate: page.autoUpdate,
      updateFrequency: page.updateFrequency || 'weekly'
    })
    // First keyword is primary, rest are secondary
    const keywordIds = page.targetKeywords.map(tk => tk.keyword.id)
    setSelectedPrimaryKeyword(keywordIds[0] || '')
    setSelectedSecondaryKeywords(keywordIds.slice(1))
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page configuration?')) return

    try {
      const response = await fetch(`/api/seo/pages?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Page deleted')
        fetchPages()
      } else {
        toast.error('Failed to delete page')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      toast.error('Failed to delete page')
    }
  }

  const toggleActive = async (page: PageConfig) => {
    try {
      const isCurrentlyActive = page.status === 'active'
      const response = await fetch('/api/seo/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: page.id,
          isActive: !isCurrentlyActive
        })
      })

      if (response.ok) {
        toast.success(`Page ${!isCurrentlyActive ? 'activated' : 'deactivated'}`)
        fetchPages()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update page')
      }
    } catch (error) {
      console.error('Error toggling page:', error)
      toast.error('Failed to update page')
    }
  }

  const regenerateContent = async (pageConfigId: string) => {
    try {
      const loadingToast = toast.loading('Generating content...')
      const response = await fetch('/api/seo/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageConfigId })
      })

      toast.dismiss(loadingToast)
      
      if (response.ok) {
        toast.success('Content generated successfully')
        fetchPages()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content')
    }
  }

  const filteredPages = pages.filter(p =>
    p.pagePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pageTitle.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleSecondaryKeyword = (keywordId: string) => {
    setSelectedSecondaryKeywords(prev =>
      prev.includes(keywordId)
        ? prev.filter(id => id !== keywordId)
        : prev.length < 5 // Google best practice: max 3-5 secondary keywords
          ? [...prev, keywordId]
          : (toast.error('Maximum 5 secondary keywords allowed'), prev)
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pages Management</h1>
          <p className="text-gray-500 mt-1">Configure SEO optimization for your website pages</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPage ? 'Edit' : 'Add'} Page Configuration</DialogTitle>
              <DialogDescription>
                Configure SEO settings for a website page
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pagePath">Page Path *</Label>
                <Input
                  id="pagePath"
                  value={formData.pagePath}
                  onChange={(e) => setFormData({ ...formData, pagePath: e.target.value })}
                  placeholder="/programs/summer-camp"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">The URL path of the page (e.g., /about, /contact)</p>
              </div>

              <div>
                <Label htmlFor="pageTitle">Page Title *</Label>
                <Input
                  id="pageTitle"
                  value={formData.pageTitle}
                  onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })}
                  placeholder="Summer Basketball Camp - Sparta NJ"
                  required
                />
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Join our elite summer basketball camp in Sparta, NJ..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>

              {/* PRIMARY KEYWORD - Google Best Practice: 1 per page */}
              <div className="border border-amber-300 bg-amber-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-amber-600" />
                  <Label className="text-amber-900 font-bold">Primary Keyword * (Required)</Label>
                </div>
                <p className="text-xs text-amber-700 mb-3">
                  📌 Google SEO Rule: Choose ONE primary keyword per page to avoid keyword cannibalization
                </p>
                <Select 
                  value={selectedPrimaryKeyword} 
                  onValueChange={setSelectedPrimaryKeyword}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary keyword..." />
                  </SelectTrigger>
                  <SelectContent>
                    {keywords.map(keyword => (
                      <SelectItem key={keyword.id} value={keyword.id}>
                        {keyword.keyword}
                        {keyword.category && ` (${keyword.category})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* SECONDARY KEYWORDS - Google Best Practice: 3-5 per page */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <Label className="text-blue-900 font-bold">Secondary Keywords (Optional, Max 5)</Label>
                </div>
                <p className="text-xs text-blue-700 mb-3">
                  💡 Google Best Practice: Add 3-5 related keywords to support your primary keyword
                </p>
                <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
                  {keywords.filter(k => k.id !== selectedPrimaryKeyword).map(keyword => (
                    <div key={keyword.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSecondaryKeywords.includes(keyword.id)}
                        onChange={() => toggleSecondaryKeyword(keyword.id)}
                        className="rounded"
                        disabled={!selectedSecondaryKeywords.includes(keyword.id) && selectedSecondaryKeywords.length >= 5}
                      />
                      <span className="text-sm">{keyword.keyword}</span>
                      {keyword.category && (
                        <Badge variant="secondary" className="text-xs">{keyword.category}</Badge>
                      )}
                    </div>
                  ))}
                  {keywords.length === 0 && (
                    <p className="text-sm text-gray-500">No keywords available. Add keywords first.</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {selectedSecondaryKeywords.length}/5 secondary keywords
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoUpdate">Auto-Update Content</Label>
                  <p className="text-xs text-gray-500">Automatically generate fresh content</p>
                </div>
                <Switch
                  id="autoUpdate"
                  checked={formData.autoUpdate}
                  onCheckedChange={(checked) => setFormData({ ...formData, autoUpdate: checked })}
                />
              </div>

              {formData.autoUpdate && (
                <div>
                  <Label htmlFor="updateFrequency">Update Frequency</Label>
                  <Select
                    value={formData.updateFrequency}
                    onValueChange={(value) => setFormData({ ...formData, updateFrequency: value })}
                  >
                    <SelectTrigger>
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
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPage ? 'Update' : 'Add'} Page
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPages.map((page) => (
                <div key={page.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{page.pageTitle}</span>
                        {page.status !== 'active' && (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                        {page.autoUpdate && (
                          <Badge variant="secondary">Auto-Update</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{page.pagePath}</p>
                      {page.metaDescription && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{page.metaDescription}</p>
                      )}
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {page.targetKeywords.map((tk, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tk.keyword.keyword}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        {page.updateFrequency && (
                          <span>📅 Updates: {page.updateFrequency}</span>
                        )}
                        {page._count && (
                          <span>📝 {page._count.contentVersions} versions</span>
                        )}
                        {page.lastGenerated && (
                          <span>🕒 Last: {new Date(page.lastGenerated).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateContent(page.id)}
                        title="Regenerate content"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={page.status === 'active' ? "outline" : "default"}
                        onClick={() => toggleActive(page)}
                      >
                        {page.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPages.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? 'No pages found' : 'No pages configured yet. Add your first page!'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
