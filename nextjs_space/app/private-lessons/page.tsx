import { Metadata } from 'next'
import Header from '@/components/header'
import PrivateLessonsHero from '@/components/private-lessons/hero-section'
import WhyChooseSection from '@/components/private-lessons/why-choose-section'
import ResumeSection from '@/components/private-lessons/resume-section'
import PricingGuide from '@/components/private-lessons/pricing-guide'
import BookingWizard from '@/components/private-lessons/booking-wizard'
import TestimonialsSection from '@/components/private-lessons/testimonials-section'
import SuccessStoriesSection from '@/components/private-lessons/success-stories-section'
import CTASection from '@/components/private-lessons/cta-section'
import CanceledBanner from '@/components/private-lessons/canceled-banner'

export const metadata: Metadata = {
  title: 'Private Basketball Lessons Sparta NJ | Expert One-on-One Training | The Basketball Factory',
  description: 'Elite private basketball lessons in Sparta, NJ with expert trainer Kevin Houston. Personalized one-on-one training for ages 7-18. Build skills, confidence & basketball IQ. Parents trust us for real results. Book your session today!',
  keywords: 'private basketball lessons Sparta NJ, one-on-one basketball training, Kevin Houston basketball trainer, youth basketball coaching Sparta, basketball skills training Sussex County, private basketball coach near me, basketball lessons ages 7-18, personalized basketball training New Jersey',
  openGraph: {
    title: 'Private Basketball Lessons Sparta NJ | The Basketball Factory',
    description: 'Expert one-on-one basketball training for kids & teens in Sparta, NJ. Proven results, flexible scheduling, personalized skill development.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Private Basketball Lessons Sparta NJ | The Basketball Factory',
    description: 'Expert one-on-one basketball training for kids & teens in Sparta, NJ. Proven results, flexible scheduling, personalized skill development.',
  }
}

export default function PrivateLessonsPage() {
  return (
    <>
      <Header alwaysDark />
      <div className="min-h-screen bg-black">
        <CanceledBanner />
        <PrivateLessonsHero />
        <WhyChooseSection />
        <ResumeSection />
        <SuccessStoriesSection />
        <PricingGuide />
        <BookingWizard />
        <TestimonialsSection />
        <CTASection />
      </div>
    </>
  )
}
