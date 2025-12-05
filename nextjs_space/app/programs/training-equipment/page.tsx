import { Metadata } from 'next';
import Header from '@/components/header';
import { ShoppingCart, Package, TrendingUp, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TBF Skillz Training Equipment | The Basketball Factory Sparta NJ',
  description: 'Professional-grade basketball training equipment from The Basketball Factory. Train at home with coach-recommended gear.',
  keywords: 'basketball training equipment, basketball gear Sparta NJ, basketball training tools, basketball equipment online',
};

export default function TrainingEquipmentPage() {
  const equipment = [
    {
      name: 'Resistance Bands Set',
      price: '$29.99',
      description: 'Professional resistance bands for strength and conditioning training.',
      features: ['5 resistance levels', 'Includes door anchor', 'Portable design', 'TBF branded'],
    },
    {
      name: 'Agility Ladder (15ft)',
      price: '$24.99',
      description: 'Improve footwork and agility with our professional 15ft agility ladder.',
      features: ['15 adjustable rungs', 'Durable material', 'Carrying bag included', 'Weather resistant'],
    },
    {
      name: 'Training Cones (Set of 12)',
      price: '$19.99',
      description: 'High-visibility training cones for drills and skill development.',
      features: ['12 cones included', 'Bright colors', 'Stackable design', 'Lightweight'],
    },
    {
      name: 'Shooting Aid Strap',
      price: '$34.99',
      description: 'Develop perfect shooting form with our innovative shooting aid strap.',
      features: ['Adjustable fit', 'Improves form', 'Used by pros', 'One size fits all'],
    },
    {
      name: 'Dribble Goggles',
      price: '$14.99',
      description: 'Improve ball handling by limiting vision with dribble training goggles.',
      features: ['Adjustable strap', 'Comfortable fit', 'Durable plastic', 'Universal size'],
    },
    {
      name: 'Basketball Training Bundle',
      price: '$99.99',
      description: 'Complete training package with all essential equipment. Save $25!',
      features: ['All items included', 'Best value', 'TBF training bag', 'Coach recommended'],
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header alwaysDark />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#C8B273_1px,transparent_1px),linear-gradient(to_bottom,#C8B273_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block bg-tbf-gold/10 border border-tbf-gold px-4 py-2 rounded-full mb-6">
            <span className="text-tbf-gold font-bold text-sm uppercase tracking-wider">Professional Equipment</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-russo-one">
            TBF Skillz <span className="text-tbf-gold">Training Equipment</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
            Elevate your training with TBF Skillz Training Equipment. Professional-grade basketball training tools used by our coaches. Train at home like the pros!
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <Package className="w-10 h-10 text-tbf-gold mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2 font-audiowide">Professional Grade</h3>
              <p className="text-gray-300 text-sm">Same equipment used in our facility</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <TrendingUp className="w-10 h-10 text-tbf-gold mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2 font-audiowide">Coach Recommended</h3>
              <p className="text-gray-300 text-sm">Endorsed by our expert coaching staff</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <Star className="w-10 h-10 text-tbf-gold mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2 font-audiowide">Durable Quality</h3>
              <p className="text-gray-300 text-sm">Built to last through intense training</p>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {equipment.map((item) => (
              <div key={item.name} className="bg-white border-2 border-gray-200 hover:border-tbf-gold rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-20 h-20 text-gray-400" />
                  </div>
                  <div className="absolute top-4 right-4 bg-tbf-gold text-black px-3 py-1 rounded-full font-bold text-sm">
                    {item.price}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-black mb-3 font-russo-one">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  
                  <ul className="space-y-2 mb-6">
                    {item.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                        <Star className="w-4 h-4 text-tbf-gold flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    asChild
                    className="w-full bg-tbf-gold hover:bg-tbf-gold-bright text-black font-bold"
                  >
                    <Link href="/contact-us">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Contact to Order
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            Ready to <span className="text-tbf-gold">Elevate Your Game?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Contact us to order professional training equipment and start training like the pros at home.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-tbf-gold hover:bg-tbf-gold-bright text-black font-bold text-lg px-12 py-6"
          >
            <Link href="/contact-us">
              Contact Us to Order
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
