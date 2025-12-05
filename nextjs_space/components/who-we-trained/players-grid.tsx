'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GraduationCap, Award } from 'lucide-react'

interface Player {
  name: string
  image: string
  college: string
  collegeLogo: string
  position: string
  classYear: string
  highlights: string[]
}

const players: Player[] = [
  {
    name: "Kenna Squier",
    image: "/trained-players/Kenna Squier.webp",
    college: "New Jersey Institute of Technology",
    collegeLogo: "https://static.abacusaicdn.net/images/2f30a4d2-5277-4dcd-8dc1-1d15cb6c90e2.png",
    position: "Guard",
    classYear: "2024",
    highlights: [
      "1,417 career points (2nd in NJIT D-I History)",
      "189 career steals (1st in NJIT D-I History)",
      "3x America East Third Team All-Conference",
      "Pope John XXIII HS standout",
      "Currently playing professionally"
    ]
  },
  {
    name: "Caileigh Walsh",
    image: "/trained-players/Caileigh Walsh.jpg",
    college: "Northwestern University",
    collegeLogo: "https://static.abacusaicdn.net/images/f9cb448f-ac3e-427a-9d0e-6bbb8466038d.png",
    position: "Forward/Center",
    classYear: "2023",
    highlights: [
      "1,000+ career points at Northwestern",
      "Big Ten Conference competitor",
      "ESPN Top 5 ranked recruit",
      "4-year varsity letter winner",
      "Academic All-Big Ten honors"
    ]
  },
  {
    name: "Jeromy Rodriguez",
    image: "/trained-players/Jeromy Rodriguez.webp",
    college: "East Tennessee State University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/East_Tennessee_State_Buccaneers_logo.svg/1200px-East_Tennessee_State_Buccaneers_logo.svg.png",
    position: "Guard",
    classYear: "2019",
    highlights: [
      "All-Southern Conference selection",
      "Pope John XXIII HS standout",
      "Multi-year development",
      "Strong fundamentals",
      "Team contributor"
    ]
  },
  {
    name: "Alana Robinson",
    image: "/trained-players/Alana Robinson.webp",
    college: "Lock Haven University",
    collegeLogo: "https://static.abacusaicdn.net/images/0748819d-e898-421c-bd30-1e38235d04e7.png",
    position: "Forward",
    classYear: "2026",
    highlights: [
      "PSAC East Defensive Player of the Year (2023-24)",
      "1,000+ career points",
      "School record: All-time career blocks leader (135+)",
      "Pope John XXIII HS All-State",
      "Team defensive leader"
    ]
  },
  {
    name: "Samba Diallo",
    image: "/trained-players/Samba Diallo.jpg",
    college: "University of Massachusetts",
    collegeLogo: "https://static.abacusaicdn.net/images/d5715430-def4-4c98-b3f0-17921755d881.png",
    position: "Forward",
    classYear: "2021",
    highlights: [
      "Rise As One Alumni",
      "Developed through program",
      "Strong fundamentals",
      "6'8\" versatile forward",
      "High-level Division I experience"
    ]
  },
  {
    name: "Harper Felch",
    image: "/trained-players/Harper Felch.webp",
    college: "Academy of Art University",
    collegeLogo: "https://static.abacusaicdn.net/images/6aae231e-ae5e-4f53-a6de-40ee3df77e7a.png",
    position: "Guard",
    classYear: "2024",
    highlights: [
      "1,000+ point scorer (high school)",
      "3x First Team All-Conference",
      "Career-high: 34 points",
      "Pope John XXIII HS standout",
      "Strong offensive player"
    ]
  },
  {
    name: "Madison Miller",
    image: "/trained-players/Madison Miller .webp",
    college: "South Carolina Upstate",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/USC_Upstate_Spartans_logo.svg/1200px-USC_Upstate_Spartans_logo.svg.png",
    position: "Forward",
    classYear: "2025",
    highlights: [
      "6'4\" forward",
      "Redshirt freshman",
      "AAU: 25 PPG, 15 RPG",
      "Division I scholarship athlete",
      "Strong rebounder"
    ]
  },
  {
    name: "Jason Heter",
    image: "/trained-players/Jason Heter.webp",
    college: "Saint Michael's College",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/f/f1/Saint_Michael%27s_College_seal.png",
    position: "Forward",
    classYear: "2022",
    highlights: [
      "3-year team captain",
      "Multiple academic honor roll",
      "Consistent double-digit scorer",
      "Pope John XXIII HS 1,000+ point scorer",
      "Strong leadership qualities"
    ]
  },
  {
    name: "Alex Morici",
    image: "/trained-players/Alex Morici.webp",
    college: "Penn State York",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Penn_State_Nittany_Lions_logo.svg/1200px-Penn_State_Nittany_Lions_logo.svg.png",
    position: "Guard",
    classYear: "2023",
    highlights: [
      "26 games played",
      "Perfect free throw percentage",
      "Dedicated bench player",
      "Pope John XXIII HS All-State",
      "Team contributor"
    ]
  },
  {
    name: "Amanda Nwankwo",
    image: "/trained-players/Amanda Nwankwo.webp",
    college: "Stevenson University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Stevenson_University_logo.svg/1200px-Stevenson_University_logo.svg.png",
    position: "Center",
    classYear: "2024",
    highlights: [
      "Career-high: 17 points",
      "Third Team All-State (Group 2)",
      "Nursing major",
      "Strong rebounder",
      "Versatile player"
    ]
  },
  {
    name: "Dante Joefield",
    image: "/trained-players/Dante Joefield.webp",
    college: "Clarkson University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Clarkson_Golden_Knights.svg/1200px-Clarkson_Golden_Knights.svg.png",
    position: "Guard",
    classYear: "2023",
    highlights: [
      "4-year varsity player (NCAA D-III)",
      "Double-double: 10 points, 13 rebounds",
      "Strong defensive player",
      "Pope John XXIII HS All-Conference",
      "Athletic guard"
    ]
  },
  {
    name: "Erin Walsh",
    image: "/trained-players/Erin Walsh.webp",
    college: "Johns Hopkins University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Johns_Hopkins_University%27s_Academic_Seal.svg/894px-Johns_Hopkins_University%27s_Academic_Seal.svg.png",
    position: "Forward",
    classYear: "2022",
    highlights: [
      "Team captain (senior year)",
      "67 career blocks (13th in program history)",
      "Career-high: 16 points & 9 rebounds",
      "Pope John XXIII HS standout",
      "Academic honors"
    ]
  },
  {
    name: "Fatou Ndao",
    image: "/trained-players/Fatou Ndao .webp",
    college: "Barton CC, Monmouth, Wilmington",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/6/60/Monmouth_Athletics_M.png",
    position: "Forward",
    classYear: "2023",
    highlights: [
      "Third Team Academic All-American",
      "Multiple double-doubles",
      "Career-high: 24 points, 15 rebounds",
      "Played at multiple schools",
      "Strong work ethic"
    ]
  },
  {
    name: "Frakie Rios",
    image: "/trained-players/Frakie Rios.jpg",
    college: "Sussex County Community College",
    collegeLogo: "https://static.abacusaicdn.net/images/09abc785-8c64-444d-a53a-00cf7e772ad3.png",
    position: "Forward",
    classYear: "2020",
    highlights: [
      "Rise As One Alumni",
      "Developed through RA1 system",
      "Strong basketball IQ",
      "Team leader",
      "Versatile forward"
    ]
  },
  {
    name: "Jack Degroot",
    image: "/trained-players/Jack Degroot.webp",
    college: "Marywood University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/4/40/Marywood_University_seal.png",
    position: "Guard",
    classYear: "2020",
    highlights: [
      "Second Team All-Conference",
      "Led team in scoring (17.2 PPG)",
      "Atlantic East Player of the Week",
      "Pope John XXIII HS standout",
      "Strong scorer"
    ]
  },
  {
    name: "James Scott",
    image: "/trained-players/James Scott.webp",
    college: "Temple University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Temple_T_logo.svg/1811px-Temple_T_logo.svg.png",
    position: "Guard",
    classYear: "2022",
    highlights: [
      "Rise As One Alumni",
      "Program development",
      "Strong basketball skills",
      "Team captain",
      "Consistent scorer"
    ]
  },
  {
    name: "Joe Batelli",
    image: "/trained-players/Joe Batelli.jpg",
    college: "Randolph-Macon College",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/2/2b/Randolph_college_seal_400.png",
    position: "Forward",
    classYear: "2021",
    highlights: [
      "Rise As One Alumni",
      "Developed through program",
      "Strong work ethic",
      "Team leader",
      "Academic All-Conference"
    ]
  },
  {
    name: "Joe Morici",
    image: "/trained-players/Joe Morici.webp",
    college: "Penn State York",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Penn_State_Nittany_Lions_logo.svg/1200px-Penn_State_Nittany_Lions_logo.svg.png",
    position: "Forward",
    classYear: "2023",
    highlights: [
      "26 games played",
      "AAU State Champion (2017)",
      "Varsity letterwinner",
      "Pope John XXIII HS All-State",
      "Leadership qualities"
    ]
  },
  {
    name: "Kylie Squier",
    image: "/trained-players/Kylie Squier.webp",
    college: "Chaminade University",
    collegeLogo: "https://assets.chaminade.edu/wp-content/uploads/2025/05/01130324/Athletics_Silversword_Icon.png",
    position: "Guard",
    classYear: "2024",
    highlights: [
      "Academic All-Pacific West Conference",
      "D2 ADA Academic Achievement Award",
      "National Honor Society member",
      "Division II athlete",
      "Strong student-athlete"
    ]
  },
  {
    name: "Mike Atta",
    image: "/trained-players/Mike Atta.webp",
    college: "Rutgers University-Newark",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Rutgers-newark_logo_from_NCAA.svg/1200px-Rutgers-newark_logo_from_NCAA.svg.png",
    position: "Guard",
    classYear: "2022",
    highlights: [
      "NCAA Division III athlete",
      "Rise As One Alumni",
      "Developed through RA1",
      "Pope John XXIII HS All-Conference",
      "Team contributor"
    ]
  },
  {
    name: "Moustapha Diagne",
    image: "/trained-players/Moustapha Diagne.webp",
    college: "La Salle University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/La_Salle_Explorers_primary_logo.svg/2125px-La_Salle_Explorers_primary_logo.svg.png",
    position: "Center",
    classYear: "2021",
    highlights: [
      "Rise As One Alumni",
      "Multi-year development",
      "Strong player",
      "7-footer with great presence",
      "Dominant rebounder"
    ]
  },
  {
    name: "Ray Montilus",
    image: "/trained-players/Ray Montilus.webp",
    college: "Pace University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pace_University_Logo.svg/2560px-Pace_University_Logo.svg.png",
    position: "Guard",
    classYear: "2020",
    highlights: [
      "NCAA Division II player",
      "NE-10 Conference",
      "Pope John XXIII graduate",
      "Strong scorer",
      "Athletic guard"
    ]
  },
  {
    name: "Madison Gore",
    image: "/trained-players/Madison Gore.jpeg",
    college: "Marist College",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Marist_Red_Foxes_logo.svg/1200px-Marist_Red_Foxes_logo.svg.png",
    position: "Guard",
    classYear: "2022",
    highlights: [
      "Rise As One Alumni",
      "Program development",
      "Strong fundamentals",
      "Team contributor",
      "Academic excellence"
    ]
  },
  {
    name: "Mike Zoeliner",
    image: "/trained-players/Mike Zoeliner.webp",
    college: "Gwynedd Mercy University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/a/a2/Gmercyu_seal.png",
    position: "Forward",
    classYear: "2022",
    highlights: [
      "Rise As One Alumni",
      "Program success",
      "Strong fundamentals",
      "Team leader",
      "Versatile forward"
    ]
  },
  {
    name: "Casey Langenbach",
    image: "/trained-players/Casey Langenbach.webp",
    college: "Georgian Court University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/5/5f/GeorgianCourtU_fullcrest.png",
    position: "Guard",
    classYear: "2024",
    highlights: [
      "Academic excellence",
      "Strong work ethic",
      "Team leader",
      "Pope John XXIII HS standout",
      "Consistent performer"
    ]
  },
  {
    name: "Maddison Perna",
    image: "/trained-players/Maddison Perna.webp",
    college: "Monmouth University",
    collegeLogo: "https://upload.wikimedia.org/wikipedia/en/thumb/1/18/Monmouth_Hawks.svg/1200px-Monmouth_Hawks.svg.png",
    position: "Forward",
    classYear: "2022",
    highlights: [
      "Rise As One Alumni",
      "Multi-year player",
      "Strong development",
      "Team contributor",
      "Versatile player"
    ]
  },
]

