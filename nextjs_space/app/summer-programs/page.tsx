
import { Metadata } from 'next';
import Header from '@/components/header';
import SummerProgramsHero from '@/components/summer-programs-hero';
import SummerProgramsGrid from '@/components/summer-programs-grid';
import FallStatsSection from '@/components/fall-stats-section';
import SocialMediaCTA from '@/components/social-media-cta';

export const metadata: Metadata = {
  title: 'Summer Basketball Camps & Training Sparta NJ | The Basketball Factory',
  description: 'Join elite summer basketball camps and training programs in Sparta, NJ. Expert coaching for youth athletes ages 7-18. Weekly camps, skill development, and open gyms available. Serving Sussex County families.',
  keywords: 'summer basketball camp Sparta NJ, summer basketball programs Sussex County, youth basketball summer training, basketball camps Sparta, summer basketball skills training NJ',
};

export default function SummerProgramsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <SummerProgramsHero />
      <SocialMediaCTA />
      <SummerProgramsGrid />
      <FallStatsSection />
    </div>
  );
}
