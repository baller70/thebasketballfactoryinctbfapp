
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Clock, CheckCircle, Send, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface EmailJourneyViewerProps {
  journey: any
  onRefresh: () => void
}

export function EmailJourneyViewer({ journey, onRefresh }: EmailJourneyViewerProps) {
  const [sendingEmail, setSendingEmail] = useState(false)
  const [previewStep, setPreviewStep] = useState<any>(null)

  if (!journey) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 text-center">No email journey assigned yet</p>
        </CardContent>
      </Card>
    )
  }

  const handleSendEmail = async (stepId: string) => {
    setSendingEmail(true)
    try {
      const response = await fetch(`/api/admin/journey-templates/${journey.templateId}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journeyId: journey.id,
          stepId
        })
      })

      if (response.ok) {
        toast.success('Email sent successfully!')
        onRefresh()
      } else {
        toast.error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error('Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  const getStepStatus = (step: any) => {
    const progress = journey.progress?.find((p: any) => p.stepNumber === step.stepNumber)
    
    if (progress?.emailSent) {
      return { label: 'Sent', variant: 'default' as const, icon: CheckCircle }
    }
    
    if (progress?.scheduledSendDate) {
      const scheduledDate = new Date(progress.scheduledSendDate)
      if (scheduledDate <= new Date()) {
        return { label: 'Ready to Send', variant: 'secondary' as const, icon: Mail }
      }
      return { label: `Scheduled ${scheduledDate.toLocaleDateString()}`, variant: 'outline' as const, icon: Clock }
    }
    
    return { label: 'Pending', variant: 'outline' as const, icon: AlertCircle }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Email Journey: {journey.template?.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{journey.template?.description}</p>
        </div>
        <Badge variant="secondary">
          {journey.template?.steps?.length || 0} emails
        </Badge>
      </div>

      <div className="space-y-2">
        {journey.template?.steps?.map((step: any) => {
          const status = getStepStatus(step)
          const progress = journey.progress?.find((p: any) => p.stepNumber === step.stepNumber)
          const StatusIcon = status.icon

          return (
            <Card key={step.id} className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">{step.title}</span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    
                    {step.emailSubject && (
                      <p className="text-xs text-gray-600 mt-1">
                        <Mail className="h-3 w-3 inline mr-1" />
                        {step.emailSubject}
                      </p>
                    )}
                    
                    {progress?.emailSentAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Sent on {new Date(progress.emailSentAt).toLocaleString()}
                      </p>
                    )}
                    
                    {step.delayDays > 0 && !progress?.emailSent && (
                      <p className="text-xs text-gray-500 mt-1">
                        Sends {step.delayDays} days after previous email
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {step.emailSubject && step.emailBody && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewStep(step)}
                      >
                        Preview
                      </Button>
                    )}
                    
                    {!progress?.emailSent && step.emailSubject && step.emailBody && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSendEmail(step.id)}
                        disabled={sendingEmail}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send Now
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Email Preview Dialog */}
      <Dialog open={!!previewStep} onOpenChange={() => setPreviewStep(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Preview: {previewStep?.title}</DialogTitle>
            <DialogDescription>Subject: {previewStep?.emailSubject}</DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg p-4 bg-white max-h-[60vh] overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: previewStep?.emailBody || '' }} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewStep(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
