
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, XCircle, Clock, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface ContentVersion {
  id: string
  pageConfig: {
    pagePath: string
    pageName: string
    pageTitle: string
  }
  title: string
  metaDescription: string
  h1Heading: string
  contentBlocks: any
  status: string
  versionNumber: number
  seoScore: number
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  isPublished: boolean
  publishedAt?: string
}

export default function ContentReview() {
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null)

  useEffect(() => {
    fetchVersions()
  }, [])

  const fetchVersions = async () => {
    try {
      const response = await fetch('/api/seo/content-versions')
      if (response.ok) {
        const data = await response.json()
        setVersions(data)
      }
    } catch (error) {
      console.error('Error fetching content versions:', error)
      toast.error('Failed to load content versions')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (versionId: string) => {
    try {
      const response = await fetch('/api/seo/content-versions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId,
          action: 'approve'
        })
      })

      if (response.ok) {
        toast.success('Content approved and published!')
        fetchVersions()
        setSelectedVersion(null)
      } else {
        toast.error('Failed to approve content')
      }
    } catch (error) {
      console.error('Error approving content:', error)
      toast.error('Failed to approve content')
    }
  }

  const handleReject = async (versionId: string) => {
    if (!confirm('Are you sure you want to reject this content?')) return

    try {
      const response = await fetch('/api/seo/content-versions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId,
          action: 'reject'
        })
      })

      if (response.ok) {
        toast.success('Content rejected')
        fetchVersions()
        setSelectedVersion(null)
      } else {
        toast.error('Failed to reject content')
      }
    } catch (error) {
      console.error('Error rejecting content:', error)
      toast.error('Failed to reject content')
    }
  }

  const pendingVersions = versions.filter(v => v.status === 'pending_review')
  const approvedVersions = versions.filter(v => v.status === 'approved' || v.status === 'published')
  const rejectedVersions = versions.filter(v => v.status === 'rejected')

  const renderVersionCard = (version: ContentVersion, showActions = false) => (
    <Card key={version.id} className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{version.pageConfig.pageName || version.pageConfig.pageTitle}</CardTitle>
            <CardDescription>{version.pageConfig.pagePath} • Version {version.versionNumber}</CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            {version.isPublished && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Published
              </Badge>
            )}
            <Badge
              variant={
                version.status === 'approved' ? 'default' :
                version.status === 'rejected' ? 'destructive' : 'secondary'
              }
            >
              {version.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm font-medium text-gray-600">SEO Score:</p>
            <p className="text-lg font-bold text-green-600">{version.seoScore}/100</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Version:</p>
            <p className="text-lg font-bold">#{version.versionNumber}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Generated Title:</p>
          <p className="text-sm mt-1">{version.title}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Meta Description:</p>
          <p className="text-sm mt-1 line-clamp-2">{version.metaDescription}</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span>🕒 Created: {format(new Date(version.createdAt), 'MMM d, yyyy h:mm a')}</span>
          {version.publishedAt && (
            <span>✅ Published: {format(new Date(version.publishedAt), 'MMM d, yyyy')}</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedVersion(version)}
          >
            <Eye className="mr-1 h-4 w-4" />
            View Full Content
          </Button>
          {showActions && (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={() => handleApprove(version.id)}
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(version.id)}
              >
                <XCircle className="mr-1 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Review</h1>
        <p className="text-gray-500 mt-1">Review and approve AI-generated SEO content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingVersions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedVersions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Rejected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{rejectedVersions.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingVersions.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedVersions.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedVersions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : pendingVersions.length > 0 ? (
            pendingVersions.map(v => renderVersionCard(v, true))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No pending content to review
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedVersions.length > 0 ? (
            approvedVersions.map(v => renderVersionCard(v, false))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No approved content yet
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedVersions.length > 0 ? (
            rejectedVersions.map(v => renderVersionCard(v, false))
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No rejected content
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Full Content Modal */}
      {selectedVersion && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVersion(null)}
        >
          <Card
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <CardTitle>{selectedVersion.pageConfig.pageTitle}</CardTitle>
              <CardDescription>{selectedVersion.pageConfig.pagePath}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-600">SEO Score:</h4>
                  <p className="text-2xl font-bold text-green-600">{selectedVersion.seoScore}/100</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-600">Version:</h4>
                  <p className="text-2xl font-bold">#{selectedVersion.versionNumber}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Page Title:</h4>
                <p className="p-3 bg-gray-50 rounded">{selectedVersion.title}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Meta Description:</h4>
                <p className="p-3 bg-gray-50 rounded">{selectedVersion.metaDescription}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">H1 Heading:</h4>
                <p className="p-3 bg-gray-50 rounded">{selectedVersion.h1Heading}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Content Blocks:</h4>
                <div className="p-4 bg-gray-50 rounded space-y-3 max-h-96 overflow-y-auto">
                  {selectedVersion.contentBlocks && 
                    JSON.parse(JSON.stringify(selectedVersion.contentBlocks)).map((block: any, idx: number) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-semibold text-sm text-gray-700 mb-1">{block.type}</h5>
                        <p className="text-sm text-gray-600">{block.content}</p>
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedVersion(null)}>
                  Close
                </Button>
                {selectedVersion.status === 'pending' && (
                  <>
                    <Button onClick={() => handleApprove(selectedVersion.id)}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="destructive" onClick={() => handleReject(selectedVersion.id)}>
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
