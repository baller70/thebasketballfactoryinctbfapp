
import { Metadata } from 'next';
import Header from '@/components/header';
import SpringProgramsHero from '@/components/spring-programs-hero';
import SpringProgramsGrid from '@/components/spring-programs-grid';
import FallStatsSection from '@/components/fall-stats-section';
import SocialMediaCTA from '@/components/social-media-cta';

export const metadata: Metadata = {
  title: 'Spring Basketball Training Programs Sparta NJ | The Basketball Factory',
  description: 'Enroll in elite spring basketball skill training programs in Sparta, NJ. Expert trainers prepare youth athletes ages 7-18 for AAU and summer tournaments. High school & middle school programs available. Serving Sussex County families.',
  keywords: 'spring basketball training Sparta NJ, spring basketball programs Sussex County, youth basketball spring training, high school basketball workouts Sparta, middle school basketball training NJ, spring basketball skill training',
};

export default function SpringProgramsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <SpringProgramsHero />
      <SocialMediaCTA />
      <SpringProgramsGrid />
      <FallStatsSection />
    </div>
  );
}
