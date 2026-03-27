import { MapPin, Clock, Users, Shield, Car, Calendar } from 'lucide-react';

export default function DetailsSection() {
  const towns = [
    'Sparta', 'Jefferson', 'Newton', 'Rockaway', 'Dover', 'Hopatcong',
    'Lake Mohawk', 'Byram', 'Stanhope', 'Andover', 'Hamburg', 'Vernon',
    'West Milford', 'Butler', 'Kinnelon', 'Boonton', 'Parsippany',
    'Lafayette', 'Montague', 'Wantage', 'Franklin', 'Ogdensburg',
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            Program <span className="text-tbf-gold">Details</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything parents need to know about our youth basketball skills training camp.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Schedule */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">Schedule</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-bold text-black text-lg">Monday, Tuesday, Wednesday</p>
                <p className="text-tbf-gold font-bold">10:00 AM - 11:30 AM</p>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Runs the <strong>entire summer</strong> — starting the Monday after the 4th of July and continuing through the last week of August. Drop in for any session or come all summer long.
              </p>
            </div>
          </div>

          {/* Who It's For */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">Who It&apos;s For</h3>
            <p className="text-gray-600 leading-relaxed">
              Boys and girls who want to get better at basketball. All skill levels welcome — whether your child is just learning the basics or looking to sharpen their game before the school season. The coaching staff meets every kid where they are and helps them improve.
            </p>
          </div>

          {/* The Facility */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">Our Facility</h3>
            <p className="text-gray-600 leading-relaxed">
              <strong>16 baskets</strong> under one roof at 38 Station Rd, Sparta, NJ 07871. Every kid gets maximum reps — no standing around in line. Climate-controlled and purpose-built for basketball training.
            </p>
          </div>

          {/* What to Bring */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">What to Bring</h3>
            <p className="text-gray-600 leading-relaxed">
              Athletic clothes, basketball shoes (indoor, non-marking soles), and a water bottle. We provide all basketballs and equipment. Just show up ready to work and have fun.
            </p>
          </div>
        </div>

        {/* Towns We Serve */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-6 h-6 text-tbf-gold" />
            <h3 className="text-xl font-bold text-black font-audiowide">Families Come From All Over Northern NJ</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our youth basketball skills training draws kids from across Sussex County, Morris County, and beyond. Located in Sparta, NJ — an easy morning drive for families throughout northern New Jersey.
          </p>
          <div className="flex flex-wrap gap-2">
            {towns.map((town) => (
              <span key={town} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {town}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
