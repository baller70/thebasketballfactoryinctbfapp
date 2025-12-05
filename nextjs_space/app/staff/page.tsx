
import Header from '@/components/header'
import BackButton from '@/components/back-button'
import TrainersContent from '@/components/trainers-content'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Training Staff | The Basketball Factory - Sparta, NJ',
  description: 'Meet our experienced training staff at The Basketball Factory in Sparta, NJ. Expert trainers mentoring the next generation of youth basketball athletes. Certified trainers with proven track records.',
  keywords: 'Sparta NJ basketball trainer, The Basketball Factory training staff, youth basketball training Sparta, local basketball trainers Sparta NJ, AAU basketball trainers, Sussex County basketball trainers, NJ youth basketball training',
  openGraph: {
    title: 'Training Staff | The Basketball Factory - Sparta, NJ',
    description: 'Meet our experienced training staff at The Basketball Factory in Sparta, NJ. Expert trainers dedicated to developing champions on and off the court.',
    siteName: 'The Basketball Factory',
    images: [
      {
        url: '/kevin-houston-featured-basketball-trainer.png',
        width: 1200,
        height: 630,
        alt: 'The Basketball Factory Training Staff',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Training Staff | The Basketball Factory - Sparta, NJ',
    description: 'Meet our experienced training staff at The Basketball Factory in Sparta, NJ. Expert trainers dedicated to developing champions.',
    images: ['/kevin-houston-featured-basketball-trainer.png'],
  },
}

export default function TrainersPage() {
  return (
    <main className="min-h-screen">
      <Header alwaysDark />
      <BackButton />
      <TrainersContent />
    </main>
  )
}
