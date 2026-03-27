
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Activity, Heart, UserPlus, Phone } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'

interface StepFiveProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function StepFive({ bookingData, updateBookingData, nextStep, prevStep }: StepFiveProps) {
  const handleContinue = () => {
    if (
      bookingData.skillLevel &&
      bookingData.emergencyContact &&
      bookingData.emergencyPhone
    ) {
      nextStep()
    }
  }

  const isFormValid = 
    bookingData.skillLevel &&
    bookingData.emergencyContact &&
    bookingData.emergencyPhone

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          ADDITIONAL <span className="text-[#C8B273]">DETAILS</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Help us provide the best training experience for {bookingData.playerName || 'your athlete'}. This information helps our coaches tailor the program to your player's needs.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-black via-gray-900 to-black border-2 border-[#C8B273]/30 rounded-lg p-8">
          <div className="space-y-6">
            {/* Skill Level */}
            <div>
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C8B273]" />
                Current Skill Level *
              </label>
              <Select
                value={bookingData.skillLevel || 'intermediate'}
                onValueChange={(value) => updateBookingData({ skillLevel: value })}
              >
                <SelectTrigger className="bg-black/50 border-white/20 text-white focus:border-[#C8B273] rounded-none h-12">
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  <SelectItem value="beginner">Beginner - New to competitive basketball</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Plays school/club ball</SelectItem>
                  <SelectItem value="advanced">Advanced - Varsity level player</SelectItem>
                  <SelectItem value="elite">Elite - College prospect</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-white/60 text-sm mt-2">
                This helps coaches adjust training intensity and focus areas
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-lg font-bold text-white mb-4 font-audiowide">
                EMERGENCY CONTACT INFORMATION
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#C8B273]" />
                    Emergency Contact Name *
                  </label>
                  <Input
                    type="text"
                    value={bookingData.emergencyContact}
                    onChange={(e) => updateBookingData({ emergencyContact: e.target.value })}
                    placeholder="Jane Smith"
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                    required
                  />
                  <p className="text-white/60 text-sm mt-2">
                    Person to contact if parent/guardian cannot be reached
                  </p>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C8B273]" />
                    Emergency Contact Phone *
                  </label>
                  <Input
                    type="tel"
                    value={bookingData.emergencyPhone}
                    onChange={(e) => updateBookingData({ emergencyPhone: e.target.value })}
                    placeholder="(555) 987-6543"
                    className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div className="pt-4 border-t border-white/10">
              <label className="block text-white font-semibold mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C8B273]" />
                Medical Information & Allergies (Optional)
              </label>
              <Textarea
                value={bookingData.medicalInfo}
                onChange={(e) => updateBookingData({ medicalInfo: e.target.value })}
                placeholder="List any medical conditions, allergies, medications, or special considerations our coaches should know about..."
                className="bg-black/50 border-white/20 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none min-h-[120px]"
                rows={5}
              />
              <p className="text-white/60 text-sm mt-2">
                🔒 This information will be kept confidential and only shared with coaching staff
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          onClick={prevStep}
          variant="outline"
          className="border-[#C8B273]/50 !text-white !bg-transparent hover:bg-[#C8B273]/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Agreement & Payment
        </Button>
      </div>
    </div>
  )
}
