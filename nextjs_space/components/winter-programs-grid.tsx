
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
    title: 'High School Winter Workouts',
    image: '/winter-high-school-basketball-workouts-sparta-nj.png',
    ageGroup: 'Ages 14-18',
    duration: '7 Weeks',
    schedule: ['Sunday 11:30 AM - 1:00 PM', 'Monday 8:00 PM - 9:00 PM'],
    location: 'Sparta, NJ',
    description: 'Stay game-ready with our High School Winter Workouts at The Basketball Factory in Sparta, New Jersey. Designed to complement your high school season with focused skill work and conditioning.',
    highlights: [
      'Season-long support',
      'Skill maintenance',
      'Game-speed training',
      'Strength & conditioning'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/hs-winter-workouts',
    learnMoreLink: '/programs/hs-winter-workouts',
  },
  {
    id: 2,
    category: 'middle-school',
    title: 'Middle School Winter Workouts',
    image: '/winter-middle-school-basketball-training-sparta-nj.png',
    ageGroup: 'Ages 11-14',
    duration: '7 Weeks',
    schedule: ['Sunday 10:00 AM - 11:30 AM', 'Monday 6:30 PM - 8:00 PM'],
    location: 'Sparta, NJ',
    description: 'Develop your game during the winter season with our Middle School Winter Workouts at The Basketball Factory in Sparta, New Jersey. Perfect for young athletes playing travel or school basketball.',
    highlights: [
      'Complement school season',
      'Skill development',
      'Game-situation drills',
      'Competitive preparation'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/ms-winter-workouts',
    learnMoreLink: '/programs/ms-winter-workouts',
  },
  {
    id: 3,
    category: 'private',
    title: 'Kevin Houston Individual Lessons',
    image: '/winter-high-school-basketball-workouts-sparta-nj.png',
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
    id: 4,
    category: 'youth',
    title: 'Youth Winter Open Gym',
    image: '/winter-middle-school-basketball-training-sparta-nj.png',
    ageGroup: 'Ages 7-12',
    duration: 'Ongoing',
    schedule: 'Saturdays, 4:00-7:00 PM',
    location: 'Sparta, NJ',
    description: 'Join our Winter Open Gym sessions at The Basketball Factory in Sparta, New Jersey. Stay active during the winter months with supervised play, skill practice, and competitive games.',
    highlights: [
      'Supervised play sessions',
      'Skill practice time',
      'Pickup games',
      'Drop-in flexibility'
    ],
    ctaText: 'Register Now',
    ctaLink: '/programs/youth-winter-open-gym',
    learnMoreLink: '/programs/youth-winter-open-gym',
  },
  {
    id: 5,
    category: 'equipment',
    title: 'TBF Skillz Training Equipment',
    image: '/basketball-training-equipment-aids-sparta-nj.png',
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
    id: 6,
    category: 'subscription',
    title: 'TBF Yearly Training Subscription',
    image: '/basketball-programs-coming-soon-sparta-nj.png',
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
    id: 7,
    category: 'free-programs',
    title: 'Little Ballers Introduction Clinic',
    image: '/little-ballers-free-basketball-clinic-sparta-nj.png',
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
    image: '/future-stars-free-basketball-skills-development.png',
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
    id: 9,
    category: 'free-programs',
    title: 'Youth Basketball Basics Workshop',
    image: '/youth-basketball-basics-free-workshop-sparta-nj.png',
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

export default function WinterProgramsGrid() {
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
                <span className="font-semibold">
                  {Array.isArray(program.schedule) ? (
                    program.schedule.map((line, index) => (
                      <div key={index}>{line}</div>
                    ))
                  ) : (
                    <span>{program.schedule}</span>
                  )}
                </span>
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
            Browse Our <span className="text-tbf-gold">Winter Programs</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Filter by age group to find the perfect winter training program for your athlete
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
              value="open-gym" 
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

          {['all', 'high-school', 'middle-school', 'private', 'open-gym', 'free-programs'].map((tabValue) => {
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
