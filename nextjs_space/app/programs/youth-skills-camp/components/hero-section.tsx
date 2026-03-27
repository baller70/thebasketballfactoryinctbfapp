import Image from 'next/image';
import { Clock, Users, MapPin, Calendar, Target, Dribbble } from 'lucide-react';

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
              <span className="text-tbf-gold font-bold text-sm uppercase tracking-wider">Summer 2026 &bull; July - August</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-russo-one leading-tight">
              Youth Basketball{' '}
              <span className="text-tbf-gold">Skills Training</span> Camp
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              The perfect summer program for kids who want to sharpen their basketball fundamentals. Learn to shoot, dribble, pass, and finish the right way — then put those skills to work in live games. Three mornings a week, all summer long.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-white">
                <Calendar className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Mon, Tue, Wed</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>10:00 - 11:30 AM</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Users className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Boys &amp; Girls</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <MapPin className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Sparta, NJ &bull; 16 Baskets</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Target className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Fundamentals Focused</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Dribbble className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>July Through August</span>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Serving families from Sparta, Jefferson, Newton, Rockaway, Dover, Hopatcong, Vernon, Byram, Stanhope, Lafayette, West Milford, Kinnelon, Butler, Boonton, Parsippany &amp; all of Sussex &amp; Morris County.
            </p>
          </div>

          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/youth-basketball-skill-development-training.png"
              alt="Youth basketball skills training at The Basketball Factory in Sparta NJ - kids learning shooting, dribbling, and passing fundamentals"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-tbf-gold font-bold text-lg font-audiowide">LEARN IT. PRACTICE IT. PLAY IT.</p>
              <p className="text-white/80 text-sm">The perfect balance of skill work and live games</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
