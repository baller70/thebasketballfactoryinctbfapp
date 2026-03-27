
'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { YouthBookingData } from './youth-booking-wizard'
import { CheckCircle, Calendar, Mail, MapPin, Heart, Gift } from 'lucide-react'
import confetti from 'canvas-confetti'

interface StepSevenProps {
  data: YouthBookingData
}

export default function StepSeven({ data }: StepSevenProps) {
  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C8B273', '#FFD700', '#FFFFFF']
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C8B273', '#FFD700', '#FFFFFF']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return (
    <div className="max-w-3xl mx-auto text-center">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="mb-8 flex justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#C8B273] to-yellow-600 rounded-full blur-2xl opacity-50" />
          <div className="relative bg-gradient-to-r from-[#C8B273] to-yellow-600 rounded-full p-6">
            <CheckCircle className="w-20 h-20 text-black" />
          </div>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 mb-6 bg-gradient-to-r from-[#C8B273] to-yellow-600 rounded-full">
          <Gift className="w-5 h-5 text-black" />
          <span className="text-black font-bold text-lg">Spot Reserved - 100% FREE!</span>
          <Gift className="w-5 h-5 text-black" />
        </div>

        <h3 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          You're All Set, {data.parentName?.split(' ')[0]}!
        </h3>
        <p className="text-xl text-gray-300 mb-4">
          🎉 {data.childName} is registered for the FREE youth basketball session!
        </p>
        <p className="text-lg text-gray-400 mb-12">
          We're excited to help your child discover the joy of basketball.
        </p>
      </motion.div>

      {/* Confirmation Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-[#C8B273]/30 rounded-xl mb-8"
      >
        <h4 className="text-2xl font-bold text-white mb-6">Session Details</h4>

        <div className="space-y-4 text-left">
          <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg">
            <Calendar className="w-6 h-6 text-[#C8B273] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">When</p>
              <p className="text-gray-300">{data.selectedDate}</p>
              <p className="text-gray-300">{data.selectedTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg">
            <MapPin className="w-6 h-6 text-[#C8B273] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">Where</p>
              <p className="text-gray-300">The Basketball Factory</p>
              <p className="text-gray-300">Sparta, NJ</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg">
            <Mail className="w-6 h-6 text-[#C8B273] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">Confirmation Sent To</p>
              <p className="text-gray-300">{data.parentEmail}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* What to Bring */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="p-6 bg-white/5 backdrop-blur-sm border border-[#C8B273]/20 rounded-xl mb-8"
      >
        <h4 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-[#C8B273]" />
          What to Bring on Session Day
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-300">
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="font-semibold text-white mb-1">✓ Athletic Clothes</p>
            <p className="text-sm">Comfortable sportswear</p>
          </div>
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="font-semibold text-white mb-1">✓ Sneakers</p>
            <p className="text-sm">Athletic shoes</p>
          </div>
          <div className="p-3 bg-black/40 rounded-lg">
            <p className="font-semibold text-white mb-1">✓ Water Bottle</p>
            <p className="text-sm">Stay hydrated!</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          We provide all basketballs and training equipment!
        </p>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-4"
      >
        <p className="text-gray-300">
          Check your email for a detailed confirmation with parking info, facility rules, and what to expect.
        </p>
        <p className="text-gray-300">
          Questions? Call us or reply to the confirmation email – we're here to help!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => window.location.href = '/'}
            size="lg"
            className="bg-gradient-to-r from-[#C8B273] to-yellow-600 hover:from-[#B89F5F] hover:to-yellow-500 text-black font-bold px-10 py-6 text-lg rounded-full"
          >
            Back to Home
          </Button>
          <Button
            onClick={() => window.location.href = '/fall-programs'}
            size="lg"
            variant="outline"
            className="border-2 border-[#C8B273] text-[#C8B273] hover:bg-[#C8B273] hover:text-black font-semibold px-10 py-6 text-lg rounded-full"
          >
            Explore Other Programs
          </Button>
        </div>
      </motion.div>

      {/* Thank You Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-12 p-6 bg-gradient-to-br from-[#C8B273]/10 to-yellow-600/5 border border-[#C8B273]/30 rounded-xl"
      >
        <p className="text-lg text-white font-semibold mb-2">
          Thank You for Trusting Us with {data.childName}'s Basketball Journey!
        </p>
        <p className="text-gray-300">
          We can't wait to meet your young athlete and share our love of the game. See you soon!
        </p>
        <p className="text-[#C8B273] font-bold mt-2">
          - Coach Kevin & The Basketball Factory Team
        </p>
      </motion.div>
    </div>
  )
}
