

import { Metadata } from 'next'
import Header from '@/components/header'
import MSWinterHero from '@/components/programs/ms-winter-workouts/hero-section'
import MSWinterOverview from '@/components/programs/ms-winter-workouts/overview-section'
import MSWinterDetails from '@/components/programs/ms-winter-workouts/details-section'
import ProgramBookingWizard from '@/components/programs/ms-winter-workouts/booking-wizard/program-booking-wizard'
import MSWinterFAQ from '@/components/programs/ms-winter-workouts/faq-section'
import MSWinterCTA from '@/components/programs/ms-winter-workouts/cta-section'

export const metadata: Metadata = {
  title: 'Middle School Winter Workouts | Basketball Skill Training Sparta NJ | The Basketball Factory',
  description: 'Develop your game with our Middle School Winter Basketball Skills Program in Sparta, NJ. Designed for young athletes. Expert training, skill building, confidence development.',
  keywords: 'middle school basketball training Sparta NJ, winter basketball workouts, basketball skill development, youth training, Kevin Houston basketball, The Basketball Factory programs',
  openGraph: {
    title: 'Middle School Winter Workouts | The Basketball Factory',
    description: 'Expert basketball training for middle school athletes during the winter season. Build skills, confidence, and competitive ability.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function MSWinterWorkoutsPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <MSWinterHero />
        <MSWinterOverview />
        <MSWinterDetails />
        <ProgramBookingWizard />
        <MSWinterFAQ />
        <MSWinterCTA />
      </div>
    </>
  )
}
