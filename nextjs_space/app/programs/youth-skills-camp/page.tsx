import { Metadata } from 'next';
import Header from '@/components/header';
import HeroSection from './components/hero-section';
import OverviewSection from './components/overview-section';
import DetailsSection from './components/details-section';
import ProgramBookingWizard from '@/components/programs/youth-skills/booking-wizard/program-booking-wizard';
import SocialMediaBanner from '@/components/social-media-banner';
import FAQSection from './components/faq-section';
import CTASection from './components/cta-section';

export const metadata: Metadata = {
  title: 'Youth Basketball Skills Training Camp Sparta NJ | Summer Fundamentals Program Grades 3-8 | The Basketball Factory',
  description: 'Sharpen your basketball skills this summer! Mon-Wed morning skills training camp in Sparta, NJ for boys & girls. Learn shooting, dribbling, passing, footwork & finishing. 16 baskets, expert coaching, July through August. Serving Sparta, Rockaway, Dover, Jefferson, Newton & all of Sussex and Morris County.',
  keywords: 'youth basketball skills training Sparta NJ, summer basketball fundamentals camp NJ, basketball skills development northern New Jersey, youth basketball training Sussex County, kids basketball camp Morris County, basketball shooting camp NJ, dribbling camp NJ, basketball fundamentals program, summer basketball training near me, youth basketball camp Rockaway NJ, basketball camp Dover NJ, basketball training Jefferson NJ, basketball camp Newton NJ, basketball camp Hopatcong NJ',
  openGraph: {
    title: 'Youth Basketball Skills Training Camp | The Basketball Factory - Sparta, NJ',
    description: 'Summer basketball fundamentals camp for boys & girls. Mon-Wed mornings, July through August. Shooting, dribbling, passing, footwork & live games. 16 baskets. Register now!',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youth Basketball Skills Training Camp | The Basketball Factory - Sparta, NJ',
    description: 'Summer basketball fundamentals for boys & girls. Mon-Wed mornings, July-August. Shooting, dribbling, finishing & live games. Register now!',
  },
};

export default function YouthSkillsCampPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <HeroSection />
      <SocialMediaBanner />
      <ProgramBookingWizard />
      <OverviewSection />
      <DetailsSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
