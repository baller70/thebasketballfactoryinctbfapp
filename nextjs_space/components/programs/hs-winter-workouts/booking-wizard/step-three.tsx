
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Check } from 'lucide-react'
import { ProgramBookingData } from './program-booking-wizard'

interface StepThreeProps {
  bookingData: ProgramBookingData
  updateBookingData: (data: Partial<ProgramBookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

const sundayTrackDates = [
  { date: '2025-12-07', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 1' },
  { date: '2026-01-04', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 2' },
  { date: '2026-01-11', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 3' },
  { date: '2026-01-18', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 4' },
  { date: '2026-01-25', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 5' },
  { date: '2026-02-01', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 6' },
  { date: '2026-02-08', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 7' },
  { date: '2026-02-10', day: 'Sunday', time: '11:30 AM - 1:00 PM', week: 'Week 7' },
]

const mondayTrackDates = [
  { date: '2026-01-05', day: 'Monday', time: '8:00 PM - 9:00 PM', week: 'Week 2' },
  { date: '2026-01-12', day: 'Monday', time: '8:00 PM - 9:00 PM', week: 'Week 3' },
  { date: '2026-01-19', day: 'Monday', time: '8:00 PM - 9:00 PM', week: 'Week 4' },
  { date: '2026-01-26', day: 'Monday', time: '8:00 PM - 9:00 PM', week: 'Week 5' },
  { date: '2026-02-02', day: 'Monday', time: '8:00 PM - 9:00 PM', week: 'Week 6' },
  { date: '2026-02-09', day: 'Monday', time: '8:00 PM - 9:00 PM', week: 'Week 7' },
  { date: '2026-02-10', day: 'Monday', time: '8:00 PM - 9:00 PM', week: 'Week 7' },
]

export default function StepThree({ bookingData, updateBookingData, nextStep, prevStep }: StepThreeProps) {
  const isFullProgram = bookingData.sessionOption === 'full-program'
  const [selectedTrack, setSelectedTrack] = React.useState<'both' | null>(null)

  const selectBothTracks = () => {
    setSelectedTrack('both')
    const allDates = [...sundayTrackDates, ...mondayTrackDates].map(d => d.date)
    updateBookingData({ selectedDates: allDates })
  }

  const toggleDate = (date: string) => {
    if (isFullProgram) {
      // For full program, all dates in the track are selected
      return
    }
    
    const newDates = bookingData.selectedDates.includes(date)
      ? bookingData.selectedDates.filter(d => d !== date)
      : [...bookingData.selectedDates, date]
    
    updateBookingData({ selectedDates: newDates })
  }

  const handleContinue = () => {
    if ((isFullProgram && selectedTrack) || bookingData.selectedDates.length > 0) {
      nextStep()
    }
  }

  const formatDate = (dateString: string) => {
    // Parse date string as local time to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get current dates to display based on Full Program or Pay As You Go
  const getDatesToDisplay = () => {
    if (isFullProgram) {
      // For Full Program, show all dates from both tracks
      return [...sundayTrackDates, ...mondayTrackDates].sort((a, b) => a.date.localeCompare(b.date))
    }
    // For Pay As You Go, show all dates from both tracks
    return [...sundayTrackDates, ...mondayTrackDates].sort((a, b) => a.date.localeCompare(b.date))
  }

  const displayDates = getDatesToDisplay()

  // Auto-select all dates for full program
  React.useEffect(() => {
    if (isFullProgram && !selectedTrack) {
      selectBothTracks()
    }
  }, [isFullProgram])

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide">
          {isFullProgram ? 'YOUR PROGRAM' : 'SELECT YOUR'} <span className="text-[#C8B273]">SESSIONS</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto">
          {isFullProgram 
            ? 'Full program includes ALL 15 sessions (8 Sundays + 7 Mondays). Both Sunday Track (90 min) and Monday Track (60 min) sessions are included.'
            : 'Choose which session you\'d like to attend. Drop-in sessions are available on any of the dates below.'
          }
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {isFullProgram && (
          <div className="bg-[#C8B273]/10 border-2 border-[#C8B273] rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-white font-audiowide mb-2">Full Program - 15 Sessions</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-[#C8B273] font-semibold">Sunday Sessions (8 total)</p>
                    <p className="text-white/70 text-sm">11:30 AM - 1:00 PM (90 minutes)</p>
                  </div>
                  <div>
                    <p className="text-[#C8B273] font-semibold">Monday Sessions (7 total)</p>
                    <p className="text-white/70 text-sm">8:00 PM - 9:00 PM (60 minutes)</p>
                  </div>
                </div>
              </div>
              <div className="w-6 h-6 bg-[#C8B273] rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-black" />
              </div>
            </div>
            <p className="text-white/60 text-sm">Dec 7, 2025 - Feb 10, 2026</p>
          </div>
        )}

        {!isFullProgram && (
          <div className="bg-[#C8B273]/10 border border-[#C8B273]/30 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C8B273]" />
              <p className="text-white font-semibold">
                Select your drop-in session date from either track
              </p>
            </div>
          </div>
        )}

        {/* Show schedule after track selection for Full Program OR for Pay As You Go */}
        {((isFullProgram && selectedTrack) || !isFullProgram) && (
          <div className="space-y-4">
            <h4 className="text-white font-bold text-center mb-4 font-audiowide">
              {isFullProgram ? 'YOUR SCHEDULE' : 'AVAILABLE SESSIONS'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayDates.map((session) => {
                const isSelected = isFullProgram || bookingData.selectedDates.includes(session.date)
                
                return (
                  <button
                    key={session.date}
                    onClick={() => !isFullProgram && toggleDate(session.date)}
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
                        <p className="text-[#C8B273] text-sm font-semibold mt-1">{session.time}</p>
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
        )}
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
          disabled={(isFullProgram && !selectedTrack) || (!isFullProgram && bookingData.selectedDates.length === 0)}
          className="bg-[#C8B273] hover:bg-[#B8A263] text-black font-bold px-12 py-6 text-lg rounded-none"
        >
          Continue to Parent Info
        </Button>
      </div>
    </div>
  )
}
