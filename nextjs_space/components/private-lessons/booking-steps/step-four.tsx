
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Phone, MessageSquare } from 'lucide-react'
import { BookingData } from '../booking-wizard'

interface StepFourProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function StepFour({ bookingData, updateBookingData, nextStep, prevStep }: StepFourProps) {
  const handleChange = (field: string, value: string) => {
    updateBookingData({ [field]: value })
  }

  const handleContinue = () => {
    if (
      bookingData.parentName &&
      bookingData.email &&
      bookingData.phone &&
      bookingData.athleteName &&
      bookingData.athleteAge &&
      bookingData.skillLevel
    ) {
      nextStep()
    }
  }

  const isFormValid = 
    bookingData.parentName &&
    bookingData.email &&
    bookingData.phone &&
    bookingData.athleteName &&
    bookingData.athleteAge &&
    bookingData.skillLevel

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
          YOUR <span className="text-tbf-gold">INFORMATION</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Please provide your contact information and details about your athlete. This helps us personalize the training experience.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-gradient-to-b from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-8">
        <div className="space-y-6">
          {/* Parent Information */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2 uppercase">
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
                  value={bookingData.parentName}
                  onChange={(e) => handleChange('parentName', e.target.value)}
                  placeholder="John Smith"
                  required
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-white/90 mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4 text-tbf-gold" />
                    Email <span className="text-tbf-gold">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="john@email.com"
                    required
                    className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white/90 mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4 text-tbf-gold" />
                    Phone <span className="text-tbf-gold">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(973) 240-8759"
                    required
                    className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold h-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Athlete Information */}
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2 uppercase">
              <User className="w-5 h-5 text-tbf-gold" />
              Athlete Information
            </h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="athleteName" className="text-white/90 mb-2 block">
                    Athlete Name <span className="text-tbf-gold">*</span>
                  </Label>
                  <Input
                    id="athleteName"
                    value={bookingData.athleteName}
                    onChange={(e) => handleChange('athleteName', e.target.value)}
                    placeholder="Michael Smith"
                    required
                    className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="athleteAge" className="text-white/90 mb-2 block">
                    Age <span className="text-tbf-gold">*</span>
                  </Label>
                  <Input
                    id="athleteAge"
                    type="number"
                    min="7"
                    max="18"
                    value={bookingData.athleteAge}
                    onChange={(e) => handleChange('athleteAge', e.target.value)}
                    placeholder="12"
                    required
                    className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold h-12"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="skillLevel" className="text-white/90 mb-2 block">
                  Current Skill Level <span className="text-tbf-gold">*</span>
                </Label>
                <Select value={bookingData.skillLevel} onValueChange={(value) => handleChange('skillLevel', value)} required>
                  <SelectTrigger className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold h-12">
                    <SelectValue placeholder="Select skill level" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-tbf-gold/30">
                    <SelectItem value="beginner" className="text-white hover:bg-tbf-gold/20">
                      Beginner (Just starting out)
                    </SelectItem>
                    <SelectItem value="intermediate" className="text-white hover:bg-tbf-gold/20">
                      Intermediate (Rec/Travel experience)
                    </SelectItem>
                    <SelectItem value="advanced" className="text-white hover:bg-tbf-gold/20">
                      Advanced (School team/Competitive)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-white/90 mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-tbf-gold" />
                  Training Goals & Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={bookingData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Tell us about your athlete's goals, specific areas to work on, or any questions you have..."
                  rows={4}
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="border-tbf-gold/50 text-white hover:bg-tbf-gold/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Agreement
        </Button>
      </div>
    </div>
  )
}
