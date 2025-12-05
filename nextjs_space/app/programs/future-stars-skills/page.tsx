
import { Metadata } from 'next'
import Header from '@/components/header'
import FutureStarsHero from '@/components/programs/future-stars/hero-section'
import FutureStarsOverview from '@/components/programs/future-stars/overview-section'
import FutureStarsDetails from '@/components/programs/future-stars/details-section'
import FutureStarsBookingWizard from '@/components/programs/future-stars/booking-wizard/youth-booking-wizard'
import FutureStarsFAQ from '@/components/programs/future-stars/faq-section'
import FutureStarsCTA from '@/components/programs/future-stars/cta-section'

export const metadata: Metadata = {
  title: 'FREE Future Stars Skills Development | Ages 7-10 | Sparta NJ | The Basketball Factory',
  description: 'FREE 4-week basketball skills program for kids ages 7-10 in Sparta, NJ. Sunday mornings 10:00-11:00 AM. Build fundamental skills, confidence, and love for the game with expert coaching. No cost, no commitment!',
  keywords: 'free youth basketball Sparta NJ, basketball for kids 7-10, youth basketball training Sparta, free basketball program New Jersey, kids basketball lessons, elementary basketball training, Kevin Houston basketball, beginner basketball for kids',
  openGraph: {
    title: 'FREE Future Stars Skills Development | Ages 7-10 | Sparta NJ',
    description: 'Give your child the gift of basketball! FREE 4-week program for kids ages 7-10. Expert coaching, fun drills, and skill building in Sparta, NJ.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function FutureStarsSkillsPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <FutureStarsHero />
        <FutureStarsOverview />
        <FutureStarsDetails />
        <FutureStarsBookingWizard />
        <FutureStarsFAQ />
        <FutureStarsCTA />
      </div>
    </>
  )
}
