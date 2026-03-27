'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, CalendarClock } from 'lucide-react'
import StepOne from './booking-steps/step-one'
import StepTwo from './booking-steps/step-two'
import StepThree from './booking-steps/step-three'
import StepFour from './booking-steps/step-four'
import StepFive from './booking-steps/step-five'
import StepSix from './booking-steps/step-six'
import StepSeven from './booking-steps/step-seven'

export type LessonType = 'individual' | '10-pack' | '20-pack' | 'elite'

export interface BookingData {
  lessonType: LessonType
  pricingInfo: {
    price: number
    sessionCount: number
    pricePerSession: number
  }
  selectedDates: Date[]
  selectedTimes: string[]
  parentName: string
  email: string
  phone: string
  athleteName: string
  athleteAge: string
  skillLevel: string
  notes: string
  agreementSigned: boolean
  paymentIntentId?: string
}

const steps = [
  { number: 1, title: 'Choose Lessons', description: 'Select package' },
  { number: 2, title: 'Pricing Info', description: 'Review details' },
  { number: 3, title: 'Dates & Times', description: 'Select schedule' },
  { number: 4, title: 'Your Info', description: 'Contact details' },
  { number: 5, title: 'Agreement', description: 'Sign terms' },
  { number: 6, title: 'Payment', description: 'Complete booking' },
  { number: 7, title: 'Confirmed', description: 'You\'re all set' }
]

// ── Toggle this to re-enable bookings ──
const BOOKINGS_SOLD_OUT = true

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const stepperRef = useRef<HTMLDivElement>(null)
  const [bookingData, setBookingData] = useState<BookingData>({
    lessonType: 'individual',
    pricingInfo: {
      price: 85,
      sessionCount: 1,
      pricePerSession: 85
    },
    selectedDates: [],
    selectedTimes: [],
    parentName: '',
    email: '',
    phone: '',
    athleteName: '',
    athleteAge: '',
    skillLevel: '',
    notes: '',
    agreementSigned: false
  })

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const scrollToStepper = useCallback(() => {
    requestAnimationFrame(() => {
      stepperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const nextStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev < 7) {
        return prev + 1
      }
      return prev
    })
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep(prev => {
      if (prev > 1) {
        return prev - 1
      }
      return prev
    })
  }, [])

  useEffect(() => {
    if (currentStep > 1) {
      scrollToStepper()
    }
  }, [currentStep, scrollToStepper])

  const goToStep = (step: number) => {
    if (step <= currentStep || step === 1) {
      setCurrentStep(step)
    }
  }

  // ── Sold-out state ──
  if (BOOKINGS_SOLD_OUT) {
    return (
      <section id="booking-wizard" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            Private Lessons
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide uppercase">
            CURRENTLY <span className="text-tbf-gold">SOLD OUT</span>
          </h2>

          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold rounded-2xl p-8 sm:p-12 mb-8">
            <CalendarClock className="w-16 h-16 text-tbf-gold mx-auto mb-6" />
            <p className="text-white/90 text-lg sm:text-xl leading-relaxed mb-6">
              All private lesson slots are currently <strong className="text-tbf-gold">fully booked</strong>.
            </p>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
              New available dates will be posted in <strong className="text-tbf-gold">April</strong>. Check back soon or contact us to be added to the waitlist!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-base px-8 py-4 rounded-none transition-colors w-full sm:w-auto"
              >
                Join the Waitlist
              </a>
              <a
                href="tel:+19732408759"
                className="inline-flex items-center justify-center border-2 border-tbf-gold/50 text-white hover:bg-tbf-gold/10 font-bold text-base px-8 py-4 rounded-none transition-colors w-full sm:w-auto"
              >
                Call (973) 240-8759
              </a>
            </div>
          </div>

          <p className="text-white/50 text-sm">
            Follow us on social media for the latest updates on availability.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="booking-wizard" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            Easy Online Booking
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide uppercase">
            BOOK YOUR <span className="text-tbf-gold">PRIVATE LESSON</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Complete your booking in just a few simple steps. Select your package, choose your dates and times, and secure your spot with our expert trainer Kevin Houston.
          </p>
        </div>

        {/* Stepper - scroll anchor */}
        <div ref={stepperRef} className="mb-12 scroll-mt-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => goToStep(step.number)}
                    disabled={step.number > currentStep && currentStep !== 7}
                    className={`
                      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm
                      transition-all duration-300 mb-2 border-2
                      ${step.number < currentStep
                        ? 'bg-tbf-gold border-tbf-gold text-black cursor-pointer'
                        : step.number === currentStep
                        ? 'bg-tbf-gold border-tbf-gold text-black'
                        : 'bg-black border-white/30 text-white/50 cursor-not-allowed'}
                      ${step.number <= currentStep || currentStep === 7 ? 'hover:scale-110' : ''}
                    `}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      step.number
                    )}
                  </button>
                  <div className="text-center hidden sm:block">
                    <p className={`text-xs font-bold ${
                      step.number <= currentStep ? 'text-white' : 'text-white/50'
                    }`}>
                      {step.title}
                    </p>
                    <p className={`text-xs ${
                      step.number <= currentStep ? 'text-white/60' : 'text-white/30'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    h-0.5 flex-1 transition-all duration-300 mx-1 sm:mx-2
                    ${step.number < currentStep ? 'bg-tbf-gold' : 'bg-white/30'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="sm:hidden text-center mt-4">
            <p className="text-tbf-gold text-sm font-bold">
              Step {currentStep}: {steps[currentStep - 1]?.title}
            </p>
            <p className="text-white/50 text-xs">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <StepOne
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={nextStep}
                />
              )}
              {currentStep === 2 && (
                <StepTwo
                  bookingData={bookingData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 3 && (
                <StepThree
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 4 && (
                <StepFour
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 5 && (
                <StepFive
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 6 && (
                <StepSix
                  bookingData={bookingData}
                  updateBookingData={updateBookingData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
              )}
              {currentStep === 7 && (
                <StepSeven bookingData={bookingData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
