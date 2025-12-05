
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Clock, Users, MapPin, ChevronRight } from 'lucide-react';

const programs = [
  {
    id: 1,
    category: 'high-school',
    title: 'HS Spring Circuit Skill Training',
    image: '/fall-high-school-basketball-training-sparta-nj.png',
    ageGroup: 'Ages 14-18',
    duration: '8 Weeks',
    schedule: 'Mon & Wed, 6:00-7:30 PM',
    location: 'Sparta, NJ',
    description: 'Elevate your game with our High School Spring Circuit at The Basketball Factory in Sparta, New Jersey. Focus on advanced ball handling, shooting, and finishing skills to dominate AAU tournaments and spring competition.',
    highlights: [
      'Advanced skill circuits',
      'Game speed training',
      'Tournament preparation',
      'Position-specific work'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/hs-spring-circuit',
    learnMoreLink: '/programs/hs-spring-circuit',
  },
  {
    id: 2,
    category: 'middle-school',
    title: 'MS Spring Circuit Skill Training',
    image: '/fall-middle-school-basketball-training-sparta-nj.png',
    ageGroup: 'Ages 11-14',
    duration: '10 Weeks',
    schedule: 'Tue & Thu, 5:00-6:30 PM',
    location: 'Sparta, NJ',
    description: 'Develop your skills with our Middle School Spring Circuit at The Basketball Factory in Sparta, New Jersey. Perfect for young athletes preparing for AAU season and spring tournaments.',
    highlights: [
      'Ball handling circuits',
      'Shooting mechanics',
      'Game situation training',
      'AAU preparation'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/ms-spring-circuit',
    learnMoreLink: '/programs/ms-spring-circuit',
  },
  {
    id: 3,
    category: 'youth',
    title: 'Youth Spring Open Gym',
    image: '/fall-youth-basketball-open-gym-sparta-nj.png',
    ageGroup: 'Ages 7-12',
    duration: 'Ongoing',
    schedule: 'Saturdays, 10:00-11:30 AM',
    location: 'Sparta, NJ',
    description: 'Join our Spring Open Gym sessions at The Basketball Factory in Sparta, New Jersey. Enjoy flexible practice time, hone your skills, and play with other local athletes in a competitive yet friendly environment!',
    highlights: [
      'Supervised play sessions',
      'Skill practice time',
      'Pickup games',
      'Drop-in flexibility'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/youth-spring-open-gym',
    learnMoreLink: '/programs/youth-spring-open-gym',
  },
  {
    id: 4,
    category: 'private',
    title: 'Kevin Houston Individual Lessons',
    image: '/fall-private-basketball-lessons-kevin-houston.png',
    ageGroup: 'All Ages',
    duration: 'Flexible',
    schedule: 'By Appointment',
    location: 'Sparta, NJ',
    description: 'Improve your game with Kevin Houston Lessons at The Basketball Factory in Sparta, New Jersey. Get personalized basketball training from a seasoned coach to master your skills and boost your performance!',
    highlights: [
      'One-on-one coaching',
      'Customized training plans',
      'Flexible scheduling',
      '20+ years experience'
    ],
    ctaText: 'Book a Lesson',
    ctaLink: '/private-lessons',
  },
  {
    id: 5,
    category: 'subscription',
    title: 'TBF Yearly Training Subscription',
    image: '/fall-high-school-basketball-training-sparta-nj.png',
    ageGroup: 'Ages 7-18',
    duration: '12 Months',
    schedule: 'Flexible Access',
    location: 'Sparta, NJ',
    description: 'Get year-round access to all TBF training programs with our Yearly Training Subscription. Unlimited attendance to open gyms, skill sessions, and special clinics. The best value for serious athletes committed to improvement.',
    highlights: [
      'Unlimited program access',
      'Year-round training',
      'Best value option',
      'Priority registration'
    ],
    ctaText: 'Subscribe Now',
    ctaLink: '/contact-us',
    learnMoreLink: '/contact-us',
  },
  {
    id: 6,
    category: 'equipment',
    title: 'TBF Skillz Training Equipment',
    image: '/fall-youth-basketball-open-gym-sparta-nj.png',
    ageGroup: 'All Ages',
    duration: 'One-Time Purchase',
    schedule: 'N/A',
    location: 'Online/In-Person',
    description: 'Elevate your training with TBF Skillz Training Equipment. Professional-grade basketball training tools used by our coaches. Includes resistance bands, agility ladders, cones, shooting aids, and more.',
    highlights: [
      'Professional equipment',
      'Coach-recommended gear',
      'Train at home',
      'Durable quality'
    ],
    ctaText: 'Shop Equipment',
    ctaLink: '/programs/training-equipment',
    learnMoreLink: '/programs/training-equipment',
  },
  {
    id: 7,
    category: 'free-programs',
    title: 'Little Ballers Introduction Clinic',
    image: '/fall-little-ballers-basketball-clinic.png',
    ageGroup: 'Ages 7-10',
    duration: '4 Weeks',
    schedule: 'Saturdays, 9:00-10:00 AM',
    location: 'Sparta, NJ',
    description: 'FREE basketball clinic in Sparta, NJ for your child! Part of The Basketball Factory Youth Initiative, this beginner-friendly program helps kids ages 7-10 build confidence, make new friends, and discover their love for basketball in a fun, supportive environment. No experience needed—just bring your enthusiasm!',
    highlights: [
      'FREE registration for all families',
      'Builds confidence & social skills',
      'Age-appropriate skill games',
      'Positive, encouraging coaches'
    ],
    ctaText: 'Sign Up FREE',
    ctaLink: '/programs/free-youth-program',
    learnMoreLink: '/programs/free-youth-program',
  },
  {
    id: 8,
    category: 'free-programs',
    title: 'Future Stars Skills Development',
    image: '/fall-future-stars-basketball-skills-program.png',
    ageGroup: 'Ages 7-10',
    duration: '4 Weeks',
    schedule: 'Sundays, 10:00-11:00 AM',
    location: 'Sparta, NJ',
    description: 'FREE youth basketball program in Sparta, Sussex County! Give your child the gift of basketball this spring. Our Future Stars clinic teaches fundamental skills through fun games and activities. Perfect for kids ages 7-10 who want to learn basketball basics, stay active, and make lasting friendships. Spaces are limited!',
    highlights: [
      'Completely FREE—no hidden fees',
      'Learn dribbling, shooting & passing',
      'Safe, welcoming environment',
      'Small group instruction'
    ],
    ctaText: 'Reserve Spot FREE',
    ctaLink: '/contact-us',
  },
  {
    id: 9,
    category: 'free-programs',
    title: 'Youth Basketball Basics Workshop',
    image: '/fall-youth-basketball-basics-workshop.png',
    ageGroup: 'Ages 7-10',
    duration: '4 Weeks',
    schedule: 'Saturdays, 11:00 AM-12:00 PM',
    location: 'Sparta, NJ',
    description: 'FREE community basketball workshop for Sussex County families! Watch your child thrive in our beginner basketball program designed for ages 7-10 in Sparta, NJ. Professional coaches create a positive, pressure-free environment where kids learn fundamentals, develop coordination, and have fun. Perfect first step into youth sports!',
    highlights: [
      '100% FREE community program',
      'Professional coaching included',
      'Focus on fun & fundamentals',
      'Builds teamwork & confidence'
    ],
    ctaText: 'Enroll FREE Today',
    ctaLink: '/contact-us',
  },
];

export default function SpringProgramsGrid() {
  const [activeTab, setActiveTab] = useState('all');

  const getFilteredPrograms = (tabValue: string) => {
    return tabValue === 'all' 
      ? programs 
      : programs.filter(p => p.category === tabValue);
  };

  const renderProgramCard = (program: typeof programs[0], index: number) => (
    <motion.div
      key={program.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="bg-white border-2 border-gray-200 hover:border-tbf-gold rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <div className="grid md:grid-cols-[350px,1fr] gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-full bg-gray-100 order-1 md:order-1">
            <Image
              src={program.image}
              alt={`${program.title} - Basketball Training Sparta NJ`}
              fill
              className="object-cover object-left"
              sizes="350px"
            />
          </div>

          {/* Content */}
          <div className="p-8 flex flex-col justify-between order-2 md:order-2">
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="bg-tbf-gold text-black px-3 py-1 rounded-full text-sm font-bold">
                  {program.ageGroup}
                </span>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{program.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{program.location}</span>
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 font-russo-one">
                {program.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-700 mb-4">
                <Users className="w-5 h-5 text-tbf-gold" />
                <span className="font-semibold">{program.schedule}</span>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {program.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {program.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-tbf-gold flex-shrink-0" />
                    <span className="text-sm text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                asChild
                className="bg-tbf-gold hover:bg-tbf-gold-bright text-black font-bold text-base px-8 py-6"
              >
                <Link href={program.ctaLink}>
                  {program.ctaText}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-gray-300 hover:border-tbf-gold text-black font-bold text-base px-8 py-6"
              >
                <Link href={program.learnMoreLink || '/contact-us'}>
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-russo-one">
            Browse Our <span className="text-tbf-gold">Spring Programs</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Filter by age group to find the perfect training program for your athlete
          </p>
        </motion.div>

        {/* Tabs Filter */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto mb-12">
          <TabsList className="inline-flex flex-wrap items-center justify-center gap-3 bg-transparent p-0">
            <TabsTrigger 
              value="all" 
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-audiowide text-sm font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-tbf-gold hover:shadow-md data-[state=active]:border-tbf-gold data-[state=active]:bg-tbf-gold data-[state=active]:text-black data-[state=active]:shadow-lg"
            >
              ALL
            </TabsTrigger>
            <TabsTrigger 
              value="high-school" 
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-audiowide text-sm font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-tbf-gold hover:shadow-md data-[state=active]:border-tbf-gold data-[state=active]:bg-tbf-gold data-[state=active]:text-black data-[state=active]:shadow-lg"
            >
              HIGH SCHOOL
            </TabsTrigger>
            <TabsTrigger 
              value="middle-school" 
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-audiowide text-sm font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-tbf-gold hover:shadow-md data-[state=active]:border-tbf-gold data-[state=active]:bg-tbf-gold data-[state=active]:text-black data-[state=active]:shadow-lg"
            >
              MIDDLE SCHOOL
            </TabsTrigger>
            <TabsTrigger 
              value="private" 
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-audiowide text-sm font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-tbf-gold hover:shadow-md data-[state=active]:border-tbf-gold data-[state=active]:bg-tbf-gold data-[state=active]:text-black data-[state=active]:shadow-lg"
            >
              LESSONS
            </TabsTrigger>
            <TabsTrigger 
              value="youth" 
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-audiowide text-sm font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-tbf-gold hover:shadow-md data-[state=active]:border-tbf-gold data-[state=active]:bg-tbf-gold data-[state=active]:text-black data-[state=active]:shadow-lg"
            >
              OPEN GYM
            </TabsTrigger>
            <TabsTrigger 
              value="free-programs" 
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-audiowide text-sm font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-tbf-gold hover:shadow-md data-[state=active]:border-tbf-gold data-[state=active]:bg-tbf-gold data-[state=active]:text-black data-[state=active]:shadow-lg"
            >
              FREE
            </TabsTrigger>
          </TabsList>

          {['all', 'high-school', 'middle-school', 'private', 'youth', 'free-programs'].map((tabValue) => {
            const filteredPrograms = getFilteredPrograms(tabValue);
            return (
              <TabsContent key={tabValue} value={tabValue} className="mt-12">
                <div className="space-y-8">
                  {filteredPrograms.map((program, index) => renderProgramCard(program, index))}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
