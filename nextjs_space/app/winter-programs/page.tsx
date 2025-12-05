
import { Metadata } from 'next';
import Header from '@/components/header';
import WinterProgramsHero from '@/components/winter-programs-hero';
import WinterProgramsGrid from '@/components/winter-programs-grid';
import FallStatsSection from '@/components/fall-stats-section';
import SocialMediaCTA from '@/components/social-media-cta';

export const metadata: Metadata = {
  title: 'Winter Basketball Training Programs Sparta NJ | The Basketball Factory',
  description: 'Enroll in elite winter basketball skill training programs in Sparta, NJ. Expert trainers prepare youth athletes ages 7-18 during the competitive season. High school & middle school programs available. Serving Sussex County families.',
  keywords: 'winter basketball training Sparta NJ, winter basketball programs Sussex County, youth basketball winter training, high school basketball workouts Sparta, middle school basketball training NJ, winter basketball skill training',
};

export default function WinterProgramsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <WinterProgramsHero />
      <SocialMediaCTA />
      <WinterProgramsGrid />
      <FallStatsSection />
    </div>
  );
}
