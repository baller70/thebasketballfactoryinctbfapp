
'use client'

import { Phone, Mail, MapPin, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function CTASection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='https://i.ytimg.com/vi/Mhod4GYVMyU/sddefault.jpg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A961' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA Card */}
        <div className="bg-gradient-to-r from-black via-gray-900 to-black border-2 border-tbf-gold rounded-lg p-12 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold !text-white bg-transparent mb-6 font-audiowide uppercase">
                READY TO TAKE YOUR GAME TO THE{' '}
                <span className="text-tbf-gold">NEXT LEVEL?</span>
              </h2>
              <p className="!text-white bg-transparent/90 text-lg mb-8 leading-relaxed">
                Don't wait to give your child the gift of expert basketball training. Private lessons with Kevin Houston at The Basketball Factory in Sparta, NJ fill up quickly. Book your session today and start seeing real results on the court.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-tbf-gold/20 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-tbf-gold" />
                  </div>
                  <div>
                    <p className="!text-white bg-transparent font-semibold">Flexible Scheduling Available</p>
                    <p className="!text-white bg-transparent/70 text-sm">Book sessions that fit your family's schedule</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-tbf-gold/20 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-tbf-gold" />
                  </div>
                  <div>
                    <p className="!text-white bg-transparent font-semibold">Convenient Sparta Location</p>
                    <p className="!text-white bg-transparent/70 text-sm">38 Station Rd, Sparta, NJ 07871</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => document.getElementById('booking-portal')?.scrollIntoView({ behavior: 'smooth' })}
                  size="lg"
                  className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg px-8 py-6 rounded-none"
                >
                  BOOK A LESSON NOW
                </Button>
                <Button
                  onClick={() => window.location.href = '/contact-us'}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white !text-white bg-transparent hover:bg-white hover:text-black font-bold text-lg px-8 py-6 rounded-none"
                >
                  CONTACT US
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[400px] rounded-lg overflow-hidden border-4 border-tbf-gold">
                <Image
                  src="/private-lessons-hero-article.jpg"
                  alt="Basketball training in action at The Basketball Factory Sparta NJ - News Article"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Contact Card */}
              <div className="absolute -bottom-6 -right-6 bg-black border-2 border-tbf-gold rounded-lg p-6 shadow-2xl max-w-xs">
                <h4 className="!text-white bg-transparent font-bold text-lg mb-4 font-audiowide uppercase">HAVE QUESTIONS?</h4>
                <div className="space-y-3">
                  <a href="tel:+19732408759" className="flex items-center gap-3 !text-white bg-transparent/90 hover:text-tbf-gold transition-colors">
                    <Phone className="w-5 h-5 text-tbf-gold" />
                    <span className="text-sm">(973) 240-8759</span>
                  </a>
                  <a href="mailto:khouston@thebasketballfactorynj.com" className="flex items-center gap-3 !text-white bg-transparent/90 hover:text-tbf-gold transition-colors">
                    <Mail className="w-5 h-5 text-tbf-gold" />
                    <span className="text-sm">khouston@thebasketballfactorynj.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Quick Links */}
        <div className="bg-black/40 border border-tbf-gold/20 rounded-lg p-8">
          <h3 className="text-2xl font-bold !text-white bg-transparent mb-6 text-center font-audiowide uppercase">
            FREQUENTLY ASKED <span className="text-tbf-gold">QUESTIONS</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <h4 className="!text-white bg-transparent font-semibold mb-2 uppercase">What age groups do you train?</h4>
              <p className="!text-white bg-transparent/70 text-sm">We work with young athletes ages 7-18, from beginners to advanced players.</p>
            </div>
            <div className="text-center">
              <h4 className="!text-white bg-transparent font-semibold mb-2 uppercase">How long are sessions?</h4>
              <p className="!text-white bg-transparent/70 text-sm">All private lessons are 1 hour long, focused entirely on your child's development.</p>
            </div>
            <div className="text-center">
              <h4 className="!text-white bg-transparent font-semibold mb-2 uppercase">Do you offer payment plans?</h4>
              <p className="!text-white bg-transparent/70 text-sm">Yes! We offer flexible payment options for our multi-session packages.</p>
            </div>
            <div className="text-center">
              <h4 className="!text-white bg-transparent font-semibold mb-2 uppercase">What should my child bring?</h4>
              <p className="!text-white bg-transparent/70 text-sm">Just basketball shoes, water bottle, and a willingness to learn and work hard!</p>
            </div>
            <div className="text-center">
              <h4 className="!text-white bg-transparent font-semibold mb-2 uppercase">Can parents watch sessions?</h4>
              <p className="!text-white bg-transparent/70 text-sm">Absolutely! Parents are welcome to observe their child's training sessions.</p>
            </div>
            <div className="text-center">
              <h4 className="!text-white bg-transparent font-semibold mb-2 uppercase">How do I reschedule?</h4>
              <p className="!text-white bg-transparent/70 text-sm">Contact us at least 24 hours in advance to reschedule at no charge.</p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 text-center">
          <p className="!text-white bg-transparent/80 text-lg mb-4">
            Serving families throughout Sussex County including Sparta, Newton, Hopatcong, Andover, and surrounding communities
          </p>
          <p className="text-tbf-gold font-semibold text-xl">
            Join The Basketball Factory family today and watch your child's confidence soar!
          </p>
        </div>
      </div>
    </section>
  )
}
