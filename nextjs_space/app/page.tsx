
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import ProgramSection from '@/components/program-section'
import StatsSection from '@/components/stats-section'
import Testimonials from '@/components/testimonials'

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <HeroSection />
      <ProgramSection />
      <StatsSection />
      <Testimonials />
    </div>
  )
}
