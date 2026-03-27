import { MapPin, Clock, Users, Shield, Car } from 'lucide-react';

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
            Camp <span className="text-tbf-gold">Details</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything parents need to know about our summer basketball camp in Sparta, NJ.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Who It's For */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">Who It&apos;s For</h3>
            <p className="text-gray-600 leading-relaxed">
              Boys and girls in <strong>grades 3rd through 8th</strong>, all skill levels welcome. Whether your child is just starting out or has been playing for years, our coaches meet every kid where they are. The focus is on fun, friendship, and falling in love with the game.
            </p>
          </div>

          {/* Schedule & Hours */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">Schedule</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Camp runs <strong>Monday through Friday</strong>, full day. Multiple weeks available throughout the summer — sign up for one week or come back every week!
            </p>
            <p className="text-gray-500 text-sm">
              Specific dates and hours will be announced soon. Check back or contact us to be notified when registration opens.
            </p>
          </div>

          {/* The Facility */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">Our Facility</h3>
            <p className="text-gray-600 leading-relaxed">
              <strong>16 baskets</strong> under one roof at 38 Station Rd, Sparta, NJ 07871. Every kid gets maximum reps and playing time — no standing around waiting for a turn. Climate-controlled, safe, and purpose-built for basketball.
            </p>
          </div>

          {/* Safety & Staff */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
            <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-tbf-gold" />
            </div>
            <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">Staff &amp; Safety</h3>
            <p className="text-gray-600 leading-relaxed">
              Led by Kevin Houston and a team of experienced coaches, plus local high school players who serve as counselors. Kids look up to the older players, and it creates an incredible energy. Your child is in good hands — we prioritize safety, sportsmanship, and a positive environment.
            </p>
          </div>
        </div>

        {/* Lunch & What to Bring */}
        <div className="bg-tbf-gold/5 border-2 border-tbf-gold/20 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-black mb-4 font-russo-one text-center">What to Bring</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-bold text-black mb-1">Wear</p>
              <p className="text-gray-600 text-sm">Athletic clothes &amp; basketball shoes (indoor, non-marking)</p>
            </div>
            <div>
              <p className="font-bold text-black mb-1">Bring</p>
              <p className="text-gray-600 text-sm">Water bottle, towel, positive attitude. Lunch is optional — pizza &amp; subs available for purchase daily</p>
            </div>
            <div>
              <p className="font-bold text-black mb-1">We Provide</p>
              <p className="text-gray-600 text-sm">All basketballs &amp; equipment. Gatorade &amp; water available for purchase</p>
            </div>
          </div>
        </div>

        {/* Towns We Serve - Local SEO */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <Car className="w-6 h-6 text-tbf-gold" />
            <h3 className="text-xl font-bold text-black font-audiowide">Families Come From All Over Northern NJ</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Our summer basketball camp draws kids from across Sussex County, Morris County, and beyond. We&apos;re centrally located in Sparta, NJ — an easy drive for families throughout northern New Jersey.
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
