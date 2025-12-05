'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Phone, Mail } from 'lucide-react'

export default function SharedBookingCTA() {
  return (
    <section id="booking-section" className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-black border-2 border-tbf-gold rounded-lg p-12 text-center"
        >
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            Ready to Register?
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold !text-white bg-transparent mb-6 font-russo-one">
            SECURE YOUR <span className="text-tbf-gold">SPOT TODAY</span>
          </h2>
          <p className="!text-white bg-transparent/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Contact us to register for this program and take the next step in your basketball journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              asChild
              className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg px-10 py-6 rounded-none"
            >
              <Link href="/contact-us">
                Register Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 border-tbf-gold text-tbf-gold hover:bg-tbf-gold hover:text-black font-bold text-lg px-10 py-6 rounded-none"
            >
              <a href="tel:+19732408759">
                Call to Register
              </a>
            </Button>
          </div>

          <div className="pt-8 border-t border-tbf-gold/30">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center !text-white bg-transparent/80">
              <a
                href="tel:+19732408759"
                className="flex items-center gap-2 hover:text-tbf-gold transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">(973) 240-8759</span>
              </a>
              <span className="hidden sm:block !text-white bg-transparent/30">|</span>
              <a
                href="mailto:khouston@thebasketballfactorynj.com"
                className="flex items-center gap-2 hover:text-tbf-gold transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">khouston@thebasketballfactorynj.com</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
