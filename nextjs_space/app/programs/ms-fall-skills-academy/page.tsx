
import { Metadata } from 'next'
import Header from '@/components/header'
import MSFallHero from '@/components/programs/ms-fall/hero-section'
import MSFallOverview from '@/components/programs/ms-fall/overview-section'
import MSFallDetails from '@/components/programs/ms-fall/details-section'
import ProgramBookingWizard from '@/components/programs/ms-fall/booking-wizard/program-booking-wizard'
import MSFallFAQ from '@/components/programs/ms-fall/faq-section'
import MSFallCTA from '@/components/programs/ms-fall/cta-section'

export const metadata: Metadata = {
  title: 'Middle School Skills Academy | Basketball Training Sparta NJ | The Basketball Factory',
  description: 'Build basketball fundamentals with our Middle School Skills Academy in Sparta, NJ. Designed for grades 6-8 preparing for travel basketball and middle school teams. Expert training, skill development, confidence building.',
  keywords: 'middle school basketball training Sparta NJ, basketball skills academy, youth basketball development, travel basketball preparation, middle school basketball, Kevin Houston basketball, The Basketball Factory programs',
  openGraph: {
    title: 'Middle School Skills Academy | The Basketball Factory',
    description: 'Expert basketball training for middle school athletes building strong fundamentals. Develop skills, confidence, and prepare for competitive basketball.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function MSFallSkillsAcademyPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <MSFallHero />
        <MSFallOverview />
        <MSFallDetails />
        <ProgramBookingWizard />
        <MSFallFAQ />
        <MSFallCTA />
      </div>
    </>
  )
}
