
import { Metadata } from 'next';
import Header from '@/components/header';
import HeroSection from './components/hero-section';
import OverviewSection from './components/overview-section';
import DetailsSection from './components/details-section';
import ProgramBookingWizard from '@/components/programs/youth-skills/booking-wizard/program-booking-wizard';
import FAQSection from './components/faq-section';
import CTASection from './components/cta-section';

export const metadata: Metadata = {
  title: 'Youth Skills & Development Training Camp | The Basketball Factory Sparta NJ',
  description: 'Focused skill development camp for young athletes at The Basketball Factory in Sparta, NJ. Perfect for improving fundamentals.',
  keywords: 'youth basketball skills camp, basketball development camp Sparta NJ, summer basketball training',
};

export default function YouthSkillsCampPage() {
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
