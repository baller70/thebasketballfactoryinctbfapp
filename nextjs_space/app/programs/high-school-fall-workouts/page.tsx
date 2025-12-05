
import { Metadata } from 'next'
import Header from '@/components/header'
import HSFallHero from '@/components/programs/high-school-fall/hero-section'
import HSFallOverview from '@/components/programs/high-school-fall/overview-section'
import HSFallDetails from '@/components/programs/high-school-fall/details-section'
import ProgramBookingWizard from '@/components/programs/high-school-fall/booking-wizard/program-booking-wizard'
import HSFallFAQ from '@/components/programs/high-school-fall/faq-section'
import HSFallCTA from '@/components/programs/high-school-fall/cta-section'

export const metadata: Metadata = {
  title: 'High School Fall Workouts | Basketball Skill Training Sparta NJ | The Basketball Factory',
  description: 'Get a head start on the winter basketball season with our High School Fall Basketball Skills Program in Sparta, NJ. Designed for players gearing up for school team tryouts. Expert training, personalized development, competitive edge.',
  keywords: 'high school basketball training Sparta NJ, fall basketball workouts, basketball skill development, school team tryouts preparation, youth basketball training, Kevin Houston basketball, The Basketball Factory programs',
  openGraph: {
    title: 'High School Fall Workouts | The Basketball Factory',
    description: 'Expert basketball training for high school athletes preparing for the winter season. Build skills, confidence, and dominate tryouts.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function HSFallWorkoutsPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <HSFallHero />
        <HSFallOverview />
        <HSFallDetails />
        <ProgramBookingWizard />
        <HSFallFAQ />
        <HSFallCTA />
      </div>
    </>
  )
}
