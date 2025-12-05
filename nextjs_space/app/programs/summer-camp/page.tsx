
import { Metadata } from 'next';
import Header from '@/components/header';
import HeroSection from './components/hero-section';
import OverviewSection from './components/overview-section';
import DetailsSection from './components/details-section';
import ProgramBookingWizard from '@/components/programs/summer-camp/booking-wizard/program-booking-wizard';
import FAQSection from './components/faq-section';
import CTASection from './components/cta-section';

export const metadata: Metadata = {
  title: 'TBF Weekly Summer Basketball Camp | The Basketball Factory Sparta NJ',
  description: 'Join our premier weekly summer basketball camp at The Basketball Factory in Sparta, NJ. Full-day camps with skill development.',
  keywords: 'summer basketball camp Sparta NJ, weekly basketball camp, youth basketball camp',
};

export default function SummerCampPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <HeroSection />
      <OverviewSection />
      <DetailsSection />
      <ProgramBookingWizard />
      <FAQSection />
      <CTASection />
    </div>
  );
}
