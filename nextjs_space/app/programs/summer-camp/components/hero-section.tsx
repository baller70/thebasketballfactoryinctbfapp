
import Image from 'next/image';
import { Clock, Users, MapPin, Calendar } from 'lucide-react';

export default function HeroSection() {
  return (
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
              TBF Weekly Summer Basketball Camp
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join our premier weekly summer basketball camp at The Basketball Factory in Sparta, NJ. Full-day camps with comprehensive skill development, games, and fun activities.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-white">
                <Users className="w-5 h-5 text-tbf-gold" />
                <span>Ages 7-15</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-5 h-5 text-tbf-gold" />
                <span>Mon-Fri</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Calendar className="w-5 h-5 text-tbf-gold" />
                <span>9:00 AM - 3:00 PM</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <MapPin className="w-5 h-5 text-tbf-gold" />
                <span>Sparta, NJ</span>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/fall-high-school-basketball-training-sparta-nj.png"
              alt="TBF Weekly Summer Basketball Camp"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
