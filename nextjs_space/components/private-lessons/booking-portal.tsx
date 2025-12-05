
'use client'

import { useState } from 'react'
import { Calendar, Clock, MapPin, User, Mail, Phone, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import toast from 'react-hot-toast'

const timeSlots = [
  '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'
]

const packages = [
  'Individual Session ($85)',
  '10-Pack Lessons ($750)',
  '20-Pack Lessons ($1,300)',
  'All-Inclusive Elite (Custom Pricing)'
]

export default function BookingPortal() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    athleteName: '',
    athleteAge: '',
    package: '',
    preferredDate: '',
    preferredTime: '',
    skillLevel: '',
    notes: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Booking request submitted! We\'ll contact you within 24 hours to confirm your session.')
      
      // Reset form
      setFormData({
        parentName: '',
        email: '',
        phone: '',
        athleteName: '',
        athleteAge: '',
        package: '',
        preferredDate: '',
        preferredTime: '',
        skillLevel: '',
        notes: ''
      })
    } catch (error) {
      toast.error('Something went wrong. Please try again or call us at (973) 240-8759')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section id="booking-portal" className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
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
            Select your preferred package, date, and time below. We'll confirm your booking within 24 hours and send you all the details for your first session at our Sparta, NJ facility.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Trainer Info Card */}
          <div className="space-y-6">
            <div className="bg-black border-2 border-tbf-gold rounded-lg p-8">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-tbf-gold">
                  <Image
                    src="/kevin-houston-professional-basketball-trainer.jpg"
                    alt="Kevin Houston - Mr. Basic Basketball Trainer"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white font-audiowide uppercase">KEVIN HOUSTON</h3>
                  <p className="text-tbf-gold font-semibold">"Mr. Basic"</p>
                  <p className="text-white/70 text-sm">Head Trainer & Director</p>
                </div>
              </div>

              <div className="space-y-4 text-white/80">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Location</p>
                    <p className="text-sm">38 Station Rd, Sparta, NJ 07871</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Available Hours</p>
                    <p className="text-sm">Monday-Thursday: 3PM-8PM</p>
                    <p className="text-sm">Friday-Saturday: Closed</p>
                    <p className="text-sm">Sunday: 11AM-7PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-white">Experience</p>
                    <p className="text-sm">15+ years training youth athletes</p>
                    <p className="text-sm">200+ athletes trained in Sussex County</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-tbf-gold/30">
                <p className="text-white/90 text-sm leading-relaxed italic">
                  "I'm committed to helping every young athlete in Sparta reach their full potential. My private lessons focus on fundamentals, basketball IQ, and building the confidence needed to excel on and off the court."
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-6">
              <h4 className="text-white font-bold text-lg mb-4 font-audiowide uppercase">What to Expect at Your First Lesson:</h4>
              <ul className="space-y-2 text-white/80 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold">•</span>
                  <span>Comprehensive skill assessment (shooting, dribbling, defense)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold">•</span>
                  <span>Discussion of goals with athlete and parent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold">•</span>
                  <span>Customized training plan creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold">•</span>
                  <span>Hands-on skill development drills</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tbf-gold">•</span>
                  <span>Progress tracking setup for future sessions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-gradient-to-b from-gray-900 to-black border-2 border-tbf-gold/30 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Parent Information */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2 uppercase">
                  <User className="w-5 h-5 text-tbf-gold" />
                  Parent/Guardian Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="parentName" className="text-white/90 mb-2 block">
                      Parent Name <span className="text-tbf-gold">*</span>
                    </Label>
                    <Input
                      id="parentName"
                      value={formData.parentName}
                      onChange={(e) => handleChange('parentName', e.target.value)}
                      placeholder="John Smith"
                      required
                      className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-white/90 mb-2 block">
                        Email <span className="text-tbf-gold">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="john@email.com"
                        required
                        className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-white/90 mb-2 block">
                        Phone <span className="text-tbf-gold">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="(973) 240-8759"
                        required
                        className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Athlete Information */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2 uppercase">
                  <User className="w-5 h-5 text-tbf-gold" />
                  Athlete Information
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="athleteName" className="text-white/90 mb-2 block">
                        Athlete Name <span className="text-tbf-gold">*</span>
                      </Label>
                      <Input
                        id="athleteName"
                        value={formData.athleteName}
                        onChange={(e) => handleChange('athleteName', e.target.value)}
                        placeholder="Michael Smith"
                        required
                        className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                      />
                    </div>

                    <div>
                      <Label htmlFor="athleteAge" className="text-white/90 mb-2 block">
                        Age <span className="text-tbf-gold">*</span>
                      </Label>
                      <Input
                        id="athleteAge"
                        type="number"
                        min="7"
                        max="18"
                        value={formData.athleteAge}
                        onChange={(e) => handleChange('athleteAge', e.target.value)}
                        placeholder="12"
                        required
                        className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="skillLevel" className="text-white/90 mb-2 block">
                      Current Skill Level <span className="text-tbf-gold">*</span>
                    </Label>
                    <Select value={formData.skillLevel} onValueChange={(value) => handleChange('skillLevel', value)} required>
                      <SelectTrigger className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold">
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-tbf-gold/30">
                        <SelectItem value="beginner" className="text-white hover:bg-tbf-gold/20">Beginner (Just starting)</SelectItem>
                        <SelectItem value="intermediate" className="text-white hover:bg-tbf-gold/20">Intermediate (Rec/Travel experience)</SelectItem>
                        <SelectItem value="advanced" className="text-white hover:bg-tbf-gold/20">Advanced (School team/Competitive)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Session Details */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-audiowide flex items-center gap-2 uppercase">
                  <Calendar className="w-5 h-5 text-tbf-gold" />
                  Session Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="package" className="text-white/90 mb-2 block">
                      Select Package <span className="text-tbf-gold">*</span>
                    </Label>
                    <Select value={formData.package} onValueChange={(value) => handleChange('package', value)} required>
                      <SelectTrigger className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold">
                        <SelectValue placeholder="Choose a package" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-tbf-gold/30">
                        {packages.map((pkg) => (
                          <SelectItem key={pkg} value={pkg} className="text-white hover:bg-tbf-gold/20">
                            {pkg}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="preferredDate" className="text-white/90 mb-2 block">
                        Preferred Date <span className="text-tbf-gold">*</span>
                      </Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => handleChange('preferredDate', e.target.value)}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold"
                      />
                    </div>

                    <div>
                      <Label htmlFor="preferredTime" className="text-white/90 mb-2 block">
                        Preferred Time <span className="text-tbf-gold">*</span>
                      </Label>
                      <Select value={formData.preferredTime} onValueChange={(value) => handleChange('preferredTime', value)} required>
                        <SelectTrigger className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-tbf-gold/30">
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time} className="text-white hover:bg-tbf-gold/20">
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <Label htmlFor="notes" className="text-white/90 mb-2 block flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-tbf-gold" />
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Tell us about your goals, specific areas to work on, or any questions you have..."
                  rows={4}
                  className="bg-black/50 border-tbf-gold/30 text-white focus:border-tbf-gold resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg py-6 rounded-none"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Booking Request'}
              </Button>

              <p className="text-white/60 text-xs text-center">
                By submitting this form, you agree to be contacted by The Basketball Factory regarding your private lesson inquiry. We typically respond within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
