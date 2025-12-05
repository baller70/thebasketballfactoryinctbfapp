
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, User, Mail, Phone, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import toast from 'react-hot-toast'

const trainingDates = [
  { value: '2025-10-05', label: 'October 5th, 2025' },
  { value: '2025-10-12', label: 'October 12th, 2025' },
  { value: '2025-10-19', label: 'October 19th, 2025' },
  { value: '2025-10-26', label: 'October 26th, 2025' },
  { value: '2025-11-02', label: 'November 2nd, 2025' },
  { value: '2025-11-09', label: 'November 9th, 2025' },
  { value: '2025-11-16', label: 'November 16th, 2025' },
]

interface BookingFormProps {
  paymentType: string
  onBack: () => void
}

export default function BookingForm({ paymentType, onBack }: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    athleteName: '',
    athleteAge: '',
    athleteGrade: '',
    selectedDates: [] as string[],
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDateSelection = (date: string) => {
    if (paymentType === 'full') {
      // For "Pay in Full", select all dates
      if (formData.selectedDates.length === trainingDates.length) {
        setFormData(prev => ({ ...prev, selectedDates: [] }))
      } else {
        setFormData(prev => ({ ...prev, selectedDates: trainingDates.map(d => d.value) }))
      }
    } else {
      // For "Pay As You Go", allow individual selection
      setFormData(prev => {
        const dates = prev.selectedDates.includes(date)
          ? prev.selectedDates.filter(d => d !== date)
          : [...prev.selectedDates, date]
        return { ...prev, selectedDates: dates }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.selectedDates.length === 0) {
      toast.error('Please select at least one training date')
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSuccess(true)
      toast.success('Booking submitted successfully! We\'ll contact you within 24 hours.')
    } catch (error) {
      toast.error('Something went wrong. Please try again or call us at (973) 240-8759')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold rounded-lg p-12 text-center"
      >
        <div className="w-20 h-20 bg-tbf-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-tbf-gold" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          Booking <span className="text-tbf-gold">Confirmed!</span>
        </h3>
        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
          Thank you for enrolling in our High School Fall Workouts program! We've received your booking request and will contact you within 24 hours to confirm your sessions and provide payment details.
        </p>
        <div className="space-y-3 text-white/70 mb-8">
          <p><strong className="text-white">Confirmation email:</strong> Sent to {formData.email}</p>
          <p><strong className="text-white">Selected dates:</strong> {formData.selectedDates.length} session{formData.selectedDates.length > 1 ? 's' : ''}</p>
          <p><strong className="text-white">Payment type:</strong> {paymentType === 'full' ? 'Pay in Full' : 'Pay As You Go'}</p>
        </div>
        <Button
          onClick={() => window.location.href = '/fall-programs'}
          className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold px-8 py-6 rounded-none"
        >
          Back to Programs
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-tbf-gold hover:text-tbf-gold/80 hover:bg-tbf-gold/10"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Change Payment Option
        </Button>
      </div>

      <div className="mb-8">
        <h3 className="text-3xl font-bold text-white mb-2 font-audiowide">
          Complete Your <span className="text-tbf-gold">Booking</span>
        </h3>
        <p className="text-white/70">
          Payment Type: <span className="text-tbf-gold font-semibold">
            {paymentType === 'full' ? 'Pay in Full' : 'Pay As You Go'}
          </span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Parent Information */}
        <div>
          <h4 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2">
            <User className="w-5 h-5 text-tbf-gold" />
            Parent/Guardian Information
          </h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="parentName" className="text-white/90 mb-2 block">
                Parent/Guardian Name <span className="text-tbf-gold">*</span>
              </Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => handleChange('parentName', e.target.value)}
                placeholder="John Smith"
                required
                className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-white/90 mb-2 block">
                  Email Address <span className="text-tbf-gold">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john@email.com"
                  required
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white/90 mb-2 block">
                  Phone Number <span className="text-tbf-gold">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="(973) 240-8759"
                  required
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Athlete Information */}
        <div>
          <h4 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2">
            <User className="w-5 h-5 text-tbf-gold" />
            Athlete Information
          </h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="athleteName" className="text-white/90 mb-2 block">
                Athlete Name <span className="text-tbf-gold">*</span>
              </Label>
              <Input
                id="athleteName"
                value={formData.athleteName}
                onChange={(e) => handleChange('athleteName', e.target.value)}
                placeholder="Michael Smith"
                required
                className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="athleteAge" className="text-white/90 mb-2 block">
                  Age <span className="text-tbf-gold">*</span>
                </Label>
                <Input
                  id="athleteAge"
                  type="number"
                  min="14"
                  max="18"
                  value={formData.athleteAge}
                  onChange={(e) => handleChange('athleteAge', e.target.value)}
                  placeholder="16"
                  required
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                />
              </div>

              <div>
                <Label htmlFor="athleteGrade" className="text-white/90 mb-2 block">
                  Grade <span className="text-tbf-gold">*</span>
                </Label>
                <Select value={formData.athleteGrade} onValueChange={(value) => handleChange('athleteGrade', value)} required>
                  <SelectTrigger className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-tbf-gold/30">
                    <SelectItem value="9th" className="text-white hover:bg-tbf-gold/20">9th Grade</SelectItem>
                    <SelectItem value="10th" className="text-white hover:bg-tbf-gold/20">10th Grade</SelectItem>
                    <SelectItem value="11th" className="text-white hover:bg-tbf-gold/20">11th Grade</SelectItem>
                    <SelectItem value="12th" className="text-white hover:bg-tbf-gold/20">12th Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact" className="text-white/90 mb-2 block">
                  Emergency Contact Name <span className="text-tbf-gold">*</span>
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleChange('emergencyContact', e.target.value)}
                  placeholder="Jane Smith"
                  required
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone" className="text-white/90 mb-2 block">
                  Emergency Phone <span className="text-tbf-gold">*</span>
                </Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                  placeholder="(973) 555-5678"
                  required
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Training Dates Selection */}
        <div>
          <h4 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2">
            <Calendar className="w-5 h-5 text-tbf-gold" />
            Select Training Dates
          </h4>
          
          {paymentType === 'full' ? (
            <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-6 mb-4">
              <p className="text-white/90 mb-4">
                <strong className="text-tbf-gold">Pay in Full</strong> - All training dates are included
              </p>
              <div className="space-y-2">
                {trainingDates.map((date) => (
                  <div key={date.value} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-tbf-gold" />
                    <span>{date.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-white/70 text-sm mb-4">
                <strong className="text-tbf-gold">Pay As You Go</strong> - Select which dates you'd like to attend (minimum 1)
              </p>
              {trainingDates.map((date) => (
                <label
                  key={date.value}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all
                    ${formData.selectedDates.includes(date.value)
                      ? 'bg-tbf-gold/20 border-2 border-tbf-gold'
                      : 'bg-black/50 border-2 border-tbf-gold/30 hover:border-tbf-gold/60'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={formData.selectedDates.includes(date.value)}
                    onChange={() => handleDateSelection(date.value)}
                    className="w-5 h-5 accent-tbf-gold"
                  />
                  <span className="text-white font-medium">{date.label}</span>
                  <span className="ml-auto text-white/60 text-sm">11:30 AM - 1:00 PM</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div>
          <Label htmlFor="notes" className="text-white/90 mb-2 block">
            Additional Notes (Optional)
          </Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Any medical conditions, allergies, or special requirements we should know about..."
            rows={4}
            className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-tbf-gold/30">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg py-6 rounded-none"
          >
            {isSubmitting ? 'Submitting...' : 'Complete Booking'}
          </Button>

          <p className="text-white/60 text-xs text-center mt-4">
            By submitting this form, you agree to be contacted by The Basketball Factory regarding your booking. We typically respond within 24 hours with payment information.
          </p>
        </div>
      </form>
    </div>
  )
}
