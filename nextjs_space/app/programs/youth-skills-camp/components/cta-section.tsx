
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <div className="bg-white border-2 border-tbf-gold rounded-2xl p-12 shadow-xl">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            Ready to <span className="text-tbf-gold">Register?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Give your young athlete the foundation they need to succeed. Register today for our youth skills camp!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-tbf-gold hover:bg-tbf-gold-bright text-black font-bold text-lg px-12 py-6"
            >
              <Link href="/contact-us">
                Register Now
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 hover:border-tbf-gold text-black font-bold text-lg px-12 py-6"
            >
              <Link href="/contact-us">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
