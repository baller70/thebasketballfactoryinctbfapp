
import { Metadata } from 'next';
import Header from '@/components/header';
import NewsletterHero from '@/components/newsletter/newsletter-hero';
import NewsletterGrid from '@/components/newsletter/newsletter-grid';

export const metadata: Metadata = {
  title: 'Newsletter Archive | The Basketball Factory',
  description: 'Stay updated with The Basketball Factory newsletter. Expert basketball training insights, player development tips, program updates, and success stories delivered to your inbox.',
  keywords: 'basketball newsletter, training tips, player development, basketball insights, The Basketball Factory news',
};

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header alwaysDark />
      <NewsletterHero />
      <NewsletterGrid />
    </main>
  );
}
