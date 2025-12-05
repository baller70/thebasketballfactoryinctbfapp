

import { Metadata } from 'next'
import Header from '@/components/header'
import HSSpringHero from '@/components/programs/hs-spring/hero-section'
import HSSpringOverview from '@/components/programs/hs-spring/overview-section'
import HSSpringDetails from '@/components/programs/hs-spring/details-section'
import ProgramBookingWizard from '@/components/programs/hs-spring/booking-wizard/program-booking-wizard'
import HSSpringFAQ from '@/components/programs/hs-spring/faq-section'
import HSSpringCTA from '@/components/programs/hs-spring/cta-section'

export const metadata: Metadata = {
  title: 'HS Spring Circuit Skill Training | Basketball Training Sparta NJ | The Basketball Factory',
  description: 'Elevate your game with our High School Spring Circuit at The Basketball Factory in Sparta, NJ. AAU tournament preparation.',
  keywords: 'high school spring basketball, spring circuit Sparta NJ, AAU basketball training',
  openGraph: {
    title: 'HS Spring Circuit Skill Training | The Basketball Factory',
    description: 'AAU tournament preparation for high school athletes.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function HSSpringCircuitPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <HSSpringHero />
        <HSSpringOverview />
        <HSSpringDetails />
        <ProgramBookingWizard />
        <HSSpringFAQ />
        <HSSpringCTA />
      </div>
    </>
  )
}
