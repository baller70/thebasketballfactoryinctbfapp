
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Facebook, Instagram, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Image from 'next/image'

interface HeaderProps {
  alwaysDark?: boolean
}

const Header = ({ alwaysDark = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT US', href: '/who-we-are' },
    { name: 'LESSONS', href: '/private-lessons' },
    { name: 'PROGRAMS', href: '/programs' },
    { name: 'STAFF', href: '/staff' },
    { name: 'DIRECTOR', href: '/director' },
    { name: 'WHO WE TRAINED', href: '/who-we-trained' },
    { name: 'SHOP', href: '/shop' },
  ]

  if (!mounted) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        alwaysDark || isScrolled ? 'bg-black' : 'bg-transparent'
      }`}
      suppressHydrationWarning
    >
      {/* Top Bar with Logo and Info */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-[60px] h-[60px] sm:w-[90px] sm:h-[90px] relative flex-shrink-0">
                <Image
                  src="/basketball-factory-main-logo.png"
                  alt="The Basketball Factory Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-[50px] w-[200px] sm:h-[75px] sm:w-[350px] flex-shrink-0">
                <Image
                  src="/basketball-factory-text-logo.png"
                  alt="The Basketball Factory Inc"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {/* Contact Info - Hidden on mobile */}
            <div className="hidden lg:flex flex-col space-y-4 relative">
              {/* Admin Link - Discreet in top right */}
              <Link 
                href="/admin" 
                className="absolute -top-2 -right-2 text-[10px] text-gray-600 hover:text-tbf-gold transition-colors font-mono opacity-60 hover:opacity-100"
                title="Admin Access"
              >
                admin
              </Link>
              
              {/* Location and Hours Row */}
              <div className="flex items-center space-x-12">
                {/* Location */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <Image
                      src="/basketball-hoop-icon.png"
                      alt="Location"
                      width={48}
                      height={48}
                      className="object-contain"
                      style={{ filter: 'invert(1) brightness(2)' }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-white text-base font-bold tracking-wide">38 STATION RD</div>
                    <div className="text-gray-400 text-sm tracking-wide">SPARTA, NJ</div>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 relative flex items-center justify-center">
                    <Image
                      src="/basketball-icon.png"
                      alt="Hours"
                      width={48}
                      height={48}
                      className="object-contain"
                      style={{ filter: 'invert(1) brightness(2)' }}
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-white text-base font-bold tracking-wide">FRI - SAT - CLOSED</div>
                    <div className="text-gray-400 text-sm tracking-wide">SUN-MON: 11AM-07PM</div>
                  </div>
                </div>
              </div>

              {/* Social Icons Row */}
              <div className="flex items-center justify-end space-x-4 pr-2">
                <Link href="https://facebook.com" target="_blank" className="text-white hover:text-tbf-gold transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
                <Link href="https://instagram.com" target="_blank" className="text-white hover:text-tbf-gold transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link href="https://thumbs.dreamstime.com/b/twitter-social-media-icon-button-symbol-inside-design-vector-custom-share-your-topic-post-111036034.jpg" target="_blank" className="text-white hover:text-tbf-gold transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link href="https://pinterest.com" target="_blank" className="text-white hover:text-tbf-gold transition-colors">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Mobile Menu - Simple and Visible */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <button className="bg-tbf-gold p-3 rounded">
                  <Menu className="h-6 w-6 text-white" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black border-tbf-gold">
                <div className="flex flex-col space-y-6 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-white hover:text-tbf-gold transition-colors duration-300 font-medium text-lg font-audiowide"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden lg:flex items-center justify-center space-x-8 py-4">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-semibold transition-colors duration-300 tracking-wide font-audiowide ${
                  index === 0
                    ? 'text-tbf-gold'
                    : 'text-white hover:text-tbf-gold'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
