
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
    title: 'High School Fall Workouts',
    image: '/fall-high-school-basketball-training-sparta-nj.png',
    ageGroup: 'Ages 14-18',
    duration: '7 Weeks',
    schedule: 'Sunday, 11:30 AM - 1:00 PM',
    location: 'Sparta, NJ',
    description: 'Join our High School Fall Workouts at The Basketball Factory in Sparta, New Jersey to improve your skills with expert coaching. Prepare for the season with basketball skill training in shooting, dribbling, and finishing!',
    highlights: [
      'Advanced skill development',
      'Position-specific training',
      'Game situation drills',
      'College prep guidance'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/high-school-fall-workouts',
    learnMoreLink: '/programs/high-school-fall-workouts',
  },
  {
    id: 2,
    category: 'middle-school',
    title: 'Middle School Skills Academy',
    image: '/fall-middle-school-basketball-training-sparta-nj.png',
    ageGroup: 'Ages 7-13',
    duration: '7 Weeks',
    schedule: 'Sunday, 10:00 AM - 11:30 AM',
    location: 'Sparta, NJ',
    description: 'Improve your game with our Middle School Skills Academy at The Basketball Factory in Sparta, New Jersey. Our tailored training sessions focus on developing fundamental "ball skills" for young athletes, ensuring they are prepared for the winter travel season!',
    highlights: [
      'Fundamental ball handling',
      'Shooting form development',
      'Team play concepts',
      'Travel team preparation'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/ms-fall-skills-academy',
    learnMoreLink: '/programs/ms-fall-skills-academy',
  },
  {
    id: 3,
    category: 'youth',
    title: 'Youth Fall Open Gym',
    image: '/fall-youth-basketball-open-gym-sparta-nj.png',
    ageGroup: 'Ages 7-18',
    duration: 'Ongoing',
    schedule: 'Monday, 4:30-8:30 PM',
    location: 'Sparta, NJ',
    description: 'Join our Open Gym sessions at The Basketball Factory in Sparta, New Jersey. Enjoy flexible practice time, hone your skills, and play with other local athletes in a competitive yet friendly environment!',
    highlights: [
      'Supervised play sessions',
      'Skill practice time',
      'Pickup games',
      'Drop-in flexibility'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/youth-fall-open-gym',
    learnMoreLink: '/programs/youth-fall-open-gym',
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
    id: 6,
    category: 'free-programs',
    title: 'Future Stars Skills Development',
    image: '/fall-future-stars-basketball-skills-program.png',
    ageGroup: 'Ages 7-10',
    duration: '4 Weeks',
    schedule: 'Sundays, 10:00-11:00 AM',
    location: 'Sparta, NJ',
    description: 'FREE youth basketball program teaching fundamental skills through fun games for kids ages 7-10 in Sparta, NJ.',
    highlights: [
      'Completely FREE',
      'Learn core skills',
      'Safe environment',
      'Small groups'
    ],
    ctaText: 'Reserve Spot FREE',
    ctaLink: '/programs/future-stars-skills',
    learnMoreLink: '/programs/future-stars-skills',
  },
  {
    id: 7,
    category: 'free-programs',
    title: 'Youth Basketball Basics Workshop',
    image: '/fall-youth-basketball-basics-workshop.png',
    ageGroup: 'Ages 7-10',
    duration: '4 Weeks',
    schedule: 'Saturdays, 11:00 AM-12:00 PM',
    location: 'Sparta, NJ',
    description: 'FREE community basketball workshop with professional coaches. Kids learn fundamentals and have fun in Sparta, NJ.',
    highlights: [
      '100% FREE',
      'Professional coaching',
      'Fun & fundamentals',
      'Builds confidence'
    ],
    ctaText: 'Enroll FREE Today',
    ctaLink: '/programs/youth-basketball-basics',
    learnMoreLink: '/programs/youth-basketball-basics',
  },
];

export default function FallProgramsGrid() {
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
      <div className="bg-white border-2 border-gray-200 hover:border-tbf-gold rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
        <div className="grid md:grid-cols-[350px,1fr] gap-0 h-full">
          {/* Image */}
          <div className="relative h-64 md:h-auto md:min-h-[400px] bg-gray-100 order-1 md:order-1">
            <Image
              src={program.image}
              alt={`${program.title} - Basketball Training Sparta NJ`}
              fill
              className="object-cover object-left"
              sizes="350px"
            />
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 flex flex-col justify-between order-2 md:order-2 min-h-[400px]">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
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

              <h3 className="text-2xl md:text-3xl font-bold text-black mb-3 font-russo-one leading-tight">
                {program.title}
              </h3>

              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Users className="w-5 h-5 text-tbf-gold" />
                <span className="font-semibold text-sm md:text-base">{program.schedule}</span>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-base line-clamp-3">
                {program.description}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {program.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-tbf-gold flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-gray-700 leading-tight">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
              <Button
                asChild
                className="bg-tbf-gold hover:bg-tbf-gold-bright text-black font-bold text-sm md:text-base px-6 py-5"
              >
                <Link href={program.ctaLink}>
                  {program.ctaText}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-gray-300 hover:border-tbf-gold text-black font-bold text-sm md:text-base px-6 py-5"
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
            Browse Our <span className="text-tbf-gold">Fall Programs</span>
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
              value="free-programs" 
              className="rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-audiowide text-sm font-bold text-gray-700 shadow-sm transition-all duration-200 hover:border-tbf-gold hover:shadow-md data-[state=active]:border-tbf-gold data-[state=active]:bg-tbf-gold data-[state=active]:text-black data-[state=active]:shadow-lg"
            >
              FREE
            </TabsTrigger>
          </TabsList>

          {['all', 'high-school', 'middle-school', 'private', 'free-programs'].map((tabValue) => {
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
