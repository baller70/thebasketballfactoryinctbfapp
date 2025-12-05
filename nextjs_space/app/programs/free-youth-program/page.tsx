
import { Metadata } from 'next'
import Header from '@/components/header'
import FreeYouthHero from '@/components/programs/free-youth/hero-section'
import FreeYouthOverview from '@/components/programs/free-youth/overview-section'
import FreeYouthDetails from '@/components/programs/free-youth/details-section'
import FreeYouthBookingWizard from '@/components/programs/free-youth/booking-wizard/youth-booking-wizard'
import FreeYouthFAQ from '@/components/programs/free-youth/faq-section'
import FreeYouthCTA from '@/components/programs/free-youth/cta-section'

export const metadata: Metadata = {
  title: 'FREE Youth Basketball Program Sparta NJ | Ages 7-10 | The Basketball Factory',
  description: 'FREE 1-hour youth basketball skills program for kids ages 7-10 in Sparta, NJ. Give your child a fun introduction to basketball fundamentals with expert coaching. No cost, no commitment - just pure skill development and confidence building.',
  keywords: 'free youth basketball Sparta NJ, basketball for kids 7-10, youth basketball training Sparta, free basketball program New Jersey, kids basketball lessons, elementary basketball training, Kevin Houston basketball, beginner basketball for kids',
  openGraph: {
    title: 'FREE Youth Basketball Program | Ages 7-10 | Sparta NJ',
    description: 'Give your child the gift of basketball! FREE 1-hour session for kids ages 7-10. Expert coaching, fun drills, and skill building in Sparta, NJ.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function FreeYouthProgramPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <FreeYouthHero />
        <FreeYouthOverview />
        <FreeYouthDetails />
        <FreeYouthBookingWizard />
        <FreeYouthFAQ />
        <FreeYouthCTA />
      </div>
    </>
  )
}
