
import { Metadata } from 'next'
import Header from '@/components/header'
import WhoWeTrainedHero from '@/components/who-we-trained/hero-section'
import PlayersGrid from '@/components/who-we-trained/players-grid'

export const metadata: Metadata = {
  title: 'Who We Trained | The Basketball Factory | Elite Player Development',
  description: 'Meet the elite basketball players trained at The Basketball Factory in Sparta, NJ. Over 15 years of developing college athletes and professional players from Northern New Jersey.',
  keywords: 'basketball training success stories, college basketball players New Jersey, elite basketball training Sparta NJ, basketball player development, Northern New Jersey basketball alumni',
  openGraph: {
    title: 'Who We Trained | The Basketball Factory',
    description: 'Over 15 years of developing elite basketball talent in Northern New Jersey',
    images: ['/trained-players-og-image.jpg'],
  },
}

export default function WhoWeTrainedPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header alwaysDark />
      <WhoWeTrainedHero />
      <PlayersGrid />
    </main>
  )
}
