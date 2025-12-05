
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' }
  ]

  const popularLinks = [
    { name: 'HOME', href: '/' },
    { name: 'WHO WE ARE', href: '/who-we-are' },
    { name: 'PRIVATE LESSONS', href: '/private-lessons' },
    { name: 'FREE APPS', href: '/free-apps' },
    { name: 'STAFF', href: '/staff' },
    { name: 'DIRECTOR', href: '/director' },
    { name: 'SHOP', href: '#shop' },
    { name: 'CONTACT US', href: '/contact-us' }
  ]

  // Placeholder Instagram images - replace with actual images
  const instagramImages = [
    '/spring-basketball-programs-sparta-nj.png',
    '/summer-basketball-programs-sparta-nj.png',
    '/fall-basketball-programs-sparta-nj.png',
    '/winter-basketball-programs-sparta-nj.png',
    '/boys-aau-basketball-team-sparta-nj.png',
    '/girls-aau-basketball-team-sparta-nj.png'
  ]

  return (
    <footer 
      className="relative bg-gray-200 text-gray-800 overflow-hidden"
      style={{
        backgroundImage: 'url(/basketball-factory-footer-logo.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Light overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-200/70 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Left Section - MEET THE BASKETBALL FACTORY */}
          <div>
            <div className="mb-6">
              <div className="w-24 h-24 relative mb-4">
                <Image
                  src="/basketball-factory-main-logo.png"
                  alt="RA1 Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-gray-900 font-bold text-lg mb-4" style={{ fontFamily: 'Audiowide, sans-serif' }}>
                MEET <span className="text-white">THE BASKETBALL FACTORY</span>
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                Premier youth basketball skill training in Sparta, NJ for ages 7-18. Expert trainers develop shooting, ball handling, defense, and game IQ in a fun, supportive environment.
              </p>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-tbf-gold hover:bg-tbf-gold/90 transition-colors flex items-center justify-center shadow-md"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5 text-white" />
                </Link>
              ))}
            </div>
          </div>

          {/* Instagram Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
              INSTAGRAM
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {instagramImages.map((img, index) => (
                <Link
                  key={index}
                  href="#"
                  className="relative aspect-square overflow-hidden rounded hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={img}
                    alt={`Instagram post ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Sponsors Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
              SPONSORS
            </h3>
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-white/90 p-2">
                <Image
                  src="https://cdn.abacus.ai/images/47475b4f-69ec-415f-9990-3e25c3dafca4.png"
                  alt="ProHoops Sports Sponsor"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-white/90 p-2">
                <Image
                  src="https://cdn.abacus.ai/images/26e3a284-f25e-45e7-af35-45b3568fcd4f.png"
                  alt="Elite Court Athletics Sponsor"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-white/90 p-2">
                <Image
                  src="https://cdn.abacus.ai/images/f18051ea-23cc-4c3b-a069-961a9303a716.png"
                  alt="Victory Basketball Gear Sponsor"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Popular Links Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6" style={{ fontFamily: 'Audiowide, sans-serif' }}>
              POPULAR
            </h3>
            <ul className="space-y-3">
              {popularLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-semibold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="relative z-10 border-t border-gray-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            © {new Date().getFullYear()} The Basketball Factory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
