
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'

interface TryoutPopupProps {
  trigger?: 'time' | 'scroll' | 'exit'
  delay?: number // in seconds for time trigger
  scrollPercentage?: number // for scroll trigger
}

export default function TryoutPopup({ 
  trigger = 'time', 
  delay = 5,
  scrollPercentage = 50 
}: TryoutPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [showTestButton, setShowTestButton] = useState(false)
  const router = useRouter()

  // Check if we're in development mode
  useEffect(() => {
    setShowTestButton(process.env.NODE_ENV === 'development')
  }, [])

  useEffect(() => {
    // Show popup on every visit (no session storage check)
    if (trigger === 'time' && !hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        setHasShown(true)
      }, delay * 1000)

      return () => clearTimeout(timer)
    }

    if (trigger === 'scroll' && !hasShown) {
      const handleScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        if (scrolled >= scrollPercentage && !hasShown) {
          setIsOpen(true)
          setHasShown(true)
        }
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }

    if (trigger === 'exit' && !hasShown) {
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0 && !hasShown) {
          setIsOpen(true)
          setHasShown(true)
        }
      }

      document.addEventListener('mouseleave', handleMouseLeave)
      return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [trigger, delay, scrollPercentage, hasShown])

  const handleViewSchedule = () => {
    setIsOpen(false)
    router.push('/weekly-tryouts')
  }

  const handleTestPopup = () => {
    setIsOpen(true)
  }

  return (
    <>
      {/* Test button - only visible in development */}
      {showTestButton && (
        <button
          onClick={handleTestPopup}
          className="fixed bottom-4 right-4 z-50 bg-tbf-gold text-black px-4 py-2 rounded-lg shadow-lg hover:bg-tbf-gold/90 text-sm font-semibold"
          title="Test Popup (Dev Only)"
        >
          🧪 Test Popup
        </button>
      )}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white border-tbf-gold border-2 text-black p-0 overflow-hidden">
          <div className="relative">
            {/* Header Background */}
            <div className="bg-white p-6 text-center">
              <DialogHeader>
                <DialogTitle className="font-audiowide text-2xl md:text-3xl text-black uppercase tracking-wider">
                  Tryout Anytime! View Schedule
                </DialogTitle>
                <DialogDescription className="text-gray-700 text-base mt-2">
                  Take your game to the next level
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center space-y-3">
                <p className="text-gray-700 text-sm md:text-base">
                  We're hosting <span className="text-tbf-gold font-semibold">weekly tryouts</span> for all age groups!
                </p>
                
                <div className="bg-gray-100 p-4 rounded-lg border border-tbf-gold/30">
                  <p className="text-black font-semibold mb-2">Age Groups Available:</p>
                  <ul className="text-gray-700 text-sm space-y-1">
                    <li>• Elementary/Middle School (Grades 3-6)</li>
                    <li>• Middle School (Grades 7-8)</li>
                    <li>• High School (Grades 9-12)</li>
                  </ul>
                </div>

                <p className="text-gray-600 text-sm">
                  Select your preferred date and time from our weekly schedule
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleViewSchedule}
                  className="w-full bg-tbf-gold hover:bg-tbf-gold/90 text-black font-audiowide text-sm uppercase tracking-wider py-6"
                >
                  View Weekly Schedule & Register
                </Button>
                
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  className="w-full text-gray-700 hover:text-black hover:bg-gray-100"
                >
                  Maybe Later
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
