

import { Metadata } from 'next'
import Header from '@/components/header'
import YouthWinterHero from '@/components/programs/youth-winter-open-gym/hero-section'
import YouthWinterOverview from '@/components/programs/youth-winter-open-gym/overview-section'
import YouthWinterDetails from '@/components/programs/youth-winter-open-gym/details-section'
import ProgramBookingWizard from '@/components/programs/youth-winter-open-gym/booking-wizard/program-booking-wizard'
import YouthWinterFAQ from '@/components/programs/youth-winter-open-gym/faq-section'
import YouthWinterCTA from '@/components/programs/youth-winter-open-gym/cta-section'

export const metadata: Metadata = {
  title: 'Youth Winter Open Gym | Basketball Training Sparta NJ | The Basketball Factory',
  description: 'Stay active with our Youth Winter Open Gym in Sparta, NJ. Fun, supervised basketball play for young athletes. Skill development, safe environment, engaging activities.',
  keywords: 'youth basketball Sparta NJ, winter open gym, basketball activities, supervised play, youth training, Kevin Houston basketball, The Basketball Factory programs',
  openGraph: {
    title: 'Youth Winter Open Gym | The Basketball Factory',
    description: 'Fun and supervised basketball open gym sessions for youth athletes during winter. Develop skills in a safe, engaging environment.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function YouthWinterOpenGymPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <YouthWinterHero />
        <YouthWinterOverview />
        <YouthWinterDetails />
        <ProgramBookingWizard />
        <YouthWinterFAQ />
        <YouthWinterCTA />
      </div>
    </>
  )
}
