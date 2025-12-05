
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Newspaper, Send, Users, Phone } from 'lucide-react';

export default function StickyNavMenu() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navItems = [
    {
      id: 'blog',
      label: 'Blog',
      icon: Newspaper,
      href: '/blog',
      isActive: true,
    },
    {
      id: 'newsletter',
      label: 'Newsletter',
      icon: Send,
      href: '/newsletter',
      isActive: true,
    },
    {
      id: 'social',
      label: 'Social Media',
      icon: Users,
      href: '#',
      isActive: false,
    },
    {
      id: 'contact',
      label: 'Contact Us',
      icon: Phone,
      href: '/contact-us',
      isActive: true,
    },
  ];

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isHovered = hoveredItem === item.id;

        return (
          <div
            key={item.id}
            className="relative"
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            {item.isActive ? (
              <Link
                href={item.href}
                className="flex items-center justify-end"
              >
                {/* Label - slides out from left on hover */}
                <div
                  className={`
                    bg-white text-black px-4 py-3 rounded-l-lg font-audiowide text-sm font-bold
                    transition-all duration-300 ease-in-out
                    ${isHovered ? 'opacity-100 translate-x-0 mr-0' : 'opacity-0 translate-x-4 mr-[-100px] pointer-events-none'}
                  `}
                >
                  {item.label}
                </div>
                
                {/* Icon button - always visible */}
                <div className="bg-white p-4 rounded-l-lg shadow-lg border-l-4 border-[#C8B273] hover:border-[#FFD700] transition-all duration-300">
                  <Icon className="w-6 h-6 text-[#C8B273]" strokeWidth={2.5} />
                </div>
              </Link>
            ) : (
              <div className="flex items-center justify-end opacity-50 cursor-not-allowed">
                {/* Label - slides out from left on hover */}
                <div
                  className={`
                    bg-white text-gray-400 px-4 py-3 rounded-l-lg font-audiowide text-sm font-bold
                    transition-all duration-300 ease-in-out
                    ${isHovered ? 'opacity-100 translate-x-0 mr-0' : 'opacity-0 translate-x-4 mr-[-100px] pointer-events-none'}
                  `}
                >
                  {item.label}
                </div>
                
                {/* Icon button - always visible but disabled */}
                <div className="bg-white p-4 rounded-l-lg shadow-lg border-l-4 border-gray-300">
                  <Icon className="w-6 h-6 text-gray-400" strokeWidth={2.5} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
