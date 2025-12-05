
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import StepOne from './step-one'
import StepTwo from './step-two'
import StepThree from './step-three'
import StepFour from './step-four'
import StepFive from './step-five'
import StepSix from './step-six'
import StepSeven from './step-seven'

export interface YouthBookingData {
  selectedDate: string
  selectedTime: string
  parentName: string
  parentEmail: string
  parentPhone: string
  childName: string
  childAge: string
  childGrade: string
  schoolName: string
  basketballExperience: string
  childInterests: string
  emergencyContact: string
  emergencyPhone: string
  medicalInfo: string
  agreementSigned: boolean
  bookingId?: string
}

const steps = [
  { number: 1, title: 'Choose Session', description: 'Pick a date' },
  { number: 2, title: 'Parent Info', description: 'Your contact details' },
  { number: 3, title: 'Child Info', description: 'About your child' },
  { number: 4, title: 'Experience', description: 'Basketball background' },
  { number: 5, title: 'Emergency Contact', description: 'Safety first' },
  { number: 6, title: 'Agree & Confirm', description: 'Final step' },
  { number: 7, title: 'All Set!', description: 'You\'re registered' }
]

export default function FreeYouthBookingWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<YouthBookingData>({
    selectedDate: '',
    selectedTime: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    childGrade: '',
    schoolName: '',
    basketballExperience: '',
    childInterests: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalInfo: '',
    agreementSigned: false
  })

  const updateBookingData = (data: Partial<YouthBookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step <= currentStep || step === 1) {
      setCurrentStep(step)
    }
  }

  return (
    <section id="booking-wizard" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-6 py-3 mb-6 bg-gradient-to-r from-[#C8B273] to-yellow-600 rounded-full"
          >
            <span className="text-black font-bold text-lg">FREE Sign-Up - Takes 2 Minutes</span>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-white">RESERVE YOUR CHILD'S </span>
            <span className="bg-gradient-to-r from-[#C8B273] to-yellow-600 bg-clip-text text-transparent">
              FREE SPOT
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete this quick form to secure your spot. No payment required – it's 100% FREE!
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <button
                  onClick={() => goToStep(step.number)}
                  disabled={step.number > currentStep}
                  className={`relative flex flex-col items-center group ${
                    step.number > currentStep ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      step.number < currentStep
                        ? 'bg-gradient-to-r from-[#C8B273] to-yellow-600 text-black'
                        : step.number === currentStep
                        ? 'bg-gradient-to-r from-[#C8B273] to-yellow-600 text-black ring-4 ring-[#C8B273]/30'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {step.number < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="absolute -bottom-12 text-center w-24">
                    <p
                      className={`text-xs font-semibold ${
                        step.number <= currentStep ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </button>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2">
                    <div
                      className={`h-full rounded transition-all duration-300 ${
                        step.number < currentStep
                          ? 'bg-gradient-to-r from-[#C8B273] to-yellow-600'
                          : 'bg-gray-700'
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <StepOne
                  data={bookingData}
                  updateData={updateBookingData}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <StepTwo
                  data={bookingData}
                  updateData={updateBookingData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 3 && (
                <StepThree
                  data={bookingData}
                  updateData={updateBookingData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 4 && (
                <StepFour
                  data={bookingData}
                  updateData={updateBookingData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 5 && (
                <StepFive
                  data={bookingData}
                  updateData={updateBookingData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 6 && (
                <StepSix
                  data={bookingData}
                  updateData={updateBookingData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 7 && <StepSeven data={bookingData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
