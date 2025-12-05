import type { Metadata } from 'next'
import Header from '@/components/header'
import BackButton from '@/components/back-button'
import HeroFeatureSection from '@/components/who-we-are/hero-feature-section'
import TeamDevelopmentSection from '@/components/who-we-are/team-development-section'
import AlumniSuccessSection from '@/components/who-we-are/alumni-success-section'
import GoogleReviewsSection from '@/components/who-we-are/google-reviews-section'
import YouTubeChannelSection from '@/components/who-we-are/youtube-channel-section'
import CTASection from '@/components/who-we-are/cta-section'

export const metadata: Metadata = {
  title: 'Who We Are - The Basketball Factory | Youth Basketball Training in Sparta, NJ',
  description: 'Discover The Basketball Factory, Sussex County\'s elite youth basketball skill training program serving Sparta, NJ. Championship-winning teams, proven skill development, and a legacy of excellence. Join the best basketball training in New Jersey for ages 7-18.',
  keywords: 'youth basketball Sussex County, basketball training Sparta NJ, elite basketball training New Jersey, youth sports skill development, basketball training New Jersey, basketball skill training Sussex County, Sparta youth basketball, The Basketball Factory',
}

export default function WhoWeArePage() {
  return (
    <>
      <Header alwaysDark />
      <BackButton />
      <div className="bg-white">
        {/* Hero/Feature Section */}
        <HeroFeatureSection />
        
        {/* Team Development Section */}
        <TeamDevelopmentSection />
        
        {/* Alumni Success Section */}
        <AlumniSuccessSection />
        
        {/* Google Reviews Section */}
        <GoogleReviewsSection />
        
        {/* YouTube Channel Section */}
        <YouTubeChannelSection />
        
        {/* Final CTA Section */}
        <CTASection />
      </div>
    </>
  )
}
