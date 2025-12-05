
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

interface Popup {
  id: string
  name: string
  title: string
  description?: string
  content: string
  trigger: string
  delay?: number
  scrollPercent?: number
  target?: string
  isActive: boolean
  priority: number
  showOnce: boolean
  impressions: number
  conversions: number
  createdAt: string
}

export default function PopupsPage() {
  const [popups, setPopups] = useState<Popup[]>([])
  const [selectedPopup, setSelectedPopup] = useState<Popup | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPopups()
  }, [])

  const fetchPopups = async () => {
    try {
      const response = await fetch('/api/admin/popups')
      const data = await response.json()
      setPopups(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching popups:', error)
      setLoading(false)
    }
  }

  const togglePopup = async (id: string, isActive: boolean) => {
    try {
      await fetch('/api/admin/popups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive })
      })
      fetchPopups()
    } catch (error) {
      console.error('Error toggling popup:', error)
    }
  }

  const deletePopup = async (id: string) => {
    if (confirm('Are you sure you want to delete this popup?')) {
      try {
        await fetch(`/api/admin/popups?id=${id}`, { method: 'DELETE' })
        fetchPopups()
      } catch (error) {
        console.error('Error deleting popup:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Popup Manager</h1>
          <p className="text-gray-600 mt-1">Create and manage website popups</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedPopup(null)}>
              <Plus className="h-4 w-4 mr-2" />
              New Popup
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPopup ? 'Edit' : 'Create'} Popup</DialogTitle>
            </DialogHeader>
            <PopupForm popup={selectedPopup} onClose={() => {
              setIsDialogOpen(false)
              fetchPopups()
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Popups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Popups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{popups.filter(p => p.isActive).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {popups.reduce((sum, p) => sum + p.impressions, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Popups</CardTitle>
          <CardDescription>Manage your website popups and promotions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : popups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No popups created yet</div>
          ) : (
            <div className="space-y-4">
              {popups.map((popup) => (
                <div key={popup.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{popup.name}</h3>
                      <Badge variant={popup.isActive ? 'default' : 'secondary'}>
                        {popup.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{popup.trigger}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{popup.title}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>Impressions: {popup.impressions}</span>
                      <span>Conversions: {popup.conversions}</span>
                      <span>Priority: {popup.priority}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={popup.isActive}
                      onCheckedChange={(checked) => togglePopup(popup.id, checked)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPopup(popup)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePopup(popup.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function PopupForm({ popup, onClose }: { popup: Popup | null, onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: popup?.name || '',
    title: popup?.title || '',
    description: popup?.description || '',
    content: popup?.content || '',
    trigger: popup?.trigger || 'time',
    delay: popup?.delay || 5,
    scrollPercent: popup?.scrollPercent || 50,
    target: popup?.target || '/',
    priority: popup?.priority || 0,
    showOnce: popup?.showOnce || false,
    isActive: popup?.isActive ?? true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = popup ? '/api/admin/popups' : '/api/admin/popups'
      const method = popup ? 'PUT' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(popup ? { ...formData, id: popup.id } : formData)
      })
      onClose()
    } catch (error) {
      console.error('Error saving popup:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Popup Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Summer Camp Promotion"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Early Bird Registration Now Open!"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Description</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Short description"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Full popup content (supports HTML)"
          rows={4}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Trigger Type</label>
          <Select value={formData.trigger} onValueChange={(value) => setFormData({ ...formData, trigger: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">Time-based</SelectItem>
              <SelectItem value="exit">Exit Intent</SelectItem>
              <SelectItem value="scroll">Scroll-based</SelectItem>
              <SelectItem value="click">Click-based</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.trigger === 'time' && (
          <div>
            <label className="text-sm font-medium">Delay (seconds)</label>
            <Input
              type="number"
              value={formData.delay}
              onChange={(e) => setFormData({ ...formData, delay: parseInt(e.target.value) })}
              min="0"
            />
          </div>
        )}
        {formData.trigger === 'scroll' && (
          <div>
            <label className="text-sm font-medium">Scroll Percent</label>
            <Input
              type="number"
              value={formData.scrollPercent}
              onChange={(e) => setFormData({ ...formData, scrollPercent: parseInt(e.target.value) })}
              min="0"
              max="100"
            />
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Priority</label>
          <Input
            type="number"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Target Page (URL pattern)</label>
        <Input
          value={formData.target}
          onChange={(e) => setFormData({ ...formData, target: e.target.value })}
          placeholder="/ for all pages, or specific path"
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.showOnce}
            onCheckedChange={(checked) => setFormData({ ...formData, showOnce: checked })}
          />
          <label className="text-sm">Show once per user</label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <label className="text-sm">Active</label>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save Popup</Button>
      </div>
    </form>
  )
}
