
'use client'

import { Calendar, Clock, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { YouthBookingData } from './youth-booking-wizard'

interface StepOneProps {
  data: YouthBookingData
  updateData: (data: Partial<YouthBookingData>) => void
  onNext: () => void
}

export default function StepOne({ data, updateData, onNext }: StepOneProps) {
  const sessions = [
    { 
      date: 'December 28, 2025', 
      time: '10:00 AM - 11:00 AM', 
      spots: 'Available',
      spotsLeft: 15
    },
    { 
      date: 'January 12, 2026', 
      time: '10:00 AM - 11:00 AM', 
      spots: 'Available',
      spotsLeft: 15
    }
  ]

  const handleSessionSelect = (date: string, time: string) => {
    updateData({ selectedDate: date, selectedTime: time })
  }

  const handleContinue = () => {
    if (data.selectedDate && data.selectedTime) {
      onNext()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="text-3xl font-bold text-white mb-4">CHOOSE YOUR FREE SESSION</h3>
        <p className="text-lg text-gray-300">
          Select the Saturday morning that works best for your family. Each session is 1 hour.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {sessions.map((session, index) => (
          <button
            key={index}
            onClick={() => handleSessionSelect(session.date, session.time)}
            className={`w-full p-6 rounded-xl border-2 transition-all duration-300 text-left ${
              data.selectedDate === session.date
                ? 'border-[#C8B273] bg-[#C8B273]/10'
                : 'border-gray-700 bg-white/5 hover:border-[#C8B273]/50'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-[#C8B273]" />
                  <p className="text-xl font-bold text-white">{session.date}</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-300">{session.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-300">The Basketball Factory, Sparta NJ</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  session.spots === 'Available' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {session.spots}
                </span>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{session.spotsLeft} spots left</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleContinue}
          disabled={!data.selectedDate || !data.selectedTime}
          size="lg"
          className="bg-gradient-to-r from-[#C8B273] to-yellow-600 hover:from-[#B89F5F] hover:to-yellow-500 text-black font-bold px-12 py-6 text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Parent Information
        </Button>
      </div>
    </div>
  )
}
