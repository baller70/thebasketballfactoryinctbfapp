
'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'
import StepFour from './step-four'
import StepFive from './step-five'
import StepSix from './step-six'
import StepSeven from './step-seven'

export type SessionOption = 'full-program' | 'single-session'

export interface ProgramBookingData {
  sessionOption: SessionOption
  pricingInfo: {
    price: number // Total amount to charge (including processing fee)
    programFee?: number // Original program fee
    processingFee?: number // Credit card processing fee
    sessionCount: number
    pricePerSession: number
  }
  selectedDates: string[]
  parentName: string
  parentEmail: string
  parentPhone: string
  playerName: string
  playerAge: string
  playerGrade: string
  schoolName: string
  trainingGoals: string
  skillLevel: string
  medicalInfo: string
  emergencyContact: string
  emergencyPhone: string
  agreementSigned: boolean
  paymentIntentId?: string
  bookingId?: string
}

const steps = [
  { number: 1, title: 'Program Option', description: 'Choose sessions' },
  { number: 2, title: 'Pricing Info', description: 'Review details' },
  { number: 3, title: 'Session Dates', description: 'Select schedule' },
  { number: 4, title: 'Your Information', description: 'Contact & player info' },
  { number: 5, title: 'Additional Details', description: 'Skill & emergency' },
  { number: 6, title: 'Agreement', description: 'Sign & Pay' },
  { number: 7, title: 'Confirmed', description: 'You\'re registered' }
]

export default function ProgramBookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const stepperRef = useRef<HTMLDivElement>(null)
  const [bookingData, setBookingData] = useState<ProgramBookingData>({
    sessionOption: 'full-program',
    pricingInfo: {
      price: 350,
      sessionCount: 8,
      pricePerSession: 43.75
    },
    selectedDates: [],
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    playerName: '',
    playerAge: '',
    playerGrade: 'grade-9',
    schoolName: '',
    trainingGoals: '',
    skillLevel: 'intermediate',
    medicalInfo: '',
    emergencyContact: '',
    emergencyPhone: '',
    agreementSigned: false
  })

  const updateBookingData = (data: Partial<ProgramBookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const scrollToWizard = () => {
    const wizardElement = document.getElementById('booking-wizard')
    if (wizardElement) {
      wizardElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }


  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
      setTimeout(scrollToWizard, 100)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setTimeout(scrollToWizard, 100)
    }
  }

  const scrollToStepper = useCallback(() => {
    requestAnimationFrame(() => {
      stepperRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
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
      setTimeout(scrollToWizard, 100)
    }
  }

  return (
    <section id="booking-wizard" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#C8B273] text-sm font-bold tracking-wider uppercase mb-4 block">
            Easy Registration Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide">
            REGISTER FOR <span className="text-[#C8B273]">SPRING CIRCUIT</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Complete your registration in 7 simple steps. Select your package, provide player information, and secure your spot in our high school spring circuit.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <button
                    onClick={() => goToStep(step.number)}
                    disabled={step.number > currentStep && currentStep !== 7}
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                      transition-all duration-300 mb-2 border-2
                      ${step.number < currentStep 
                        ? 'bg-[#C8B273] border-[#C8B273] text-black cursor-pointer' 
                        : step.number === currentStep 
                        ? 'bg-[#C8B273] border-[#C8B273] text-black ' 
                        : 'bg-black border-white/30 text-white/50 cursor-not-allowed'}
                      ${step.number <= currentStep || currentStep === 7 ? 'hover:scale-110' : ''}
                    `}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </button>
                  
                  {/* Step Label */}
                  <div className={`text-center ${index < 6 ? 'hidden sm:block' : 'hidden lg:block'}`}>
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

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    h-0.5 flex-1 transition-all duration-300 mx-2
                    ${step.number < currentStep ? 'bg-[#C8B273]' : 'bg-white/30'}
                  `} />
                )}
              </div>
            ))}
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
