#!/usr/bin/env python3
"""
Script to generate all program component files based on templates
"""

programs_data = {
    'hs-spring': {
        'dir': 'hs-spring',
        'prefix': 'HSSpring',
        'page_path': 'app/programs/hs-spring-circuit/page.tsx',
        'title_line1': 'HS SPRING CIRCUIT',
        'title_line2': 'SKILL TRAINING',
        'season': 'Spring 2025',
        'short_desc': 'AAU Tournament Preparation',
        'long_desc': 'Elevate your game with our High School Spring Circuit. Focused training to prepare you for competitive AAU tournaments and spring basketball.',
        'ages': 'Grades 9-12',
        'schedule': 'Mon & Wed',
        'time': '6:00 PM - 7:30 PM',
        'stats': [
            {'value': '8', 'label': 'Weeks'},
            {'value': 'Mon & Wed', 'label': 'Training Days'},
            {'value': '9-12', 'label': 'Grades'}
        ],
        'dates': [
            {'month': 'MAR', 'year': '2025', 'dates': ['3', '5', '10', '12', '17', '19', '24', '26', '31']},
            {'month': 'APR', 'year': '2025', 'dates': ['2', '7', '9', '14', '16', '21', '23', '28', '30']}
        ],
        'image': '/fall-program-hs.png',
        'overview_title': 'WHY SPRING CIRCUIT?',
        'overview_subtitle': 'Get tournament-ready with specialized AAU preparation designed for high school competitive players.',
        'features': [
            {'title': 'AAU Preparation', 'desc': 'Focused training specifically designed for competitive AAU tournament play.'},
            {'title': 'Advanced Skills', 'desc': 'Develop elite-level skills including shooting, ball handling, and game strategy.'},
            {'title': 'Tournament Ready', 'desc': 'Build confidence and readiness for high-pressure tournament situations.'},
            {'title': 'Team Concepts', 'desc': 'Learn advanced offensive and defensive systems used at competitive levels.'}
        ],
        'cta_title': 'READY TO DOMINATE AAU SEASON?',
        'cta_subtitle': 'Get the competitive edge you need for spring tournaments and AAU success.',
        'meta_desc': 'Elevate your game with our High School Spring Circuit at The Basketball Factory in Sparta, NJ. AAU tournament preparation.'
    },
    'ms-winter': {
        'dir': 'ms-winter',
        'prefix': 'MSWinter',
        'page_path': 'app/programs/ms-winter-workouts/page.tsx',
        'title_line1': 'MIDDLE SCHOOL',
        'title_line2': 'WINTER WORKOUTS',
        'season': 'Winter 2025',
        'short_desc': 'Develop Your Game During Basketball Season',
        'long_desc': 'Keep your skills sharp throughout the winter season with specialized training designed for middle school athletes.',
        'ages': 'Grades 6-8',
        'schedule': 'Tue & Thu',
        'time': '6:00 PM - 7:30 PM',
        'stats': [
            {'value': '8', 'label': 'Weeks'},
            {'value': 'Tue & Thu', 'label': 'Training Days'},
            {'value': '6-8', 'label': 'Grades'}
        ],
        'dates': [
            {'month': 'DEC', 'year': '2024', 'dates': ['3', '5', '10', '12', '17', '19']},
            {'month': 'JAN', 'year': '2025', 'dates': ['7', '9', '14', '16', '21', '23', '28', '30']},
            {'month': 'FEB', 'year': '2025', 'dates': ['4', '6', '11', '13']}
        ],
        'image': '/fall-program-ms.png',
        'overview_title': 'WHY WINTER WORKOUTS?',
        'overview_subtitle': 'Keep your skills sharp and continue developing throughout the winter basketball season.',
        'features': [
            {'title': 'Skill Development', 'desc': 'Focus on fundamental basketball skills and proper technique.'},
            {'title': 'Age-Appropriate', 'desc': 'Training designed specifically for middle school athletes\' development.'},
            {'title': 'Game Application', 'desc': 'Learn how to apply skills in real game situations.'},
            {'title': 'Confidence Building', 'desc': 'Build self-assurance through progressive skill mastery.'}
        ],
        'cta_title': 'READY TO LEVEL UP THIS SEASON?',
        'cta_subtitle': 'Keep your game sharp and competitive throughout the winter season.',
        'meta_desc': 'Develop your game during the winter season with our Middle School Winter Workouts at The Basketball Factory in Sparta, NJ.'
    },
    'ms-spring': {
        'dir': 'ms-spring',
        'prefix': 'MSSpring',
        'page_path': 'app/programs/ms-spring-circuit/page.tsx',
        'title_line1': 'MS SPRING CIRCUIT',
        'title_line2': 'SKILL TRAINING',
        'season': 'Spring 2025',
        'short_desc': 'AAU Tournament Preparation',
        'long_desc': 'Develop your skills with our Middle School Spring Circuit. Perfect for AAU season preparation and competitive play.',
        'ages': 'Grades 6-8',
        'schedule': 'Tue & Thu',
        'time': '6:00 PM - 7:30 PM',
        'stats': [
            {'value': '10', 'label': 'Weeks'},
            {'value': 'Tue & Thu', 'label': 'Training Days'},
            {'value': '6-8', 'label': 'Grades'}
        ],
        'dates': [
            {'month': 'MAR', 'year': '2025', 'dates': ['4', '6', '11', '13', '18', '20', '25', '27']},
            {'month': 'APR', 'year': '2025', 'dates': ['1', '3', '8', '10', '15', '17', '22', '24', '29']},
            {'month': 'MAY', 'year': '2025', 'dates': ['1', '6', '8']}
        ],
        'image': '/fall-program-ms.png',
        'overview_title': 'WHY SPRING CIRCUIT?',
        'overview_subtitle': 'Get ready for competitive AAU season with focused skill training for middle school athletes.',
        'features': [
            {'title': 'AAU Preparation', 'desc': 'Get ready for competitive AAU season with focused skill training.'},
            {'title': 'Fundamental Focus', 'desc': 'Master the fundamentals needed for competitive middle school basketball.'},
            {'title': 'Team Play', 'desc': 'Learn to work effectively within a team structure.'},
            {'title': 'Competition Ready', 'desc': 'Build the confidence and skills to compete at the next level.'}
        ],
        'cta_title': 'READY FOR AAU COMPETITION?',
        'cta_subtitle': 'Prepare for competitive spring basketball with our specialized training program.',
        'meta_desc': 'Develop your skills with our Middle School Spring Circuit at The Basketball Factory in Sparta, NJ. Perfect for AAU season prep.'
    }
}