export default function PlayersGrid() {
  const [filter, setFilter] = useState<string>('all')

  const filteredPlayers = filter === 'all' 
    ? players 
    : players.filter(p => p.position.toLowerCase() === filter.toLowerCase())

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {['all', 'Guard', 'Forward', 'Center'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 ${
                filter === filterOption
                  ? 'bg-tbf-gold text-black shadow-lg shadow-tbf-gold/50'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {filterOption === 'all' ? 'All Players' : `${filterOption}s`}
            </button>
          ))}
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative bg-gradient-to-br from-white to-gray-100 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-tbf-gold/20 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Player Image */}
              <div className="relative h-96 w-full overflow-hidden bg-gray-200">
                <Image
                  src={player.image}
                  alt={player.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Name */}
                <h3 className="text-2xl font-bold text-black mb-3 font-audiowide uppercase">
                  {player.name}
                </h3>

                {/* College with Logo */}
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-300">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={player.collegeLogo}
                      alt={`${player.college} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">College</div>
                    <div className="text-sm font-bold text-black">{player.college}</div>
                  </div>
                </div>

                {/* Position & Class */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-tbf-gold" />
                    <span className="text-sm text-gray-700">{player.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-tbf-gold" />
                    <span className="text-sm text-gray-700">Class of {player.classYear}</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-black uppercase mb-2">Career Highlights:</h4>
                  <ul className="space-y-1.5">
                    {player.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-tbf-gold mt-0.5">▸</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Gold Accent Border on Hover */}
              <div className="absolute inset-0 border-4 border-transparent group-hover:border-tbf-gold rounded-xl pointer-events-none transition-all duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center max-w-3xl mx-auto bg-gradient-to-r from-tbf-gold/10 to-transparent border-l-4 border-tbf-gold rounded-lg p-8"
        >
          <h3 className="text-3xl font-bold text-white mb-4 font-audiowide uppercase">
            YOUR CHILD COULD BE NEXT
          </h3>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            These success stories represent the dedication, hard work, and expert training that The Basketball Factory provides. 
            Join us and become part of our legacy of excellence in basketball player development.
          </p>
          <a
            href="/private-lessons"
            className="inline-block px-8 py-4 bg-tbf-gold text-black font-bold uppercase tracking-wider rounded-lg hover:bg-tbf-gold/90 transition-all duration-300 shadow-lg hover:shadow-tbf-gold/50"
          >
            Start Your Journey Today
          </a>
        </motion.div>
      </div>
    </section>
  )
}
