

import { Metadata } from 'next'
import Header from '@/components/header'
import YouthFallOpenGymHero from '@/components/programs/youth-fall-open-gym/hero-section'
import YouthFallOpenGymOverview from '@/components/programs/youth-fall-open-gym/overview-section'
import YouthFallOpenGymDetails from '@/components/programs/youth-fall-open-gym/details-section'
import ProgramBookingWizard from '@/components/programs/youth-fall-open-gym/booking-wizard/program-booking-wizard'
import YouthFallOpenGymFAQ from '@/components/programs/youth-fall-open-gym/faq-section'
import YouthFallOpenGymCTA from '@/components/programs/youth-fall-open-gym/cta-section'

export const metadata: Metadata = {
  title: 'Youth Fall Open Gym | Basketball Training Sparta NJ | The Basketball Factory',
  description: 'Join our Youth Fall Open Gym sessions at The Basketball Factory in Sparta, NJ. Flexible practice time, supervised play, and pickup games for ages 7-18. Drop-in anytime - no commitment required!',
  keywords: 'youth basketball open gym Sparta NJ, basketball practice Sparta, youth basketball training, drop-in basketball, pickup games Sparta NJ, Kevin Houston basketball, The Basketball Factory programs',
  openGraph: {
    title: 'Youth Fall Open Gym | The Basketball Factory',
    description: 'Flexible basketball training for youth ages 7-18. Drop in every Monday for supervised play, skill practice, and pickup games.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function YouthFallOpenGymPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <YouthFallOpenGymHero />
        <YouthFallOpenGymOverview />
        <YouthFallOpenGymDetails />
        <ProgramBookingWizard />
        <YouthFallOpenGymFAQ />
        <YouthFallOpenGymCTA />
      </div>
    </>
  )
}

