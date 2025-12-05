

import { Metadata } from 'next'
import Header from '@/components/header'
import HSWinterHero from '@/components/programs/hs-winter-workouts/hero-section'
import HSWinterOverview from '@/components/programs/hs-winter-workouts/overview-section'
import HSWinterDetails from '@/components/programs/hs-winter-workouts/details-section'
import ProgramBookingWizard from '@/components/programs/hs-winter-workouts/booking-wizard/program-booking-wizard'
import HSWinterFAQ from '@/components/programs/hs-winter-workouts/faq-section'
import HSWinterCTA from '@/components/programs/hs-winter-workouts/cta-section'

export const metadata: Metadata = {
  title: 'High School Winter Workouts | Basketball Skill Training Sparta NJ | The Basketball Factory',
  description: 'Stay game-ready with our High School Winter Basketball Skills Program in Sparta, NJ. Designed for in-season players. Expert training, skill maintenance, competitive advantage.',
  keywords: 'high school basketball training Sparta NJ, winter basketball workouts, basketball skill development, in-season training, youth basketball training, Kevin Houston basketball, The Basketball Factory programs',
  openGraph: {
    title: 'High School Winter Workouts | The Basketball Factory',
    description: 'Expert basketball training for high school athletes during the winter season. Maintain skills, stay sharp, and keep your competitive edge.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function HSWinterWorkoutsPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <HSWinterHero />
        <HSWinterOverview />
        <HSWinterDetails />
        <ProgramBookingWizard />
        <HSWinterFAQ />
        <HSWinterCTA />
      </div>
    </>
  )
}
