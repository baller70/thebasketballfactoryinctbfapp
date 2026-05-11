import { Metadata } from 'next';
import Header from '@/components/header';
import { Clock, Users, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProgramBookingWizard from '@/components/programs/friday-night-lights/booking-wizard/program-booking-wizard';
import SocialMediaBanner from '@/components/social-media-banner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Friday Night Lights Summer Open Gym | The Basketball Factory Sparta NJ',
  description: 'Join our Friday Night Lights Summer Open Gym at The Basketball Factory in Sparta, NJ. Evening sessions for pickup games.',
  keywords: 'Friday night basketball Sparta NJ, summer open gym, evening basketball sessions',
};

export default function ProgramPage() {
  const trainingDates = [
    { date: 'Every Friday 2025', year: '2025' },
    { date: '7:00-9:00 PM 2025', year: '2025' },
  ];

  const included = [
    'Expert coaching staff',
    'Professional facility access',
    'Performance tracking',
    'Skill development focus',
    'Age-appropriate training',
    'Safe environment',
    'Comprehensive program',
    'Season preparation',
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#C8B273_1px,transparent_1px),linear-gradient(to_bottom,#C8B273_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-tbf-gold/10 border border-tbf-gold px-4 py-2 rounded-full mb-6">
                <span className="text-tbf-gold font-bold text-sm uppercase tracking-wider">Summer 2025</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-russo-one">
                Friday Night Lights Summer Open Gym <span className="text-tbf-gold"></span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join our Friday Night Lights Summer Open Gym at The Basketball Factory in Sparta, NJ. Evening sessions for pickup games.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-white">
                  <Users className="w-5 h-5 text-tbf-gold" />
                  <span>Ages 7-18</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Clock className="w-5 h-5 text-tbf-gold" />
                  <span>Ongoing</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <Calendar className="w-5 h-5 text-tbf-gold" />
                  <span>Fridays</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <MapPin className="w-5 h-5 text-tbf-gold" />
                  <span>Sparta, NJ</span>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="/fall-youth-basketball-open-gym-sparta-nj.png"
                alt="Friday Night Lights Summer Open Gym"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <SocialMediaBanner />
      <ProgramBookingWizard />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-tbf-gold p-3 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-black font-russo-one">What&apos;s Included</h2>
              </div>
              <div className="grid gap-3">
                {included.map((item) => (
                  <div key={item} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                    <CheckCircle2 className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-tbf-gold/5 to-white border-2 border-tbf-gold/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-tbf-gold p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-3xl font-bold text-black font-russo-one">Training Dates</h2>
              </div>
              <div className="space-y-4">
                {trainingDates.map((month) => (
                  <div key={month.date} className="bg-white p-5 rounded-xl border-2 border-gray-100 hover:border-tbf-gold transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-black font-audiowide">{month.year}</span>
                      <span className="bg-tbf-gold text-black px-3 py-1 rounded-full text-xs font-bold">CONFIRMED</span>
                    </div>
                    <p className="text-gray-700 font-medium">{month.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
