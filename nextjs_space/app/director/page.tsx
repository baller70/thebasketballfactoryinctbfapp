
import { Metadata } from 'next'
import Header from '@/components/header'
import BackButton from '@/components/back-button'
import DirectorContent from '@/components/director-content'

export const metadata: Metadata = {
  title: 'Kevin Houston - Elite Basketball Trainer & Director | Sparta, NJ | The Basketball Factory',
  description: 'Meet Kevin Houston, founder and director of The Basketball Factory in Sparta, NJ. Former collegiate & professional player with 15+ years training experience. Expert basketball training serving Sussex County, Morris County & North Jersey. Register for tryouts today.',
  keywords: 'Kevin Houston basketball trainer, Sparta NJ basketball trainer, Sussex County AAU basketball, elite basketball training New Jersey, Basketball Factory director, youth basketball Sparta NJ, professional basketball trainer, AAU basketball trainer, basketball skill development NJ, North Jersey basketball training',
  openGraph: {
    title: 'Kevin Houston - Elite Basketball Trainer & Director | Sparta, NJ',
    description: 'Former collegiate & professional player with proven track record developing championship teams. Serving Sparta, Sussex County & surrounding NJ areas.',
    images: ['/kh-article-hero.jpg'],
  },
}

export default function DirectorPage() {
  return (
    <>
      <div className="bg-black w-full">
        <Header alwaysDark />
        <BackButton />
      </div>
      <div className="pt-24">
        <DirectorContent />
      </div>
    </>
  )
}
