
'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { YouthBookingData } from './youth-booking-wizard'
import { Trophy, Heart, ArrowLeft } from 'lucide-react'

interface StepFourProps {
  data: YouthBookingData
  updateData: (data: Partial<YouthBookingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepFour({ data, updateData, onNext, onBack }: StepFourProps) {
  const handleContinue = () => {
    if (data.basketballExperience) {
      onNext()
    }
  }

  const isFormValid = data.basketballExperience

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-4">Basketball Experience</h3>
        <p className="text-lg text-gray-300">
          Help us understand your child's basketball background so we can provide the best experience.
        </p>
      </div>

      <div className="space-y-6 p-8 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl">
        {/* Basketball Experience */}
        <div className="space-y-2">
          <Label htmlFor="basketballExperience" className="text-white text-base flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#C8B273]" />
            Basketball Experience *
          </Label>
          <select
            id="basketballExperience"
            value={data.basketballExperience}
            onChange={(e) => updateData({ basketballExperience: e.target.value })}
            className="w-full bg-black/50 border border-gray-700 text-white rounded-lg px-4 h-12 focus:border-[#C8B273] focus:outline-none"
          >
            <option value="">Select experience level</option>
            <option value="never-played">Never played basketball before</option>
            <option value="beginner">Just starting out (less than 1 year)</option>
            <option value="some-experience">Some experience (1-2 years)</option>
            <option value="recreational">Plays recreationally</option>
            <option value="team-player">Plays on a school or travel team</option>
          </select>
          <p className="text-sm text-gray-400">This helps us group kids appropriately for drills</p>
        </div>

        {/* Child Interests */}
        <div className="space-y-2">
          <Label htmlFor="childInterests" className="text-white text-base flex items-center gap-2">
            <Heart className="w-4 h-4 text-[#C8B273]" />
            What interests your child about basketball? (Optional)
          </Label>
          <Textarea
            id="childInterests"
            placeholder="Tell us what drew your child to basketball - watching games, playing with friends, favorite players, etc. This helps us connect with them!"
            value={data.childInterests}
            onChange={(e) => updateData({ childInterests: e.target.value })}
            rows={4}
            className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#C8B273] resize-none"
          />
        </div>

        {/* Info Box */}
        <div className="p-4 bg-gradient-to-br from-[#C8B273]/10 to-yellow-600/5 border border-[#C8B273]/30 rounded-lg">
          <p className="text-sm text-gray-300">
            <strong className="text-[#C8B273]">Don't worry!</strong> Our FREE session welcomes all experience levels. 
            Whether your child has never picked up a basketball or plays regularly, we'll make sure they have fun 
            and learn something new!
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
          Continue to Emergency Contact
        </Button>
      </div>
    </div>
  )
}
