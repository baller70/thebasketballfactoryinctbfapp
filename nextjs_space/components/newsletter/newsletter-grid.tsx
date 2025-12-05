
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function NewsletterGrid() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic
    setSubscribeStatus('Thank you for subscribing!');
    setEmail('');
    setTimeout(() => setSubscribeStatus(''), 3000);
  };

  return (
    <section className="bg-black py-20">
      <div className="container mx-auto px-4">
        
        {/* FEATURED EDITION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          {/* Paper Plane Icon */}
          <div className="flex items-center justify-center mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C8B273"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12 font-audiowide uppercase">
            FEATURED EDITION
          </h2>

          {/* Volume 1 Card */}
          <div className="max-w-5xl mx-auto">
            <Link href="/newsletter/volume-1">
              <div className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border-2 border-[#C8B273]/20 hover:border-[#C8B273] transition-all duration-500 hover:shadow-2xl hover:shadow-[#C8B273]/30">
                <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
                  {/* Left side - Volume Badge */}
                  <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#C8B273]/10 to-transparent rounded-xl p-12 border border-[#C8B273]/30">
                    <div className="bg-[#C8B273] text-black text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-wider">
                      VOLUME 1
                    </div>
                    <h3 className="text-5xl md:text-7xl font-bold text-white mb-4 text-center font-audiowide uppercase">
                      VOLUME 1
                    </h3>
                    <div className="h-px w-24 bg-[#C8B273] mb-4"></div>
                    <p className="text-xl text-[#C8B273] font-semibold uppercase tracking-wide text-center font-audiowide">
                      The Beginning
                    </p>

                    {/* Rise As One Logo placeholder */}
                    <div className="mt-8 w-32 h-32 bg-[#C8B273]/10 rounded-full border-2 border-[#C8B273]/30 flex items-center justify-center">
                      <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C8B273"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                      </svg>
                    </div>
                  </div>

                  {/* Right side - Content */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <span className="w-2 h-2 bg-[#C8B273] rounded-full"></span>
                      <span>January 2024</span>
                    </div>

                    <h4 className="text-3xl md:text-4xl font-bold text-white mb-6 font-audiowide uppercase">
                      The Basketball Factory: The Beginning
                    </h4>

                    <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                      Welcome to the inaugural edition of our newsletter. Discover our mission, meet our coaching staff, and learn about the exciting programs we have planned for the season.
                    </p>

                    {/* Topic Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {['Program Launch', 'Coaching Staff', 'Season Preview'].map((topic) => (
                        <span
                          key={topic}
                          className="text-xs bg-[#C8B273]/10 text-[#C8B273] px-3 py-1 rounded-full border border-[#C8B273]/30 font-semibold"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Read Button */}
                    <Button className="w-full md:w-auto bg-[#C8B273] hover:bg-[#FFD700] text-black font-bold py-6 px-8 text-lg transition-all duration-300 group-hover:translate-x-2">
                      Read Newsletter
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* NEVER MISS AN EDITION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          {/* Paper Plane Icon */}
          <div className="flex items-center justify-center mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#C8B273"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 font-audiowide uppercase">
            NEVER MISS AN EDITION
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Subscribe to receive the latest Basketball Factory newsletters delivered directly to your inbox. Stay informed about player achievements, training tips, and exclusive basketball insights.
          </p>

          {/* Subscription Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-gray-900 border-2 border-[#C8B273]/30 focus:border-[#C8B273] text-white px-6 py-4 rounded-lg focus:outline-none transition-colors"
                />
                <Button
                  type="submit"
                  className="bg-[#C8B273] hover:bg-[#FFD700] text-black font-bold px-8 py-4 rounded-lg transition-all duration-300 whitespace-nowrap"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Subscribe
                </Button>
              </div>
              {subscribeStatus && (
                <p className="text-[#C8B273] text-center mt-4 font-semibold">{subscribeStatus}</p>
              )}
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </motion.div>

        {/* STATISTICS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-[#C8B273]/20">
            <div className="text-5xl font-bold text-[#C8B273] mb-2 font-audiowide">1</div>
            <div className="text-gray-400 uppercase tracking-wider text-sm font-semibold">Total Editions</div>
          </div>
          <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-[#C8B273]/20">
            <div className="text-5xl font-bold text-[#C8B273] mb-2 font-audiowide">1K+</div>
            <div className="text-gray-400 uppercase tracking-wider text-sm font-semibold">Subscribers</div>
          </div>
          <div className="text-center p-8 bg-gray-900/50 rounded-xl border border-[#C8B273]/20">
            <div className="text-5xl font-bold text-[#C8B273] mb-2 font-audiowide">100%</div>
            <div className="text-gray-400 uppercase tracking-wider text-sm font-semibold">Basketball Excellence</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
