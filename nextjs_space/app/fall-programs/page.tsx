
import { Metadata } from 'next';
import Header from '@/components/header';
import FallProgramsHero from '@/components/fall-programs-hero';
import FallProgramsGrid from '@/components/fall-programs-grid';
import FallStatsSection from '@/components/fall-stats-section';
import SocialMediaCTA from '@/components/social-media-cta';

export const metadata: Metadata = {
  title: 'Fall Basketball Training Programs Sparta NJ | The Basketball Factory',
  description: 'Enroll in elite fall basketball skill training programs in Sparta, NJ. Expert trainers prepare youth athletes ages 7-18 for school and travel tryouts. High school & middle school programs available. Serving Sussex County families.',
  keywords: 'fall basketball training Sparta NJ, fall basketball programs Sussex County, youth basketball fall training, high school basketball workouts Sparta, middle school basketball training NJ, fall basketball tryout prep, basketball skill training fall season',
};

export default function FallProgramsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <FallProgramsHero />
      <SocialMediaCTA />
      <FallProgramsGrid />
      <FallStatsSection />
    </div>
  );
}
