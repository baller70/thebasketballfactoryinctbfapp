
import { Metadata } from 'next';
import Header from '@/components/header';
import ProgramsHero from '@/components/programs/programs-hero';
import SeasonalProgramsGrid from '@/components/programs/seasonal-programs-grid';
import SocialMediaCTA from '@/components/social-media-cta';

export const metadata: Metadata = {
  title: 'Basketball Training Programs - All Seasons | The Basketball Factory',
  description: 'Explore year-round basketball training programs at The Basketball Factory in Sparta, NJ. Fall, Winter, Spring, and Summer programs for youth athletes ages 7-18. Expert coaching and skill development for all levels.',
  keywords: 'basketball programs Sparta NJ, year-round basketball training, fall basketball programs, winter basketball training, spring basketball programs, summer basketball camps, youth basketball training Sussex County',
};

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <ProgramsHero />
      <SeasonalProgramsGrid />
      <SocialMediaCTA />
    </div>
  );
}
