
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FileText, AlertCircle } from 'lucide-react'
import { BookingData } from '../booking-wizard'

interface StepFiveProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function StepFive({ bookingData, updateBookingData, nextStep, prevStep }: StepFiveProps) {
  const [agreedToTerms, setAgreedToTerms] = useState(bookingData.agreementSigned)
  const [agreedToWaiver, setAgreedToWaiver] = useState(false)
  const [agreedToPhoto, setAgreedToPhoto] = useState(false)

  const handleContinue = () => {
    if (agreedToTerms && agreedToWaiver) {
      updateBookingData({ agreementSigned: true })
      nextStep()
    }
  }

  const allAgreed = agreedToTerms && agreedToWaiver

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
          TRAINING <span className="text-tbf-gold">AGREEMENT</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          Please review and agree to our terms and conditions before proceeding to payment.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Terms and Conditions */}
        <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-tbf-gold" />
            <h4 className="text-white font-bold text-lg font-audiowide uppercase">TERMS AND CONDITIONS</h4>
          </div>

          <div className="bg-black rounded border border-white/20 p-6 max-h-96 overflow-y-auto space-y-4 text-white/80 text-sm leading-relaxed">
            <div>
              <h5 className="font-bold text-white mb-2">1. Payment Terms</h5>
              <p>Full payment is required at the time of booking. All sales are final. Package sessions are non-refundable but may be transferred to another athlete or gifted with written notice.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">2. Scheduling & Attendance</h5>
              <p>Sessions must be scheduled in advance through our booking system or by contacting The Basketball Factory directly. Athletes are expected to arrive 5 minutes before their scheduled session time. Late arrivals may result in shortened session time.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">3. Cancellation Policy</h5>
              <p>Cancellations must be made at least 24 hours before the scheduled session time. Cancellations made with less than 24 hours notice will result in forfeiture of that session. Emergency situations will be reviewed on a case-by-case basis.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">4. Rescheduling</h5>
              <p>Sessions may be rescheduled with at least 24 hours notice, subject to trainer availability. Package expiration dates will not be extended due to rescheduling.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">5. Package Expiration</h5>
              <p>Individual sessions expire 3 months from purchase date. 10-pack sessions expire 6 months from purchase date. 20-pack sessions expire 12 months from purchase date. No refunds or extensions will be provided for expired sessions.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">6. Facility Rules</h5>
              <p>All athletes and parents/guardians must follow facility rules and trainer instructions. Inappropriate behavior may result in session termination without refund. Only scheduled athletes may participate in training sessions.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">7. Equipment</h5>
              <p>The Basketball Factory provides all necessary training equipment. Athletes should wear appropriate athletic attire and court shoes. Outside food and drinks are not permitted in training areas.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">8. Parent/Guardian Observation</h5>
              <p>Parents and guardians are welcome to observe training sessions from designated viewing areas. For optimal training focus, we ask that observers minimize interaction during active training time.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">9. Weather & Facility Closures</h5>
              <p>In the event of facility closure due to weather, emergency, or unforeseen circumstances, affected sessions will be rescheduled at no additional cost and will not count toward package expiration.</p>
            </div>

            <div>
              <h5 className="font-bold text-white mb-2">10. Modification of Terms</h5>
              <p>The Basketball Factory reserves the right to modify these terms and conditions at any time. Changes will be communicated to active clients via email.</p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="mt-1 border-tbf-gold data-[state=checked]:bg-tbf-gold data-[state=checked]:text-black"
            />
            <label htmlFor="terms" className="text-white/90 text-sm cursor-pointer">
              I have read and agree to the Terms and Conditions outlined above. I understand the payment terms, cancellation policy, and package expiration dates.
            </label>
          </div>
        </div>

        {/* Liability Waiver */}
        <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-tbf-gold" />
            <h4 className="text-white font-bold text-lg font-audiowide uppercase">LIABILITY WAIVER</h4>
          </div>

          <div className="bg-black rounded border border-white/20 p-6 max-h-64 overflow-y-auto space-y-4 text-white/80 text-sm leading-relaxed">
            <p>
              I, the undersigned parent/legal guardian, hereby acknowledge that basketball training involves physical activity and carries inherent risks of injury. I understand that The Basketball Factory, its trainers, staff, and facility owners have taken reasonable precautions to ensure a safe training environment.
            </p>

            <p>
              By signing this waiver, I agree to the following:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>I acknowledge that my child is physically capable of participating in basketball training activities.</li>
              <li>I understand that basketball training involves running, jumping, quick directional changes, and physical contact with equipment.</li>
              <li>I agree to release, waive, and discharge The Basketball Factory, Kevin Houston, and all associated staff from any and all liability for injuries sustained during training sessions.</li>
              <li>I agree to assume full responsibility for any risks, injuries, or damages, known or unknown, which my child might incur as a result of participating in training sessions.</li>
              <li>I acknowledge that The Basketball Factory carries general liability insurance, but I am responsible for my child's personal medical insurance coverage.</li>
              <li>In case of emergency, I authorize The Basketball Factory staff to seek medical treatment for my child if I cannot be reached immediately.</li>
            </ul>

            <p className="font-semibold text-white mt-4">
              Emergency Contact: By completing this booking, you agree that the phone number provided will serve as the primary emergency contact during all training sessions.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <Checkbox
              id="waiver"
              checked={agreedToWaiver}
              onCheckedChange={(checked) => setAgreedToWaiver(checked === true)}
              className="mt-1 border-tbf-gold data-[state=checked]:bg-tbf-gold data-[state=checked]:text-black"
            />
            <label htmlFor="waiver" className="text-white/90 text-sm cursor-pointer">
              I have read and understand the Liability Waiver. I agree to release The Basketball Factory from liability and assume responsibility for any risks associated with my child's participation in training sessions.
            </label>
          </div>
        </div>

        {/* Photo Release (Optional) */}
        <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-6">
          <h4 className="text-white font-bold mb-3 font-audiowide uppercase">PHOTO/VIDEO RELEASE (OPTIONAL)</h4>
          <p className="text-white/80 text-sm mb-4">
            From time to time, The Basketball Factory captures photos and videos during training sessions for promotional purposes on our website, social media, and marketing materials. These materials help showcase our training programs and celebrate athlete achievements.
          </p>

          <div className="flex items-start gap-3">
            <Checkbox
              id="photo"
              checked={agreedToPhoto}
              onCheckedChange={(checked) => setAgreedToPhoto(checked === true)}
              className="mt-1 border-tbf-gold data-[state=checked]:bg-tbf-gold data-[state=checked]:text-black"
            />
            <label htmlFor="photo" className="text-white/90 text-sm cursor-pointer">
              I grant permission for The Basketball Factory to use photos and videos of my child for promotional purposes. I understand this is optional and will not affect my child's training experience.
            </label>
          </div>
        </div>

        {/* Electronic Signature Notice */}
        <div className="bg-black/30 border border-white/20 rounded-lg p-4">
          <p className="text-white/70 text-xs text-center">
            By clicking "Continue to Payment," you are providing your electronic signature and agreeing to all checked items above. This electronic signature has the same legal effect as a handwritten signature.
          </p>
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
          disabled={!allAgreed}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
