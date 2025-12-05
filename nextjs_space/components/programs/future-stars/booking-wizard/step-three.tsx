
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { YouthBookingData } from './youth-booking-wizard'
import { User, Cake, GraduationCap, School, ArrowLeft } from 'lucide-react'

interface StepThreeProps {
  data: YouthBookingData
  updateData: (data: Partial<YouthBookingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepThree({ data, updateData, onNext, onBack }: StepThreeProps) {
  const handleContinue = () => {
    if (data.childName && data.childAge && data.childGrade) {
      onNext()
    }
  }

  const isFormValid = data.childName && data.childAge && data.childGrade

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold !text-white bg-transparent mb-4">About Your Child</h3>
        <p className="text-lg text-gray-300">
          Tell us a bit about your young athlete so we can provide the best experience!
        </p>
      </div>

      <div className="space-y-6 p-8 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl">
        {/* Child Name */}
        <div className="space-y-2">
          <Label htmlFor="childName" className="!text-white bg-transparent text-base flex items-center gap-2">
            <User className="w-4 h-4 text-[#C8B273]" />
            Child's Full Name *
          </Label>
          <Input
            id="childName"
            type="text"
            placeholder="Enter your child's full name"
            value={data.childName}
            onChange={(e) => updateData({ childName: e.target.value })}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] h-12"
          />
        </div>

        {/* Child Age */}
        <div className="space-y-2">
          <Label htmlFor="childAge" className="!text-white bg-transparent text-base flex items-center gap-2">
            <Cake className="w-4 h-4 text-[#C8B273]" />
            Child's Age *
          </Label>
          <select
            id="childAge"
            value={data.childAge}
            onChange={(e) => updateData({ childAge: e.target.value })}
            className="w-full bg-black/50 border border-gray-700 !text-white bg-transparent rounded-lg px-4 h-12 focus:border-[#C8B273] focus:outline-none"
          >
            <option value="">Select age</option>
            <option value="7">7 years old</option>
            <option value="8">8 years old</option>
            <option value="9">9 years old</option>
            <option value="10">10 years old</option>
          </select>
        </div>

        {/* Child Grade */}
        <div className="space-y-2">
          <Label htmlFor="childGrade" className="!text-white bg-transparent text-base flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#C8B273]" />
            Current Grade *
          </Label>
          <select
            id="childGrade"
            value={data.childGrade}
            onChange={(e) => updateData({ childGrade: e.target.value })}
            className="w-full bg-black/50 border border-gray-700 !text-white bg-transparent rounded-lg px-4 h-12 focus:border-[#C8B273] focus:outline-none"
          >
            <option value="">Select grade</option>
            <option value="1st">1st Grade</option>
            <option value="2nd">2nd Grade</option>
            <option value="3rd">3rd Grade</option>
            <option value="4th">4th Grade</option>
            <option value="5th">5th Grade</option>
          </select>
        </div>

        {/* School Name */}
        <div className="space-y-2">
          <Label htmlFor="schoolName" className="!text-white bg-transparent text-base flex items-center gap-2">
            <School className="w-4 h-4 text-[#C8B273]" />
            School Name (Optional)
          </Label>
          <Input
            id="schoolName"
            type="text"
            placeholder="Which school does your child attend?"
            value={data.schoolName}
            onChange={(e) => updateData({ schoolName: e.target.value })}
            className="bg-black/50 border-gray-700 !text-white bg-transparent placeholder:text-gray-500 focus:border-[#C8B273] h-12"
          />
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
          Continue to Experience
        </Button>
      </div>
    </div>
  )
}
