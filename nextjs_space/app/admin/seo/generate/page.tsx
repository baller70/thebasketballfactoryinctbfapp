
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PageConfig {
  id: string
  pagePath: string
  pageTitle: string
  pageName: string
  targetKeywords: Array<{ id: string; keyword: string }>
}

export default function GenerateContent() {
  const [pages, setPages] = useState<PageConfig[]>([])
  const [selectedPage, setSelectedPage] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/seo/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data.filter((p: PageConfig) => p))
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    }
  }

  const handleGenerate = async () => {
    if (!selectedPage) {
      toast.error('Please select a page')
      return
    }

    setGenerating(true)
    setError('')
    setGeneratedContent(null)

    try {
      const response = await fetch('/api/seo/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageConfigId: selectedPage,
          additionalContext: additionalContext || undefined
        })
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedContent(data)
        toast.success('Content generated successfully!')
      } else {
        setError(data.error || 'Failed to generate content')
        toast.error('Failed to generate content')
      }
    } catch (error) {
      console.error('Error generating content:', error)
      setError('An error occurred while generating content')
      toast.error('Failed to generate content')
    } finally {
      setGenerating(false)
    }
  }

  const selectedPageData = pages.find(p => p.id === selectedPage)

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Generate SEO Content</h1>
        <p className="text-gray-500 mt-1">
          Use AI to generate optimized content for your pages
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
          <CardDescription>
            Select a page and generate SEO-optimized content using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="page">Select Page</Label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger id="page">
                <SelectValue placeholder="Choose a page to optimize" />
              </SelectTrigger>
              <SelectContent>
                {pages.map(page => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.pageTitle} ({page.pagePath})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedPageData && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Target Keywords:</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedPageData.targetKeywords.length > 0 ? (
                  selectedPageData.targetKeywords.map((tk, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tk.keyword}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No keywords assigned yet</span>
                )}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Add any specific requirements, tone, or details you want to include in the content..."
              rows={4}
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide additional information to help generate more relevant content
            </p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !selectedPage}
            className="w-full"
            size="lg"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Generate SEO Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedContent && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-900">Content Generated Successfully!</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Version ID: {generatedContent.contentVersion?.id || 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500 mb-1">SEO Score:</h4>
                <p className="text-2xl font-bold text-green-600">{generatedContent.seoScore}/100</p>
              </div>
              {generatedContent.requiresApproval && (
                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-1">Status:</h4>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Pending Review
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-2">Meta Title:</h4>
              <p className="p-3 bg-white rounded border">{generatedContent.contentVersion?.title}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Meta Description:</h4>
              <p className="p-3 bg-white rounded border">{generatedContent.contentVersion?.metaDescription}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">H1 Heading:</h4>
              <p className="p-3 bg-white rounded border">{generatedContent.contentVersion?.h1Heading}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Content Blocks:</h4>
              <div className="p-4 bg-white rounded border max-h-96 overflow-y-auto space-y-3">
                {generatedContent.contentVersion?.contentBlocks && 
                  JSON.parse(JSON.stringify(generatedContent.contentVersion.contentBlocks)).map((block: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-semibold text-sm text-gray-700 mb-1">{block.type}</h5>
                      <p className="text-sm text-gray-600">{block.content}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  toast.success('Redirecting to content review...')
                  window.location.href = '/admin/seo/content-review'
                }}
              >
                Review & Approve
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedContent(null)
                  setSelectedPage('')
                  setAdditionalContext('')
                }}
              >
                Generate Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
