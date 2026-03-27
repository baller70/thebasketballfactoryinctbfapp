'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Calendar as CalendarIcon, Clock, Info } from 'lucide-react'
import { BookingData } from '../booking-wizard'
import { format } from 'date-fns'

const availableTimes = [
  { day: 'Monday', slots: ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'] },
  { day: 'Tuesday', slots: ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'] },
]

interface StepThreeProps {
  bookingData: BookingData
  updateBookingData: (data: Partial<BookingData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function StepThree({ bookingData, updateBookingData, nextStep, prevStep }: StepThreeProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(bookingData.selectedDates || [])
  const [selectedTimes, setSelectedTimes] = useState<string[]>(bookingData.selectedTimes || [])
  const [currentDate, setCurrentDate] = useState<Date | undefined>()

  // Cap sessions to schedule upfront
  const getSessionsToSchedule = () => {
    switch (bookingData.lessonType) {
      case 'individual': return 1
      case '10-pack': return 3
      case '20-pack': return 3
      case 'elite': return 1
      default: return 1
    }
  }
  const sessionsNeeded = getSessionsToSchedule()

  const isMultiPack = bookingData.lessonType === '10-pack' || bookingData.lessonType === '20-pack'

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    const dayName = format(date, 'EEEE')
    const isAvailable = availableTimes.some(d => d.day === dayName)

    if (!isAvailable) {
      return // Don't allow selection of unavailable days
    }

    setCurrentDate(date)

    // If date is already selected, remove it and its associated time
    const dateIndex = selectedDates.findIndex(d =>
      format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )

    if (dateIndex !== -1) {
      const newDates = [...selectedDates]
      const newTimes = [...selectedTimes]
      newDates.splice(dateIndex, 1)
      newTimes.splice(dateIndex, 1)
      setSelectedDates(newDates)
      setSelectedTimes(newTimes)
    } else if (selectedDates.length < sessionsNeeded) {
      // Add the date but don't add time yet
      setSelectedDates([...selectedDates, date])
    }
  }

  const handleTimeSelect = (time: string) => {
    if (!currentDate) return

    const dateIndex = selectedDates.findIndex(d =>
      format(d, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd')
    )

    if (dateIndex !== -1) {
      const newTimes = [...selectedTimes]
      newTimes[dateIndex] = time
      setSelectedTimes(newTimes)
    }
  }

  const handleContinue = () => {
    if (selectedDates.length === sessionsNeeded && selectedTimes.length === sessionsNeeded) {
      updateBookingData({
        selectedDates,
        selectedTimes
      })
      nextStep()
    }
  }

  const isDayAvailable = (date: Date) => {
    const dayName = format(date, 'EEEE')
    return availableTimes.some(d => d.day === dayName)
  }

  const isDaySelected = (date: Date) => {
    return selectedDates.some(d => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
  }

  const getAvailableTimesForDate = (date: Date) => {
    const dayName = format(date, 'EEEE')
    const daySlots = availableTimes.find(d => d.day === dayName)
    return daySlots?.slots || []
  }

  const currentDateIndex = currentDate
    ? selectedDates.findIndex(d => format(d, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd'))
    : -1

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
          SELECT YOUR <span className="text-tbf-gold">DATES & TIMES</span>
        </h3>
        <p className="text-white/80 max-w-2xl mx-auto mb-4">
          Choose {sessionsNeeded} {sessionsNeeded === 1 ? 'date' : 'dates'} and {sessionsNeeded === 1 ? 'time' : 'times'} for your training {sessionsNeeded === 1 ? 'session' : 'sessions'} with Kevin Houston.
        </p>
        {isMultiPack && (
          <div className="inline-block bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg px-4 py-2 mb-2">
            <p className="text-tbf-gold/90 text-sm">
              Schedule your first {sessionsNeeded} sessions now. Remaining sessions can be scheduled after each visit or in batches.
            </p>
          </div>
        )}
        <div className="inline-block bg-tbf-gold/20 border border-tbf-gold/50 rounded-lg px-4 py-2">
          <p className="text-tbf-gold font-semibold text-sm">
            {selectedDates.length} of {sessionsNeeded} {sessionsNeeded === 1 ? 'session' : 'sessions'} scheduled
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Calendar */}
        <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-5 h-5 text-tbf-gold" />
            <h4 className="text-white font-bold font-audiowide uppercase">SELECT DATES</h4>
          </div>

          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)
              return date < today || !isDayAvailable(date)
            }}
            modifiers={{
              selected: (date) => isDaySelected(date),
              available: (date) => isDayAvailable(date)
            }}
            modifiersStyles={{
              selected: {
                backgroundColor: '#FFD700',
                color: '#000'
              }
            }}
            className="rounded-md border-none"
          />

          <div className="mt-6 bg-tbf-gold/10 border border-tbf-gold/30 rounded p-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
              <div className="text-xs text-white/70">
                <p className="font-semibold text-white mb-1">Training Schedule:</p>
                <p>Monday: 4PM-8PM (4 slots)</p>
                <p>Tuesday: 4PM-8PM (4 slots)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Dates & Times */}
        <div className="space-y-4">
          <div className="bg-black/50 border border-tbf-gold/30 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-tbf-gold" />
              <h4 className="text-white font-bold font-audiowide uppercase">YOUR SCHEDULE</h4>
            </div>

            {selectedDates.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60 text-sm">
                  Select a date from the calendar to begin scheduling
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDates.map((date, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 transition-all ${
                      currentDate && format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? 'border-tbf-gold bg-tbf-gold/10'
                        : 'border-white/20 bg-black/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-white font-semibold">Session {index + 1}</p>
                        <p className="text-white/70 text-sm">
                          {format(date, 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDateSelect(date)}
                        className="text-tbf-gold hover:text-tbf-gold/70 text-xs"
                      >
                        Remove
                      </button>
                    </div>

                    {currentDate && format(currentDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && (
                      <div className="space-y-2">
                        <p className="text-white/70 text-xs font-semibold">Select time:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {getAvailableTimesForDate(date).map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelect(time)}
                              className={`
                                text-xs py-2 px-3 rounded border transition-all
                                ${selectedTimes[index] === time
                                  ? 'bg-tbf-gold text-black border-tbf-gold font-semibold'
                                  : 'bg-black/50 text-white border-white/30 hover:border-tbf-gold/50'}
                              `}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTimes[index] && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-tbf-gold text-sm font-semibold">
                          &#10003; Scheduled for {selectedTimes[index]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {selectedDates.length < sessionsNeeded && selectedDates.length > 0 && (
              <div className="mt-4 text-center text-white/60 text-sm">
                Select {sessionsNeeded - selectedDates.length} more {sessionsNeeded - selectedDates.length === 1 ? 'date' : 'dates'}
              </div>
            )}
          </div>
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
          disabled={selectedDates.length !== sessionsNeeded || selectedTimes.length !== sessionsNeeded}
          className="bg-tbf-gold-bright hover:bg-tbf-gold-bright/90 text-black font-bold px-12 py-6 text-lg rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Your Information
        </Button>
      </div>
    </div>
  )
}
