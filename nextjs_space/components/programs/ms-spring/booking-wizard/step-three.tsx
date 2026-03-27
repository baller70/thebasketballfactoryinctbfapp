
'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Check } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'

interface StepThreeProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

const programDates = [
  { date: '2026-04-07', day: 'Tuesday', week: 'Week 1' },
  { date: '2026-04-14', day: 'Tuesday', week: 'Week 2' },
  { date: '2026-04-21', day: 'Tuesday', week: 'Week 3' },
  { date: '2026-04-28', day: 'Tuesday', week: 'Week 4' },
  { date: '2026-05-05', day: 'Tuesday', week: 'Week 5' },
  { date: '2026-05-12', day: 'Tuesday', week: 'Week 6' },
  { date: '2026-05-19', day: 'Tuesday', week: 'Week 7' },
  { date: '2026-05-26', day: 'Tuesday', week: 'Week 8' },
]

export default function StepThree({ bookingData, updateBookingData, nextStep, prevStep }: StepThreeProps) {
  const isFullProgram = bookingData.sessionOption === 'full-program'

  const toggleDate = (date: string) => {
    if (isFullProgram) {
      // For full program, all dates are selected
      return
    }
    
    const newDates = bookingData.selectedDates.includes(date)
      ? bookingData.selectedDates.filter(d => d !== date)
      : [...bookingData.selectedDates, date]
    
    updateBookingData({ selectedDates: newDates })
  }

  const handleContinue = () => {
    if (isFullProgram || bookingData.selectedDates.length > 0) {
      nextStep()
    }
  }

  const formatDate = (dateString: string) => {
    // Parse date string as local time to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          {isFullProgram ? 'CONFIRM YOUR' : 'SELECT YOUR'} <span className="text-[#C8B273]">SESSION DATES</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          {isFullProgram 
            ? 'You\'re registered for all 16 sessions (8 weeks). Review the complete schedule below.'
            : 'Choose which session you\'d like to attend. Drop-in sessions are available on any of the dates below.'
          }
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {isFullProgram && (
          <div className="bg-[#C8B273]/10 border border-[#C8B273]/30 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-[#C8B273]" />
              <p className="text-white font-semibold">
                All 16 sessions are included in your Full Program registration
              </p>
            </div>
            <p className="text-white/70 text-sm">
              Sessions run every Tuesday. Grades 2nd - 6th: 5:00 - 6:30 PM. Grades 7th - 8th: 6:30 - 8:00 PM.
            </p>
          </div>
        )}

        {!isFullProgram && (
          <div className="bg-[#C8B273]/10 border border-[#C8B273]/30 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C8B273]" />
              <p className="text-white font-semibold">
                Select your drop-in session date
              </p>
            </div>
          </div>
        )}

        {/* Date Grid */}
        <div className="space-y-6">
          {[...new Set(programDates.map(d => d.week))].map(week => (
            <div key={week}>
              <h4 className="text-white font-bold mb-3 font-audiowide">{week}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {programDates
                  .filter(d => d.week === week)
                  .map((session) => {
                    const isSelected = isFullProgram || bookingData.selectedDates.includes(session.date)
                    
                    return (
                      <button
                        key={session.date}
                        onClick={() => toggleDate(session.date)}
                        disabled={isFullProgram}
                        className={`
                          p-4 rounded-lg border-2 text-left transition-all duration-300
                          ${isSelected
                            ? 'bg-[#C8B273]/10 border-[#C8B273] shadow-lg shadow-[#C8B273]/20'
                            : 'bg-black/50 border-white/20 hover:border-[#C8B273]/50'}
                          ${isFullProgram ? 'cursor-default' : 'cursor-pointer'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-semibold">{session.day}</p>
                            <p className="text-white/60 text-sm">{formatDate(session.date)}</p>
                            <p className="text-[#C8B273] text-sm font-semibold mt-1">5:00 PM - 8:00 PM</p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-[#C8B273] rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 text-black" />
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
              </div>
            </div>
          ))}
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
          disabled={!isFullProgram && bookingData.selectedDates.length === 0}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none"
        >
          Continue to Parent Info
        </Button>
      </div>
    </div>
  )
}
