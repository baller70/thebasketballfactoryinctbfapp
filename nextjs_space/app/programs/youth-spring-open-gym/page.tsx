

import { Metadata } from 'next'
import Header from '@/components/header'
import YouthSpringHero from '@/components/programs/youth-spring/hero-section'
import YouthSpringOverview from '@/components/programs/youth-spring/overview-section'
import YouthSpringDetails from '@/components/programs/youth-spring/details-section'
import ProgramBookingWizard from '@/components/programs/youth-spring/booking-wizard/program-booking-wizard'
import YouthSpringFAQ from '@/components/programs/youth-spring/faq-section'
import YouthSpringCTA from '@/components/programs/youth-spring/cta-section'

export const metadata: Metadata = {
  title: 'Youth Spring Open Gym | Basketball Training Sparta NJ | The Basketball Factory',
  description: 'Fun basketball training for youth with our Spring Open Gym at The Basketball Factory in Sparta, NJ.',
  keywords: 'youth spring basketball, open gym Sparta NJ, youth basketball training',
  openGraph: {
    title: 'Youth Spring Open Gym | The Basketball Factory',
    description: 'Fun spring basketball training for young athletes.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function YouthSpringOpenGymPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <YouthSpringHero />
        <YouthSpringOverview />
        <YouthSpringDetails />
        <ProgramBookingWizard />
        <YouthSpringFAQ />
        <YouthSpringCTA />
      </div>
    </>
  )
}
