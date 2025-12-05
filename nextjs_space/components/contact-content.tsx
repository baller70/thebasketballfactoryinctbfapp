
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Clock, Send, Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-white">
      {/* Hero Section with Image */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/youth-basketball-skill-development-training.png"
            alt="The Basketball Factory Training"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 40%' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-end pb-16 text-center px-4">
          <h1 className="font-audiowide text-5xl md:text-7xl lg:text-8xl text-white mb-4 tracking-wider">
            CONTACT US
          </h1>
          <p className="font-saira text-xl md:text-2xl text-white/90 max-w-2xl">
            Questions about enrolling your child? We're here to help!
          </p>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="font-audiowide text-3xl md:text-4xl text-black mb-6">
                GET IN TOUCH
              </h2>
              <p className="font-saira text-lg text-gray-700 mb-8">
                Ready to enroll your child in Sparta, NJ's premier basketball training program? Have questions about our programs, schedules, or pricing? 
                We'd love to hear from you and help your child develop their basketball skills!
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-tbf-gold rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-audiowide text-lg text-black mb-1">EMAIL</h3>
                  <a href="mailto:khouston@thebasketballfactorynj.com" className="font-saira text-gray-700 hover:text-tbf-gold transition-colors">
                    khouston@thebasketballfactorynj.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-tbf-gold rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-audiowide text-lg text-black mb-1">PHONE</h3>
                  <a href="tel:+19732408759" className="font-saira text-gray-700 hover:text-tbf-gold transition-colors">
                    (973) 240-8759
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-tbf-gold rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-audiowide text-lg text-black mb-1">LOCATION</h3>
                  <p className="font-saira text-gray-700">
                    38 Station Rd<br />
                    Sparta, New Jersey 07871<br />
                    <span className="text-sm text-gray-600">Serving Sparta, NJ and Sussex County</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-tbf-gold rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-audiowide text-lg text-black mb-1">HOURS</h3>
                  <p className="font-saira text-gray-700">
                    Sunday - Monday: 11:00 AM - 7:00 PM<br />
                    Friday - Saturday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-6">
              <h3 className="font-audiowide text-xl text-black mb-4">FOLLOW US</h3>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black hover:bg-tbf-gold rounded-full flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black hover:bg-tbf-gold rounded-full flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black hover:bg-tbf-gold rounded-full flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-6 h-6 text-white" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="font-audiowide text-2xl text-black mb-6">SEND US A MESSAGE</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="font-saira text-sm font-semibold text-gray-700 mb-2 block">
                  Full Name *
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full font-saira"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="font-saira text-sm font-semibold text-gray-700 mb-2 block">
                  Email Address *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full font-saira"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="phone" className="font-saira text-sm font-semibold text-gray-700 mb-2 block">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full font-saira"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label htmlFor="subject" className="font-saira text-sm font-semibold text-gray-700 mb-2 block">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full font-saira"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="font-saira text-sm font-semibold text-gray-700 mb-2 block">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full min-h-[150px] font-saira"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-tbf-gold hover:bg-tbf-gold/90 text-black font-audiowide text-lg py-6"
              >
                <Send className="w-5 h-5 mr-2" />
                SEND MESSAGE
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-audiowide text-3xl md:text-4xl text-black mb-4">
            FIND US
          </h2>
          <p className="font-saira text-lg text-gray-700 mb-8">
            Visit our facility at 38 Station Rd, Sparta, New Jersey 07871
          </p>
          <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.8193951845194!2d-74.6386!3d41.0318!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c3a3e5f5f5f5f5%3A0x0!2s38%20Station%20Rd%2C%20Sparta%2C%20NJ%2007871!5e0!3m2!1sen!2sus!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Basketball Factory Location"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
