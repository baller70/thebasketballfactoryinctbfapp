
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { YouthBookingData } from './youth-booking-wizard'
import { Phone, User, AlertCircle, ArrowLeft } from 'lucide-react'

interface StepFiveProps {
  data: YouthBookingData
  updateData: (data: Partial<YouthBookingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepFive({ data, updateData, onNext, onBack }: StepFiveProps) {
  const handleContinue = () => {
    if (data.emergencyContact && data.emergencyPhone) {
      onNext()
    }
  }

  const isFormValid = data.emergencyContact && data.emergencyPhone

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold !text-white bg-transparent mb-4">Emergency Contact & Medical Info</h3>
        <p className="text-lg text-gray-300">
          Your child's safety is our top priority. This information is kept confidential.
        </p>
      </div>

      <div className="space-y-6 p-8 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl">
        {/* Safety Note */}
        <div className="p-4 bg-gradient-to-br from-[#C8B273]/10 to-yellow-600/5 border border-[#C8B273]/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#C8B273] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              <strong className="!text-white bg-transparent">Safety First:</strong> This information is required for all youth programs 
              and will only be used in case of an emergency during the session.
            </p>
          </div>
        </div>

        {/* Emergency Contact Name */}
        <div className="space-y-2">
          <Label htmlFor="emergencyContact" className="!text-white bg-transparent text-base flex items-center gap-2">
            <User className="w-4 h-4 text-[#C8B273]" />
            Emergency Contact Name *
          </Label>
          <Input
            id="emergencyContact"
            type="text"
            placeholder="Full name of emergency contact"
            value={data.emergencyContact}
            onChange={(e) => updateData({ emergencyContact: e.target.value })}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] h-12"
          />
          <p className="text-sm text-gray-400">Someone we can call if you're unavailable</p>
        </div>

        {/* Emergency Contact Phone */}
        <div className="space-y-2">
          <Label htmlFor="emergencyPhone" className="!text-white bg-transparent text-base flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C8B273]" />
            Emergency Contact Phone *
          </Label>
          <Input
            id="emergencyPhone"
            type="tel"
            placeholder="(123) 456-7890"
            value={data.emergencyPhone}
            onChange={(e) => updateData({ emergencyPhone: e.target.value })}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] h-12"
          />
        </div>

        {/* Medical Information */}
        <div className="space-y-2">
          <Label htmlFor="medicalInfo" className="!text-white bg-transparent text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#C8B273]" />
            Medical Information (Optional but Recommended)
          </Label>
          <Textarea
            id="medicalInfo"
            placeholder="Any allergies, medical conditions, medications, or special needs we should know about? (e.g., asthma, diabetes, food allergies, etc.)"
            value={data.medicalInfo}
            onChange={(e) => updateData({ medicalInfo: e.target.value })}
            rows={4}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] resize-none"
          />
          <p className="text-sm text-gray-400">
            While optional, this helps our coaches provide better care and respond appropriately if needed
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="border-2 border-gray-700 text-gray-300 hover:bg-gray-800 font-semibold px-8 py-6 text-lg rounded-full"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          size="lg"
          className="bg-gradient-to-r from-[#C8B273] to-yellow-600 hover:from-[#B89F5F] hover:to-yellow-500 text-black font-bold px-12 py-6 text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Final Step
        </Button>
      </div>
    </div>
  )
}
