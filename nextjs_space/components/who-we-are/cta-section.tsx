
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'
import SectionDivider from './section-divider'

export default function CTASection() {
  return (
    <section className="relative py-20 bg-gray-50">
      {/* Attractive Section Divider */}
      <SectionDivider variant="top" style="diagonal" className="mb-8" />
      
      <div className="container mx-auto px-4">
        {/* Main CTA */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight" style={{ fontFamily: 'Audiowide, sans-serif' }}>
            READY TO <span className="text-tbf-gold">THE BASKETBALL FACTORY</span>?
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Join Sussex County&apos;s premier AAU basketball program and give your child the opportunity to develop 
            <span className="text-tbf-gold font-semibold"> elite skills</span>, build <span className="text-tbf-gold font-semibold">lifelong friendships</span>, 
            and compete at the <span className="text-tbf-gold font-semibold">highest level</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact-us">
              <Button className="bg-tbf-gold hover:bg-tbf-gold/90 text-white px-10 py-7 text-xl font-bold shadow-xl group">
                CONTACT US TODAY
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact-us">
              <Button className="bg-white border-2 border-black text-black hover:bg-black hover:text-white px-10 py-7 text-xl font-bold">
                GET STARTED
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 text-base text-gray-600 font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tbf-gold rounded-full"></div>
              <span>12+ Championships</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tbf-gold rounded-full"></div>
              <span>40+ College Scholarships</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tbf-gold rounded-full"></div>
              <span>95% Player Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-tbf-gold rounded-full"></div>
              <span>4.9/5.0 Google Rating</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Location */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-10 text-center hover:border-tbf-gold transition-all duration-300 shadow-lg">
              <div className="w-20 h-20 bg-tbf-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-10 h-10 text-tbf-gold" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                LOCATION
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Serving Sparta, NJ 07871<br />
                and all of Sussex County<br />
                <span className="text-sm text-gray-600 mt-2 block">Newton • Andover • Hopatcong<br />Franklin • Hamburg</span>
              </p>
            </div>

            {/* Phone */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-10 text-center hover:border-tbf-gold transition-all duration-300 shadow-lg">
              <div className="w-20 h-20 bg-tbf-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-tbf-gold" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                CALL US
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                <a href="tel:+19732408759" className="hover:text-tbf-gold transition-colors font-semibold">
                  (973) 240-8759
                </a>
                <br />
                <span className="text-sm text-gray-600 mt-2 block">
                  Monday - Friday<br />
                  9:00 AM - 7:00 PM EST
                </span>
              </p>
            </div>

            {/* Email */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-10 text-center hover:border-tbf-gold transition-all duration-300 shadow-lg">
              <div className="w-20 h-20 bg-tbf-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-10 h-10 text-tbf-gold" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                EMAIL US
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                <a href="mailto:info@riseasoneaau.com" className="hover:text-tbf-gold transition-colors font-semibold">
                  info@riseasoneaau.com
                </a>
                <br />
                <span className="text-sm text-gray-600 mt-2 block">
                  Questions about tryouts,<br />
                  programs, or registration
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Final Message */}
        <div className="mt-16 text-center">
          <div className="bg-white border-2 border-tbf-gold rounded-xl p-10 max-w-5xl mx-auto shadow-lg">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
              DON&apos;T WAIT - SPOTS ARE LIMITED!
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              <span className="text-tbf-gold font-semibold">Tryouts fill up fast</span>. Give your child the advantage of training with 
              Sussex County&apos;s most successful AAU program. Our proven track record speaks for itself: 
              <span className="text-tbf-gold font-semibold"> championship wins</span>, <span className="text-tbf-gold font-semibold">college scholarships</span>, 
              and <span className="text-tbf-gold font-semibold">lifelong development</span>.
            </p>
            <Link href="/contact-us">
              <Button className="bg-tbf-gold hover:bg-tbf-gold/90 text-white px-10 py-6 text-lg font-bold shadow-xl">
                CONTACT US NOW →
              </Button>
            </Link>
          </div>
        </div>

        {/* SEO Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-xs max-w-5xl mx-auto leading-relaxed">
            The Basketball Factory Basketball Club | Youth Basketball Sussex County | AAU Tryouts Sparta NJ 07871 | 
            Elite Basketball Training New Jersey | Youth Sports Skill Development | AAU Basketball Programs | 
            Sussex County Basketball Tryouts | College Basketball Recruiting | Championship AAU Teams | 
            Basketball Training Sparta New Jersey | Youth Athletics Development
          </p>
        </div>
      </div>
    </section>
  )
}
