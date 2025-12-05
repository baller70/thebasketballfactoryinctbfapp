
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { YouthBookingData } from './youth-booking-wizard'
import { Check, Calendar, User, Phone, Mail, ArrowLeft, Shield } from 'lucide-react'

interface StepSixProps {
  data: YouthBookingData
  updateData: (data: Partial<YouthBookingData>) => void
  onNext: () => void
  onBack: () => void
}

export default function StepSix({ data, updateData, onNext, onBack }: StepSixProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (data.agreementSigned) {
      setIsSubmitting(true)
      
      try {
        // Create booking with FREE ($0) pricing
        const bookingPayload = {
          // Mark this as a FREE program booking
          sessionOption: 'free-youth-program',
          lessonType: undefined, // Not a lesson
          
          // Child/Athlete info
          athleteName: data.childName,
          athleteAge: data.childAge,
          playerName: data.childName,
          playerAge: data.childAge,
          playerGrade: data.childGrade,
          schoolName: data.schoolName || '',
          
          // Parent info
          parentName: data.parentName,
          parentEmail: data.parentEmail,
          email: data.parentEmail,
          parentPhone: data.parentPhone,
          phone: data.parentPhone,
          
          // Session details
          selectedDates: [data.selectedDate],
          selectedTimes: [data.selectedTime],
          
          // Emergency contact
          emergencyContact: data.emergencyContact,
          emergencyPhone: data.emergencyPhone,
          
          // Medical/Additional info
          medicalInfo: data.medicalInfo || '',
          
          // Pricing info (FREE)
          pricingInfo: {
            basePrice: 0,
            totalPrice: 0,
            sessionCount: 1,
            programName: 'FREE Youth Basketball Program'
          },
          
          // Payment status
          cardLast4: null,
          isFreeProgram: true
        }
        
        console.log('Creating FREE youth program booking:', bookingPayload)
        
        // Call API to create booking
        const response = await fetch('/api/bookings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingPayload)
        })
        
        const result = await response.json()
        
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to create booking')
        }
        
        console.log('FREE youth booking created successfully:', result.bookingId)
        
        // Update booking data with bookingId for receipt/confirmation
        updateData({ bookingId: result.bookingId })
        
        // Move to confirmation step
        onNext()
      } catch (error) {
        console.error('Error creating FREE youth booking:', error)
        alert('Sorry, there was an error processing your registration. Please try again or contact us directly.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold !text-white bg-transparent mb-4">Review & Confirm Your FREE Spot</h3>
        <p className="text-lg text-gray-300">
          Please review your information before completing the sign-up.
        </p>
      </div>

      {/* Summary Card */}
      <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#C8B273]/30 rounded-xl mb-8">
        <h4 className="text-2xl font-bold !text-white bg-transparent mb-6 flex items-center gap-2">
          <Check className="w-6 h-6 text-[#C8B273]" />
          Registration Summary
        </h4>

        <div className="space-y-6">
          {/* Session Details */}
          <div className="p-5 bg-black/40 rounded-lg border border-[#C8B273]/20">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-[#C8B273]" />
              <h5 className="font-bold !text-white bg-transparent text-lg">Selected Session</h5>
            </div>
            <p className="text-gray-300 mb-1">
              <strong className="!text-white bg-transparent">Date:</strong> {data.selectedDate}
            </p>
            <p className="text-gray-300 mb-1">
              <strong className="!text-white bg-transparent">Time:</strong> {data.selectedTime}
            </p>
            <p className="text-gray-300">
              <strong className="!text-white bg-transparent">Cost:</strong>{' '}
              <span className="text-[#C8B273] font-bold text-xl">FREE</span>
            </p>
          </div>

          {/* Parent & Child Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 bg-black/40 rounded-lg border border-[#C8B273]/20">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-[#C8B273]" />
                <h5 className="font-bold !text-white bg-transparent">Parent/Guardian</h5>
              </div>
              <p className="text-gray-300 mb-1">{data.parentName}</p>
              <p className="text-gray-300 mb-1 text-sm flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {data.parentEmail}
              </p>
              <p className="text-gray-300 text-sm flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {data.parentPhone}
              </p>
            </div>

            <div className="p-5 bg-black/40 rounded-lg border border-[#C8B273]/20">
              <div className="flex items-center gap-2 mb-3">
                <User className="w-5 h-5 text-[#C8B273]" />
                <h5 className="font-bold !text-white bg-transparent">Child Information</h5>
              </div>
              <p className="text-gray-300 mb-1">{data.childName}</p>
              <p className="text-gray-300 mb-1 text-sm">
                Age: {data.childAge} • Grade: {data.childGrade}
              </p>
              {data.schoolName && (
                <p className="text-gray-300 text-sm">{data.schoolName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Waiver Agreement */}
      <div className="p-8 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-[#C8B273]" />
          <h4 className="text-xl font-bold !text-white bg-transparent">Liability Waiver & Agreement</h4>
        </div>

        <div className="p-4 bg-black/40 rounded-lg border border-gray-700 mb-4 max-h-60 overflow-y-auto">
          <p className="text-gray-300 text-sm leading-relaxed space-y-3">
            <span className="block">
              By checking the box below, I acknowledge and agree to the following:
            </span>

            <span className="block">
              <strong className="!text-white bg-transparent">1. Assumption of Risk:</strong> I understand that participation in basketball 
              activities involves inherent risks, including but not limited to physical injury. I voluntarily allow my child 
              to participate in this FREE youth basketball session.
            </span>

            <span className="block">
              <strong className="!text-white bg-transparent">2. Medical Treatment:</strong> I authorize The Basketball Factory staff to 
              provide or arrange for emergency medical treatment for my child if necessary, and I will be responsible for 
              any costs associated with such treatment.
            </span>

            <span className="block">
              <strong className="!text-white bg-transparent">3. Photo/Video Release:</strong> I grant permission for my child's photo or 
              video to be used for promotional purposes by The Basketball Factory.
            </span>

            <span className="block">
              <strong className="!text-white bg-transparent">4. Code of Conduct:</strong> I agree that my child will follow all facility 
              rules and coach instructions, and treat all participants with respect.
            </span>

            <span className="block">
              <strong className="!text-white bg-transparent">5. Liability Release:</strong> I hereby release and hold harmless The Basketball 
              Factory, its owners, coaches, and staff from any and all liability for injuries or damages arising from my 
              child's participation in this program.
            </span>

            <span className="block">
              <strong className="!text-white bg-transparent">6. Accuracy of Information:</strong> I confirm that all information provided 
              in this registration is accurate and complete.
            </span>
          </p>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="agreement"
            checked={data.agreementSigned}
            onCheckedChange={(checked) => updateData({ agreementSigned: checked as boolean })}
            className="mt-1 border-[#C8B273] data-[state=checked]:bg-[#C8B273] data-[state=checked]:text-black"
          />
          <label htmlFor="agreement" className="text-gray-300 cursor-pointer leading-relaxed">
            I have read and agree to the terms above. I understand this is a FREE program with no financial obligation, 
            and I consent to my child's participation in this youth basketball session. *
          </label>
        </div>
      </div>

      <div className="flex justify-between">
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
          onClick={handleSubmit}
          disabled={!data.agreementSigned || isSubmitting}
          size="lg"
          className="bg-gradient-to-r from-[#C8B273] to-yellow-600 hover:from-[#B89F5F] hover:to-yellow-500 text-black font-bold px-12 py-6 text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Confirming Your Spot...' : 'Confirm FREE Registration'}
        </Button>
      </div>
    </div>
  )
}
