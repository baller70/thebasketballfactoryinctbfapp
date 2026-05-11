import Image from 'next/image';
import { Clock, Users, MapPin, Calendar, Trophy, Smile } from 'lucide-react';

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
              <span className="text-tbf-gold font-bold text-sm uppercase tracking-wider">Summer 2026 &bull; Now Registering</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-russo-one leading-tight">
              The Summer Camp Your Kids Will{' '}
              <span className="text-tbf-gold">Beg to Come Back To</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              NBA All-Star Friday. Theme days. Team competitions. Dodgeball. Pizza parties. And tons of basketball on 16 baskets. This isn&apos;t just camp &mdash; it&apos;s the best week of their summer.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-white">
                <Users className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Grades 3rd - 8th</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Mon - Fri, Full Day</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Trophy className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>NBA All-Star Friday</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <MapPin className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Sparta, NJ &bull; 16 Baskets</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Smile className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Theme Days Every Day</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Calendar className="w-5 h-5 text-tbf-gold flex-shrink-0" />
                <span>Multiple Weeks Available</span>
              </div>
            </div>

            <p className="text-sm text-gray-400">
              Serving families from Sparta, Jefferson, Newton, Rockaway, Dover, Hopatcong, Vernon, Byram, Stanhope, Lafayette, West Milford, Kinnelon, Butler, Boonton, Parsippany &amp; all of Sussex &amp; Morris County.
            </p>
          </div>

          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/summer-basketball-camp-banner-sparta-nj.jpeg"
              alt="Kids having fun at The Basketball Factory summer basketball camp in Sparta NJ"
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