def generate_hero(data):
    return f"""'use client'

import {{ motion }} from 'framer-motion'
import {{ ArrowDown }} from 'lucide-react'
import {{ Button }} from '@/components/ui/button'
import Image from 'next/image'

export default function {data['prefix']}Hero() {{
  const scrollToBooking = () => {{
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {{
      bookingSection.scrollIntoView({{ behavior: 'smooth' }})
    }}
  }}

  const scrollToDetails = () => {{
    const detailsSection = document.getElementById('overview-section')
    if (detailsSection) {{
      detailsSection.scrollIntoView({{ behavior: 'smooth' }})
    }}
  }}

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="{data['image']}"
          alt="{data['title_line1']} {data['title_line2']}"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      <div className="absolute inset-0 z-[1] opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-tbf-gold rounded-full animate-pulse" />
        <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-tbf-gold rounded-full animate-pulse delay-75" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-tbf-gold rounded-full animate-pulse delay-150" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{{{ opacity: 0, y: 30 }}}}
          animate={{{{ opacity: 1, y: 0 }}}}
          transition={{{{ duration: 0.8 }}}}
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-tbf-gold/20 border border-tbf-gold rounded-full mb-8">
            <span className="w-2 h-2 bg-tbf-gold rounded-full animate-pulse" />
            <span className="text-tbf-gold font-bold text-sm tracking-wider uppercase">
              {data['season']} Program
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-russo-one">
            {data['title_line1']}<br />
            <span className="text-tbf-gold">{data['title_line2']}</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-3xl mx-auto font-medium">
            {data['short_desc']}
          </p>
          
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            {data['long_desc']}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {[data['stats'][i] for i in range(len(data['stats']))]}
            <div className="bg-black/50 backdrop-blur-sm border border-tbf-gold/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-tbf-gold mb-2 font-russo-one">{data['stats'][0]['value']}</div>
              <div className="text-white/80 text-sm">{data['stats'][0]['label']}</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-tbf-gold/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-tbf-gold mb-2 font-russo-one">{data['stats'][1]['value']}</div>
              <div className="text-white/80 text-sm">{data['stats'][1]['label']}</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-tbf-gold/30 rounded-lg p-6">
              <div className="text-3xl font-bold text-tbf-gold mb-2 font-russo-one">{data['stats'][2]['value']}</div>
              <div className="text-white/80 text-sm">{data['stats'][2]['label']}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={{scrollToBooking}}
              className="bg-tbf-gold hover:bg-tbf-gold/90 text-black font-bold text-lg px-8 py-6 rounded-none w-full sm:w-auto"
            >
              Register Now
            </Button>
            <Button
              onClick={{scrollToDetails}}
              variant="outline"
              className="border-2 border-tbf-gold text-tbf-gold hover:bg-tbf-gold hover:text-black font-bold text-lg px-8 py-6 rounded-none w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{{{ opacity: 0 }}}}
          animate={{{{ opacity: 1 }}}}
          transition={{{{ delay: 1, duration: 1 }}}}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={{scrollToDetails}}
            className="text-white/60 hover:text-tbf-gold transition-colors"
            aria-label="Scroll down"
          >
            <ArrowDown className="w-8 h-8 animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}}
"""

# Generate files for each program
for prog_key, data in programs_data.items():
    hero_content = generate_hero(data)
    with open(f"components/programs/{data['dir']}/hero-section.tsx", 'w') as f:
        f.write(hero_content)
    print(f"✓ Created hero for {prog_key}")

print(f"\n✅ Generated hero sections for {len(programs_data)} programs")

