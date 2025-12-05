

import { Metadata } from 'next'
import Header from '@/components/header'
import MSSpringHero from '@/components/programs/ms-spring/hero-section'
import MSSpringOverview from '@/components/programs/ms-spring/overview-section'
import MSSpringDetails from '@/components/programs/ms-spring/details-section'
import ProgramBookingWizard from '@/components/programs/ms-spring/booking-wizard/program-booking-wizard'
import MSSpringFAQ from '@/components/programs/ms-spring/faq-section'
import MSSpringCTA from '@/components/programs/ms-spring/cta-section'

export const metadata: Metadata = {
  title: 'MS Spring Circuit | Basketball Training Sparta NJ | The Basketball Factory',
  description: 'Build skills with our Middle School Spring Circuit at The Basketball Factory in Sparta, NJ. Spring season development.',
  keywords: 'middle school spring basketball, spring circuit Sparta NJ, youth basketball training',
  openGraph: {
    title: 'MS Spring Circuit | The Basketball Factory',
    description: 'Spring season development for middle school athletes.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function MSSpringCircuitPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <MSSpringHero />
        <MSSpringOverview />
        <MSSpringDetails />
        <ProgramBookingWizard />
        <MSSpringFAQ />
        <MSSpringCTA />
      </div>
    </>
  )
}
