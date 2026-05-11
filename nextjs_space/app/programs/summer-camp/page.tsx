import { Metadata } from 'next';
import Header from '@/components/header';
import HeroSection from './components/hero-section';
import ProgramBookingWizard from '@/components/programs/summer-camp/booking-wizard/program-booking-wizard';
import SocialMediaBanner from '@/components/social-media-banner';
import ProgramInfoSection from './components/program-info-section';
import CTASection from './components/cta-section';

export const metadata: Metadata = {
  title: 'Summer Basketball Camp Sparta NJ | Fun Week-Long Camp for Kids Grades 3-8 | The Basketball Factory',
  description: 'The most fun summer basketball camp in northern New Jersey! Week-long day camp for boys & girls grades 3rd-8th in Sparta, NJ. Theme days, NBA All-Star Friday, team competitions, dodgeball, pizza lunch & more. 16 baskets, expert coaches. Serving Sparta, Rockaway, Dover, Jefferson, Newton & all of Sussex and Morris County. Register today!',
  keywords: 'summer basketball camp Sparta NJ, basketball camp northern New Jersey, kids basketball camp Sussex County, youth basketball camp Morris County, fun summer camp Sparta NJ, basketball camp near me NJ, summer sports camp Rockaway NJ, basketball camp Dover NJ, kids day camp Jefferson NJ, youth sports camp Newton NJ, basketball camp Hopatcong NJ, summer camp boys girls NJ, week long basketball camp, basketball camp grades 3-8, fun basketball camp northern NJ',
  openGraph: {
    title: 'Summer Basketball Camp | The Basketball Factory - Sparta, NJ',
    description: 'The most fun basketball camp in northern NJ! Week-long day camp for grades 3-8. Theme days, NBA All-Star Friday, team competitions & more. Register now!',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Summer Basketball Camp | The Basketball Factory - Sparta, NJ',
    description: 'Fun week-long basketball camp for kids grades 3-8 in Sparta, NJ. Theme days, NBA All-Star Friday, team competitions & more!',
  },
};

export default function SummerCampPage() {
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
