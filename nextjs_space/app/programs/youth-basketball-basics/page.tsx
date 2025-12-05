
import { Metadata } from 'next'
import Header from '@/components/header'
import YouthBasicsHero from '@/components/programs/youth-basics/hero-section'
import YouthBasicsOverview from '@/components/programs/youth-basics/overview-section'
import YouthBasicsDetails from '@/components/programs/youth-basics/details-section'
import YouthBasicsBookingWizard from '@/components/programs/youth-basics/booking-wizard/youth-booking-wizard'
import YouthBasicsFAQ from '@/components/programs/youth-basics/faq-section'
import YouthBasicsCTA from '@/components/programs/youth-basics/cta-section'

export const metadata: Metadata = {
  title: 'FREE Youth Basketball Basics Workshop | Ages 7-10 | Sparta NJ | The Basketball Factory',
  description: 'FREE community basketball workshop for Sussex County families! Professional coaching for kids ages 7-10 in Sparta, NJ. Beginner program focusing on fundamentals, fun, and teamwork. Saturdays 11:00 AM - 12:00 PM.',
  keywords: 'free youth basketball Sparta NJ, basketball for kids 7-10, youth basketball training Sparta, free basketball program New Jersey, kids basketball lessons, elementary basketball training, Kevin Houston basketball, beginner basketball for kids',
  openGraph: {
    title: 'FREE Youth Basketball Basics Workshop | Ages 7-10 | Sparta NJ',
    description: 'FREE community basketball workshop for Sussex County families! Watch your child thrive in our beginner basketball program.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function YouthBasketballBasicsPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <YouthBasicsHero />
        <YouthBasicsOverview />
        <YouthBasicsDetails />
        <YouthBasicsBookingWizard />
        <YouthBasicsFAQ />
        <YouthBasicsCTA />
      </div>
    </>
  )
}
