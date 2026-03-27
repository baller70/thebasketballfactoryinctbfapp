
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Mail, Phone, MessageSquare, GraduationCap, School } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'

interface StepFourProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function StepFour({ bookingData, updateBookingData, nextStep, prevStep }: StepFourProps) {
  const handleChange = (field: string, value: string) => {
    updateBookingData({ [field]: value })
  }

  const handleContinue = () => {
    console.log('Step 4 - handleContinue called')
    console.log('bookingData:', {
      parentName: bookingData.parentName,
      parentEmail: bookingData.parentEmail,
      parentPhone: bookingData.parentPhone,
      playerName: bookingData.playerName,
      playerAge: bookingData.playerAge,
      playerGrade: bookingData.playerGrade
    })
    
    if (
      bookingData.parentName &&
      bookingData.parentEmail &&
      bookingData.parentPhone &&
      bookingData.playerName &&
      bookingData.playerAge &&
      bookingData.playerGrade
    ) {
      console.log('Step 4 - All validation passed, calling nextStep()')
      nextStep()
    } else {
      console.log('Step 4 - Validation failed, missing required fields')
    }
  }

  const isFormValid = 
    bookingData.parentName &&
    bookingData.parentEmail &&
    bookingData.parentPhone &&
    bookingData.playerName &&
    bookingData.playerAge &&
    bookingData.playerGrade

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          YOUR <span className="text-[#C8B273]">INFORMATION</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Please provide your contact information and details about your athlete. This helps us personalize the training experience.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-gradient-to-b from-gray-900 to-black border-2 border-[#C8B273]/30 rounded-lg p-8">
        <div className="space-y-6">
          {/* Parent Information */}
          <div>
            <h4 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2">
              <User className="w-5 h-5 text-[#C8B273]" />
              Parent/Guardian Information
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="parentName" className="text-white/90 mb-2 block">
                  Parent/Guardian Name <span className="text-[#C8B273]">*</span>
                </Label>
                <Input
                  id="parentName"
                  value={bookingData.parentName}
                  onChange={(e) => handleChange('parentName', e.target.value)}
                  placeholder="John Smith"
                  required
                  className="bg-black/50 border-[#C8B273]/30 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-white/90 mb-2 block flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#C8B273]" />
                    Email <span className="text-[#C8B273]">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.parentEmail}
                    onChange={(e) => handleChange('parentEmail', e.target.value)}
                    placeholder="john.smith@email.com"
                    required
                    className="bg-black/50 border-[#C8B273]/30 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white/90 mb-2 block flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#C8B273]" />
                    Phone <span className="text-[#C8B273]">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingData.parentPhone}
                    onChange={(e) => handleChange('parentPhone', e.target.value)}
                    placeholder="(973) 240-8759"
                    required
                    className="bg-black/50 border-[#C8B273]/30 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Athlete Information */}
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2">
              <User className="w-5 h-5 text-[#C8B273]" />
              Athlete Information
            </h4>
            <div className="space-y-4">
              <div>
                <Label htmlFor="playerName" className="text-white/90 mb-2 block">
                  Player Full Name <span className="text-[#C8B273]">*</span>
                </Label>
                <Input
                  id="playerName"
                  value={bookingData.playerName}
                  onChange={(e) => handleChange('playerName', e.target.value)}
                  placeholder="Michael Johnson"
                  required
                  className="bg-black/50 border-[#C8B273]/30 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="playerAge" className="text-white/90 mb-2 block">
                    Age <span className="text-[#C8B273]">*</span>
                  </Label>
                  <Input
                    id="playerAge"
                    type="number"
                    min="14"
                    max="18"
                    value={bookingData.playerAge}
                    onChange={(e) => handleChange('playerAge', e.target.value)}
                    placeholder="15"
                    required
                    className="bg-black/50 border-[#C8B273]/30 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                  />
                </div>

                <div>
                  <Label htmlFor="playerGrade" className="text-white/90 mb-2 block flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#C8B273]" />
                    Grade <span className="text-[#C8B273]">*</span>
                  </Label>
                  <Select 
                    value={bookingData.playerGrade || 'grade-9'} 
                    onValueChange={(value) => handleChange('playerGrade', value)}
                  >
                    <SelectTrigger className="bg-black/50 border-[#C8B273]/30 text-white focus:border-[#C8B273] rounded-none h-12">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-[#C8B273]/30">
                      <SelectItem value="grade-9" className="text-white hover:bg-[#C8B273]/20">
                        9th Grade
                      </SelectItem>
                      <SelectItem value="grade-10" className="text-white hover:bg-[#C8B273]/20">
                        10th Grade
                      </SelectItem>
                      <SelectItem value="grade-11" className="text-white hover:bg-[#C8B273]/20">
                        11th Grade
                      </SelectItem>
                      <SelectItem value="grade-12" className="text-white hover:bg-[#C8B273]/20">
                        12th Grade
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="schoolName" className="text-white/90 mb-2 block flex items-center gap-2">
                  <School className="w-4 h-4 text-[#C8B273]" />
                  School Name (Optional)
                </Label>
                <Input
                  id="schoolName"
                  value={bookingData.schoolName}
                  onChange={(e) => handleChange('schoolName', e.target.value)}
                  placeholder="Sparta High School"
                  className="bg-black/50 border-[#C8B273]/30 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none h-12"
                />
              </div>

              <div>
                <Label htmlFor="trainingGoals" className="text-white/90 mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#C8B273]" />
                  Training Goals & Notes (Optional)
                </Label>
                <Textarea
                  id="trainingGoals"
                  value={bookingData.trainingGoals}
                  onChange={(e) => handleChange('trainingGoals', e.target.value)}
                  placeholder="Tell us about your athlete's goals, specific areas to work on, or any questions you have..."
                  rows={4}
                  className="bg-black/50 border-[#C8B273]/30 text-white placeholder:text-white/40 focus:border-[#C8B273] rounded-none resize-none"
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
          className="border-[#C8B273]/50 !text-white !bg-transparent hover:bg-[#C8B273]/10 px-8 py-6 text-lg rounded-none"
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Additional Details
        </Button>
      </div>
    </div>
  )
}
