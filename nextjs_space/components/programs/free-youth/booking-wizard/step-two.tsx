
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { YouthBookingData } from './youth-booking-wizard'
import { User, Mail, Phone, ArrowLeft } from 'lucide-react'

interface StepTwoProps {
  data: YouthBookingData
  updateData: (data: Partial<YouthBookingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepTwo({ data, updateData, onNext, onBack }: StepTwoProps) {
  const handleContinue = () => {
    if (data.parentName && data.parentEmail && data.parentPhone) {
      onNext()
    }
  }

  const isFormValid = data.parentName && data.parentEmail && data.parentPhone

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold !text-white bg-transparent mb-4">Parent/Guardian Information</h3>
        <p className="text-lg text-gray-300">
          We'll use this to send you confirmation details and session reminders.
        </p>
      </div>

      <div className="space-y-6 p-8 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl">
        {/* Parent Name */}
        <div className="space-y-2">
          <Label htmlFor="parentName" className="!text-white bg-transparent text-base flex items-center gap-2">
            <User className="w-4 h-4 text-[#C8B273]" />
            Your Full Name *
          </Label>
          <Input
            id="parentName"
            type="text"
            placeholder="Enter your full name"
            value={data.parentName}
            onChange={(e) => updateData({ parentName: e.target.value })}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] h-12"
          />
        </div>

        {/* Parent Email */}
        <div className="space-y-2">
          <Label htmlFor="parentEmail" className="!text-white bg-transparent text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#C8B273]" />
            Your Email Address *
          </Label>
          <Input
            id="parentEmail"
            type="email"
            placeholder="your.email@example.com"
            value={data.parentEmail}
            onChange={(e) => updateData({ parentEmail: e.target.value })}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] h-12"
          />
          <p className="text-sm text-gray-400">We'll send your confirmation here</p>
        </div>

        {/* Parent Phone */}
        <div className="space-y-2">
          <Label htmlFor="parentPhone" className="!text-white bg-transparent text-base flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#C8B273]" />
            Your Phone Number *
          </Label>
          <Input
            id="parentPhone"
            type="tel"
            placeholder="(123) 456-7890"
            value={data.parentPhone}
            onChange={(e) => updateData({ parentPhone: e.target.value })}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] h-12"
          />
          <p className="text-sm text-gray-400">In case we need to reach you on session day</p>
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
          Continue to Child Information
        </Button>
      </div>
    </div>
  )
}
