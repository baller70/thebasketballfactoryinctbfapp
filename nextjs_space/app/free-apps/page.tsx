
import { Metadata } from 'next';
import Header from '@/components/header';
import FreeAppsHero from '@/components/free-apps-hero';
import AppsShowcase from '@/components/apps-showcase';

export const metadata: Metadata = {
  title: 'Free Basketball Training Apps | The Basketball Factory - Sparta, NJ',
  description: 'Access free basketball skill training apps designed to help players improve without expensive subscriptions. From shot tracking to personalized training plans, get better today with The Basketball Factory in Sparta, NJ.',
  keywords: 'free basketball apps, basketball training app, youth basketball training, skill development app, shot tracker, dribbling drills, Sparta NJ basketball, free sports training',
};

export default function FreeAppsPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      <FreeAppsHero />
      <AppsShowcase />
    </div>
  );
}
