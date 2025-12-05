
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Edit2, Trash2, MapPin, Users, Target, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface JourneyStep {
  id?: string
  stepNumber: number
  title: string
  description?: string
  emailSubject?: string
  emailBody?: string
  delayDays: number
}

interface JourneyTemplate {
  id: string
  name: string
  description?: string
  isDefault: boolean
  totalSteps: number
  category?: string
  isActive: boolean
  createdAt: string
  steps: JourneyStep[]
}

export default function UserJourneyPage() {
  const [templates, setTemplates] = useState<JourneyTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<JourneyTemplate | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Registration',
    totalSteps: 5
  })
  const [steps, setSteps] = useState<JourneyStep[]>([])

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/admin/user-journey/templates')
      const data = await response.json()
      setTemplates(data.templates || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load journey templates')
      setLoading(false)
    }
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setFormData({
      name: '',
      description: '',
      category: 'Registration',
      totalSteps: 5
    })
    // Initialize steps
    const initialSteps: JourneyStep[] = []
    for (let i = 1; i <= 5; i++) {
      initialSteps.push({
        stepNumber: i,
        title: `Email ${i}`,
        description: '',
        emailSubject: '',
        emailBody: '',
        delayDays: i === 1 ? 0 : 3
      })
    }
    setSteps(initialSteps)
    setShowCreateDialog(true)
  }

  const handleEditTemplate = (template: JourneyTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      description: template.description || '',
      category: template.category || 'Registration',
      totalSteps: template.totalSteps
    })
    setSteps(template.steps || [])
    setShowCreateDialog(true)
  }

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this journey template?')) return

    try {
      const response = await fetch(`/api/admin/user-journey/templates/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Journey template deleted successfully')
        fetchTemplates()
      } else {
        toast.error('Failed to delete journey template')
      }
    } catch (error) {
      console.error('Error deleting template:', error)
      toast.error('Failed to delete journey template')
    }
  }

  const handleTotalStepsChange = (value: number) => {
    const newTotalSteps = Math.max(1, Math.min(20, value))
    setFormData({ ...formData, totalSteps: newTotalSteps })
    
    // Adjust steps array
    const currentSteps = [...steps]
    if (newTotalSteps > currentSteps.length) {
      // Add new steps
      for (let i = currentSteps.length + 1; i <= newTotalSteps; i++) {
        currentSteps.push({
          stepNumber: i,
          title: `Email ${i}`,
          description: '',
          emailSubject: '',
          emailBody: '',
          delayDays: 3
        })
      }
    } else if (newTotalSteps < currentSteps.length) {
      // Remove extra steps
      currentSteps.splice(newTotalSteps)
    }
    setSteps(currentSteps)
  }

  const updateStep = (index: number, field: keyof JourneyStep, value: any) => {
    const updatedSteps = [...steps]
    updatedSteps[index] = { ...updatedSteps[index], [field]: value }
    setSteps(updatedSteps)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      ...formData,
      steps: steps.map((step, idx) => ({
        ...step,
        stepNumber: idx + 1
      }))
    }

    try {
      const url = editingTemplate 
        ? `/api/admin/user-journey/templates/${editingTemplate.id}` 
        : '/api/admin/user-journey/templates'
      
      const response = await fetch(url, {
        method: editingTemplate ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(editingTemplate ? 'Journey template updated!' : 'Journey template created!')
        setShowCreateDialog(false)
        fetchTemplates()
      } else {
        toast.error('Failed to save journey template')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save journey template')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Journey Management</h1>
          <p className="text-gray-600 mt-1">Create automated email sequences to keep customers informed throughout their journey</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Email Journey
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Total Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Default Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.isDefault).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Custom Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => !t.isDefault).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Journeys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Email Journey Templates</CardTitle>
          <CardDescription>Pre-built and custom email sequences for customer communication</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading templates...</div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No journey templates yet. Create your first one!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Steps</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">{template.name}</TableCell>
                    <TableCell>{template.category || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{template.totalSteps} steps</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.isDefault ? 'default' : 'outline'}>
                        {template.isDefault ? 'Default' : 'Custom'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={template.isActive ? 'default' : 'secondary'}>
                        {template.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(template.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        {!template.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Email Journey Template' : 'Create Email Journey Template'}
            </DialogTitle>
            <DialogDescription>
              Design an automated email sequence to keep customers informed throughout their journey
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., New Registration Onboarding"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Registration">Registration</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                    <SelectItem value="Assessment">Assessment</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this journey..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSteps">Number of Steps (1-20)</Label>
              <Input
                id="totalSteps"
                type="number"
                min={1}
                max={20}
                value={formData.totalSteps}
                onChange={(e) => handleTotalStepsChange(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Journey Steps</Label>
                <span className="text-sm text-gray-500">{steps.length} total steps</span>
              </div>

              {steps.map((step, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Email {step.stepNumber}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs">Email Name/Title *</Label>
                      <Input
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                        placeholder="e.g., Welcome Email"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Internal Description</Label>
                      <Textarea
                        value={step.description || ''}
                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                        placeholder="Internal notes about this email..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Email Subject Line *</Label>
                      <Input
                        value={step.emailSubject || ''}
                        onChange={(e) => updateStep(index, 'emailSubject', e.target.value)}
                        placeholder="e.g., Welcome to Rise As One AAU!"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Email Body (HTML) *</Label>
                      <Textarea
                        value={step.emailBody || ''}
                        onChange={(e) => updateStep(index, 'emailBody', e.target.value)}
                        placeholder="<p>Welcome! We're excited to have you join...</p>"
                        rows={6}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use HTML for formatting. Will be wrapped in professional email template.
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs">Delay (Days after previous email)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={step.delayDays}
                        onChange={(e) => updateStep(index, 'delayDays', parseInt(e.target.value) || 0)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {index === 0 ? 'First email sends immediately (0 days)' : `Sends ${step.delayDays} days after previous email`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
