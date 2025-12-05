
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, MapPin, Send } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { EmailJourneyViewer } from '@/components/admin/email-journey-viewer'
import { Separator } from '@/components/ui/separator'

interface Registration {
  id: string
  programType: string
  programName: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  age: number
  status: string
  paymentStatus: string
  createdAt: string
  customerJourneys?: any[]
}

interface JourneyTemplate {
  id: string
  name: string
  description?: string
  totalSteps: number
  category?: string
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([])
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [programFilter, setProgramFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  
  // Journey assignment
  const [showJourneyDialog, setShowJourneyDialog] = useState(false)
  const [journeyTemplates, setJourneyTemplates] = useState<JourneyTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [journeyNotes, setJourneyNotes] = useState('')
  const [assigningJourney, setAssigningJourney] = useState(false)

  useEffect(() => {
    fetchRegistrations()
    fetchJourneyTemplates()
  }, [])

  useEffect(() => {
    filterRegistrations()
  }, [registrations, searchTerm, statusFilter, programFilter])

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('/api/admin/registrations')
      const data = await response.json()
      setRegistrations(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching registrations:', error)
      setLoading(false)
    }
  }

  const fetchJourneyTemplates = async () => {
    try {
      const response = await fetch('/api/admin/user-journey/templates')
      const data = await response.json()
      setJourneyTemplates(data.templates || [])
    } catch (error) {
      console.error('Error fetching journey templates:', error)
    }
  }

  const handleAssignJourney = (registration: Registration) => {
    setSelectedRegistration(registration)
    setSelectedTemplate('')
    setJourneyNotes('')
    setShowJourneyDialog(true)
  }

  const submitJourneyAssignment = async () => {
    if (!selectedTemplate || !selectedRegistration) {
      toast.error('Please select a journey template')
      return
    }

    setAssigningJourney(true)
    try {
      const response = await fetch('/api/admin/user-journey/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: selectedRegistration.id,
          templateId: selectedTemplate,
          notes: journeyNotes
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Journey assigned successfully!')
        setShowJourneyDialog(false)
        fetchRegistrations()
      } else {
        toast.error(data.error || 'Failed to assign journey')
      }
    } catch (error) {
      console.error('Error assigning journey:', error)
      toast.error('Failed to assign journey')
    } finally {
      setAssigningJourney(false)
    }
  }

  const filterRegistrations = () => {
    let filtered = [...registrations]

    if (searchTerm) {
      filtered = filtered.filter(reg =>
        reg.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(reg => reg.status === statusFilter)
    }

    if (programFilter !== 'all') {
      filtered = filtered.filter(reg => reg.programType === programFilter)
    }

    setFilteredRegistrations(filtered)
  }

  const updateRegistrationStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      fetchRegistrations()
    } catch (error) {
      console.error('Error updating registration:', error)
    }
  }

  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      toast.error('No registrations to export')
      return
    }

    // Define CSV headers
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Age',
      'Program Type',
      'Program Name',
      'Status',
      'Payment Status',
      'Registration Date'
    ]

    // Convert data to CSV rows
    const csvRows = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.firstName,
        reg.lastName,
        reg.email,
        reg.phone || '',
        reg.age,
        reg.programType,
        reg.programName,
        reg.status,
        reg.paymentStatus,
        new Date(reg.createdAt).toLocaleDateString()
      ].map(field => `"${field}"`).join(','))
    ]

    // Create CSV blob and download
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `registrations_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success(`Exported ${filteredRegistrations.length} registrations`)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      waitlist: 'outline',
      cancelled: 'destructive'
    }
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const colors: Record<string, string> = {
      paid: 'bg-green-100 text-green-800',
      unpaid: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-gray-100 text-gray-800'
    }
    return (
      <Badge className={colors[status] || ''}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Program Registrations</h1>
          <p className="text-gray-600 mt-1">Manage all program sign-ups and enrollments</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="waitlist">Waitlist</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Programs</SelectItem>
                <SelectItem value="hs-fall-workouts">HS Fall Workouts</SelectItem>
                <SelectItem value="hs-winter-workouts">HS Winter Workouts</SelectItem>
                <SelectItem value="hs-spring-circuit">HS Spring Circuit</SelectItem>
                <SelectItem value="ms-winter-workouts">MS Winter Workouts</SelectItem>
                <SelectItem value="ms-spring-circuit">MS Spring Circuit</SelectItem>
                <SelectItem value="summer-camp">Summer Camp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No registrations found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((registration) => (
                  <TableRow key={registration.id}>
                    <TableCell className="font-medium">
                      {registration.firstName} {registration.lastName}
                    </TableCell>
                    <TableCell>{registration.email}</TableCell>
                    <TableCell>{registration.programName}</TableCell>
                    <TableCell>{registration.age}</TableCell>
                    <TableCell>{getStatusBadge(registration.status)}</TableCell>
                    <TableCell>{getPaymentBadge(registration.paymentStatus)}</TableCell>
                    <TableCell>{new Date(registration.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRegistration(registration)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {registration.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateRegistrationStatus(registration.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateRegistrationStatus(registration.id, 'cancelled')}
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </>
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

      <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details & Email Journey</DialogTitle>
          </DialogHeader>
          {selectedRegistration && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="mt-1">{selectedRegistration.firstName} {selectedRegistration.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1">{selectedRegistration.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Age</label>
                    <p className="mt-1">{selectedRegistration.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Program</label>
                    <p className="mt-1">{selectedRegistration.programName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedRegistration.status)}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold mb-3">Email Journey Progress</h3>
                {selectedRegistration.customerJourneys && selectedRegistration.customerJourneys.length > 0 ? (
                  <EmailJourneyViewer 
                    journey={selectedRegistration.customerJourneys[0]} 
                    onRefresh={fetchRegistrations}
                  />
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <Send className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">No email journey assigned yet</p>
                    <p className="text-xs text-gray-400 mt-1">Assign an email journey template to start sending automated emails</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
