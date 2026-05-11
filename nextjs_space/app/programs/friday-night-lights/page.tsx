import { Metadata } from 'next';
import Header from '@/components/header';
import HeroSection from './components/hero-section';
import ProgramBookingWizard from '@/components/programs/friday-night-lights/booking-wizard/program-booking-wizard';
import SocialMediaBanner from '@/components/social-media-banner';
import ProgramInfoSection from './components/program-info-section';
import CTASection from './components/cta-section';

export const metadata: Metadata = {
  title: 'Friday Night Lights Summer Open Gym | The Basketball Factory Sparta NJ',
  description: 'Friday Night Lights open gym at The Basketball Factory in Sparta, NJ. Every Friday 7-9 PM, ages 7-18. Pickup games, competitive runs, 16 baskets. Drop in any Friday!',
  keywords: 'Friday night basketball Sparta NJ, summer open gym, evening basketball sessions, pickup basketball NJ, youth open gym Sussex County',
};

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <HeroSection />
      <SocialMediaBanner />
      <ProgramBookingWizard />
      <ProgramInfoSection />
      <CTASection />
    </div>
  );
}
