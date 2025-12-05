
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, ChevronUp, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BookingForm from './booking-form'

const paymentOptions = [
  {
    id: 'full',
    title: 'Pay in Full',
    description: 'Pay for the entire program upfront and save',
    benefits: [
      'Secure your spot for all 10 sessions',
      'Priority booking for future programs',
      'One-time payment, no recurring charges',
      'Best value option'
    ]
  },
  {
    id: 'payg',
    title: 'Pay As You Go (P.A.Y.G)',
    description: 'Flexible payment - pay for sessions as you attend',
    benefits: [
      'Pay only for sessions you attend',
      'No long-term commitment required',
      'Perfect for trying out the program',
      'Cancel anytime without penalties'
    ]
  }
]

export default function HSFallBooking() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [expandedOption, setExpandedOption] = useState<string | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)

  const toggleExpand = (optionId: string) => {
    setExpandedOption(expandedOption === optionId ? null : optionId)
  }

  const handleSelectPayment = (optionId: string) => {
    setSelectedPayment(optionId)
    setShowBookingForm(true)
  }

  return (
    <section id="booking-section" className="relative py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
              Online Booking Portal
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide">
              BOOK YOUR <span className="text-tbf-gold">SPOT NOW</span>
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
              Our online booking portal makes signing up for the program incredibly easy, quick, and seamless—you can enroll in just a few clicks. Choose to pay for the program in full or select the convenient pay-as-you-go option below.
            </p>
          </motion.div>
        </div>

        {/* Payment Options */}
        {!showBookingForm && (
          <div className="max-w-5xl mx-auto mb-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-white mb-4 font-audiowide">
                2 <span className="text-tbf-gold">PAYMENT OPTIONS</span>
              </h3>
              <p className="text-white/70">
                Click on the calendar to choose your training dates
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paymentOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`
                    bg-gradient-to-br from-gray-900 to-black border-2 rounded-lg overflow-hidden
                    transition-all duration-300 cursor-pointer
                    ${expandedOption === option.id || selectedPayment === option.id
                      ? 'border-tbf-gold shadow-lg shadow-tbf-gold/20'
                      : 'border-tbf-gold/30 hover:border-tbf-gold/60'
                    }
                  `}
                >
                  {/* Option Header */}
                  <div
                    onClick={() => toggleExpand(option.id)}
                    className="p-6 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                        ${selectedPayment === option.id 
                          ? 'border-tbf-gold bg-tbf-gold' 
                          : 'border-tbf-gold/30'
                        }
                      `}>
                        {selectedPayment === option.id && (
                          <Check className="w-4 h-4 text-black" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white font-audiowide">
                          {option.title}
                        </h4>
                        <p className="text-white/60 text-sm mt-1">
                          {option.description}
                        </p>
                      </div>
                    </div>
                    {expandedOption === option.id ? (
                      <ChevronUp className="w-6 h-6 text-tbf-gold" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-tbf-gold" />
                    )}
                  </div>

                  {/* Expanded Content */}
                  {expandedOption === option.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-tbf-gold/30"
                    >
                      <div className="p-6 space-y-4">
                        {option.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                            <span className="text-white/80">{benefit}</span>
                          </div>
                        ))}
                        
                        <Button
                          onClick={() => handleSelectPayment(option.id)}
                          className="w-full bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg py-6 mt-6 rounded-none"
                        >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Select {option.title}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm">
                Have questions about payment options?{' '}
                <a href="#faq-section" className="text-tbf-gold hover:text-tbf-gold/80 underline">
                  Check our FAQ
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {showBookingForm && selectedPayment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <BookingForm 
              paymentType={selectedPayment}
              onBack={() => {
                setShowBookingForm(false)
                setSelectedPayment(null)
              }}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
