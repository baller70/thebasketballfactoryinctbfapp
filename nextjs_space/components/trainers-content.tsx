'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function TrainersContent() {
  const [expandedTrainer, setExpandedTrainer] = useState<number | null>(null)

  const trainers = [
    {
      name: 'KEVIN HOUSTON',
      title: 'Director',
      image: '/kevin-houston-head-basketball-trainer.jpg',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Hard work, discipline, and proper training build champions on and off the court.',
      bio: 'With over 20 years of experience as a player, trainer, and trainer, Kevin Houston brings proven basketball development methods to Sparta, NJ. His European training approach emphasizes skill development, work ethic, and discipline—transforming young athletes into confident, fundamentally-sound players. As the founder and director of The Basketball Factory, Kevin has built a youth basketball program where proper training meets character building. Parents trust Kevin because he focuses on developing not just basketball skills, but the discipline, work ethic, and character traits that help young athletes succeed in all areas of life.',
      philosophy: 'Every player has potential. Through discipline, hard work, and proper training methodology, we develop skilled athletes who compete with confidence and integrity.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'I admire players who combine skill with leadership—those who make everyone around them better through their work ethic and example. That\'s what we teach at The Basketball Factory.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'My experiences playing professionally in Europe showed me a different approach to developing players. I wanted to bring that professional methodology to youth basketball and help young athletes build strong fundamentals and work ethic.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'I enjoy studying international basketball tactics and training methodologies. Staying current with global basketball development keeps our program at the cutting edge and gives our players a competitive advantage.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Watching players develop from learning fundamentals to mastering advanced skills. Seeing them succeed both on and off the court—academically, socially, and athletically—makes all the hard work worthwhile for their families and our training staff.'
        }
      ]
    },
    {
      name: 'KENNA SQUIER',
      title: 'Director | Trainer',
      image: '/kenna-squier-youth-basketball-coach.jpg',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Development is a journey built on hard work, discipline, and dedication.',
      bio: 'Kenna Squier brings exceptional leadership and training expertise to The Basketball Factory. As a former standout player at NJIT and current director at The Basketball Factory, Kenna combines her collegiate playing experience with proven training methods to develop well-rounded athletes. Her expertise spans all age groups, from beginners learning fundamentals to advanced players refining their skills. Parents appreciate Kenna\'s holistic approach—she doesn\'t just build basketball skills, she nurtures confidence, work ethic, and character. Her dedication to skill development and character building makes her an invaluable mentor for young athletes throughout Sparta and the surrounding New Jersey communities.',
      philosophy: 'Character and skill development go hand in hand. We build complete athletes through hard work, discipline, and proper training—preparing them for success in basketball and life.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'Maya Moore. Her combination of talent, leadership, and using her platform for social good represents everything I try to instill in our players—excellence with purpose.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'My experiences at NJIT taught me the importance of having mentors who believe in you. I wanted to be that person for the next generation of athletes, helping them develop their skills, character, and work ethic through basketball.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'I love reading and staying active in youth mentorship programs. Giving back to the community and helping young people develop into future leaders is incredibly important to me.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Watching shy, uncertain athletes transform into confident leaders on and off the court. That transformation is absolutely magical and makes a lasting impact on their families and communities.'
        }
      ]
    },
    {
      name: 'PEACE BAKINAHE',
      title: 'Trainer',
      image: '/peace-bakinahe-youth-basketball-coach.png',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Technical skill and sportsmanship create champions who win with integrity.',
      bio: 'Trainer Peace Bakinahe is a cornerstone of the The Basketball Factory training staff, bringing a unique combination of technical expertise and exceptional sportsmanship to every training session. Peace specializes in developing athletes at all skill levels into disciplined, fundamentally-sound players who respect the game and their opponents. His methodical approach to skill development ensures that players build a rock-solid foundation through hard work and proper training. Parents throughout Sparta and Sussex County trust Peace because he creates a positive, encouraging environment where young athletes thrive. His ability to connect with players and instill strong work ethic makes him a cherished mentor whose impact extends far beyond the basketball court.',
      philosophy: 'Excellence comes from mastering fundamentals through discipline and hard work. We build players who respect the game, their teammates, and themselves—creating athletes with strong character and skills.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'Tim Duncan. His consistency, fundamental excellence, and quiet leadership represent the kind of player and person I try to develop—someone who leads by example and wins with class.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'I saw how sports could transform lives and teach valuable life lessons about discipline, teamwork, and perseverance. I wanted to be part of that transformative process for young athletes in our community.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'I enjoy mentoring in the community and playing chess. The strategic thinking in chess translates directly to basketball training and helps me teach players to think several moves ahead.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Seeing players develop discipline and sportsmanship alongside their basketball skills. Building complete athletes who succeed in all areas of life—that\'s our mission at The Basketball Factory.'
        }
      ]
    },
    {
      name: 'LEE VAN HORN',
      title: 'Trainer',
      image: '/lee-van-horn-youth-basketball-coach.png',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Strategic preparation and methodical development create unstoppable athletes.',
      bio: 'Lee Van Horn brings years of training experience and a strategic training mindset to The Basketball Factory. Known throughout New Jersey for his methodical approach to skill development and game preparation, Lee has helped countless athletes elevate their game through hard work and discipline. His systematic training methods break down complex basketball concepts into manageable steps, ensuring every player—from beginner to advanced—experiences measurable improvement. Parents choose Lee because he combines technical expertise with exceptional communication, helping young athletes understand not just what to do, but why it works. His commitment to proper training and proven track record of player development have made him a trusted name in Northern New Jersey youth basketball.',
      philosophy: 'Success is in the details. Strategic preparation, hard work, and methodical skill development build confident players—we teach athletes to master every aspect of their game through discipline and dedication.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'Steve Nash. His court vision, basketball IQ, and ability to make everyone better exemplify what I try to teach—being a complete player who elevates the entire team.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'I love the strategic aspect of basketball—it\'s like chess on the court. I wanted to share that strategic understanding with young players and help them develop high basketball IQs.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'Analyzing game film and studying offensive and defensive systems. I\'m a lifelong student of the game who never stops learning, and that knowledge directly benefits our players.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'That moment when a player perfectly executes a play in a game situation—seeing the light bulb turn on and watching them apply what we\'ve practiced. That\'s incredibly rewarding for players, parents, and trainers alike.'
        }
      ]
    },
    {
      name: 'KYLE KIELTY',
      title: 'Trainer',
      image: '/kyle-kielty-youth-basketball-coach.png',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Motivation and expertise unlock potential. Every athlete has greatness within.',
      bio: 'Kyle Kielty is a dedicated trainer at The Basketball Factory, renowned for his motivational approach and deep expertise in basketball fundamentals and advanced techniques. His high-energy training style keeps players engaged and excited about improvement, while his systematic methods ensure consistent skill development. Kyle specializes in helping young athletes build the confidence and work ethic needed to succeed. Parents throughout Sparta and the surrounding areas seek out Kyle because he creates an encouraging, positive environment where players feel empowered to work hard and grow. His proven ability to develop both basketball skills and mental toughness makes him an invaluable asset to the The Basketball Factory training staff and the families we serve.',
      philosophy: 'Motivation meets hard work. We combine inspiration with proven training techniques to develop players who compete with confidence, discipline, and dedication.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'Kobe Bryant. His legendary work ethic and mental toughness represent the mindset I try to instill in every player—relentless pursuit of excellence and never settling for good enough.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'I had trainers who believed in me when I didn\'t believe in myself. I wanted to be that source of belief and motivation for others, helping young athletes discover their true potential.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'Fitness training and sports psychology. Understanding the mental game is just as important as physical development, and I use both to help players achieve breakthrough results.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Watching players break through mental barriers and achieve things they didn\'t think possible. Those breakthrough moments—that\'s where real growth happens and where families see the incredible value of our program.'
        }
      ]
    },
    {
      name: 'TAYLOR LANGAN',
      title: 'Trainer',
      image: '/taylor-langan-youth-basketball-coach.jpeg',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Resilience and excellence—building athletes who thrive under pressure.',
      bio: 'Taylor Langan brings exceptional energy and expertise to the The Basketball Factory training staff. As a former collegiate athlete, Taylor offers invaluable firsthand knowledge of what hard work and dedication can achieve. Her training sessions focus on developing both physical skills and mental resilience through discipline and proper training, ensuring players are prepared for the challenges of competitive basketball. Taylor\'s unique ability to connect with athletes and create a supportive yet demanding training environment has made her a favorite among players and parents throughout Northern New Jersey. Her focus on building confidence, work ethic, and mental toughness helps young athletes overcome obstacles and develop the character needed for success in basketball and life.',
      philosophy: 'Mental and physical resilience come from hard work and discipline. We prepare players for every challenge through proper training—on the court and in life.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'Diana Taurasi. Her competitive fire, leadership, and longevity in the game represent the kind of athlete I strive to develop—someone who competes at the highest level year after year.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'My collegiate experience taught me the value of great training and mentorship. I wanted to provide that same guidance and support to young athletes pursuing their basketball dreams.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'Trail running and outdoor fitness activities. Staying active and challenging myself keeps me sharp as a trainer and helps me model the dedication I expect from our players.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Building confidence in athletes who might doubt themselves initially. Watching them overcome challenges and realize their potential is incredibly fulfilling and makes a lasting impact on their families.'
        }
      ]
    },
    {
      name: 'BEN MELVILLE',
      title: 'Trainer',
      image: '/ben-melville-youth-basketball-coach.jpg',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Enthusiasm and expertise—a combination that develops champions.',
      bio: 'Ben Melville delivers high-quality training sessions at The Basketball Factory, combining infectious enthusiasm with deep basketball expertise. His playing experience and passion for the game shape his training philosophy, which emphasizes both skill development and basketball intelligence. Ben has a special talent for making training fun and engaging while maintaining high standards and building strong work ethic. Parents throughout Sparta appreciate Ben\'s ability to connect with young athletes and inspire them to love the game while working hard to improve. His positive energy and proven training methods create an environment where players thrive, develop confidence, discipline, and strong fundamental skills.',
      philosophy: 'Passion for the game combined with hard work builds successful players. We develop skilled athletes who genuinely love basketball and compete with dedication—creating players with strong fundamentals and character.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'Steph Curry. His work ethic, shooting excellence, and pure joy for the game represent everything I love about basketball and want to share with young players.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'Playing basketball taught me valuable life lessons about teamwork, perseverance, and dedication. I wanted to share those lessons and my love for the game with the next generation of athletes.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'Honestly, training basketball IS my hobby and passion! But I also enjoy pickup games with friends and staying connected to the basketball community in every way possible.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Seeing players fall in love with basketball. When they develop that genuine passion for the game, everything else follows—improvement, confidence, teamwork, and success.'
        }
      ]
    },
    {
      name: 'JOE MORICI',
      title: 'Trainer',
      image: '/joe-morici-youth-basketball-coach.png',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Experience and insight create disciplined, confident athletes.',
      bio: 'Joe Morici is a seasoned trainer at The Basketball Factory, bringing comprehensive basketball knowledge and a hands-on training style that produces results. With extensive playing experience and years of training success, Joe knows what it takes to develop athletes through hard work and proper training. His training sessions emphasize skill refinement, tactical understanding, and mental preparation—the three pillars of sound basketball development. Parents choose Joe because he provides clear, actionable feedback that helps players improve rapidly while building the confidence and work ethic needed to succeed. His influence extends beyond basketball fundamentals; Joe shapes young athletes into disciplined, confident individuals ready to excel in all areas of life.',
      philosophy: 'Professional experience informs proper youth development. We teach players to think strategically and work hard—developing basketball IQ, strong fundamentals, and character.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'LeBron James. His longevity, basketball IQ, and ability to adapt his game over decades represent what a complete, professional basketball player looks like—that\'s what we aim to develop.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'My playing experience showed me the importance of proper development and great training. I wanted to give young players that professional-level foundation and help them avoid common mistakes.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'Studying game film and analyzing professional basketball at all levels. The game continues to evolve, and I stay current with modern trends to keep our players competitive.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Sharing professional insights and watching players develop that "pro mentality"—the work ethic, discipline, and basketball IQ that will serve them throughout their basketball careers and beyond.'
        }
      ]
    },
    {
      name: 'SAMBA DIALLO',
      title: 'Trainer',
      image: '/samba-diallo-youth-basketball-coach.jpeg',
      certificationImage: '/basketball-trainer-certifications-sparta-nj.png',
      quote: 'Energy, expertise, and dedication—developing athletes who excel in sports and life.',
      bio: 'Samba Diallo brings a unique blend of high energy and basketball expertise to The Basketball Factory. Known for his dynamic training methods and exceptional ability to engage young athletes, Samba focuses on developing complete players with strong basketball skills and outstanding work ethic through discipline and dedication. His personalized training approach ensures that each athlete receives the individual attention and guidance needed to improve their game. Parents throughout Northern New Jersey appreciate Samba\'s dedication to both skill development and character building—he doesn\'t just teach basketball, he helps develop better people through hard work and proper training. Samba\'s impact on the basketball community is profound, as he consistently produces athletes who excel in sports, academics, and leadership.',
      philosophy: 'Dynamic training, hard work, and personal attention build strong athletes. We develop players with solid fundamentals and character—athletes who succeed through dedication and discipline.',
      qna: [
        {
          question: 'Who is your favorite basketball player and why?',
          answer: 'Giannis Antetokounmpo. His inspiring journey from relative unknown to NBA superstar through hard work and dedication represents everything I teach—anyone can achieve greatness with the right mindset and work ethic.'
        },
        {
          question: 'What inspired you to become a trainer?',
          answer: 'I saw how sports could change lives and provide opportunities that might not otherwise exist. I wanted to be part of creating those life-changing opportunities for young athletes in our community.'
        },
        {
          question: 'What is your favorite hobby outside of basketball?',
          answer: 'Community service and mentoring young people. Giving back and helping the next generation reach their potential—both on and off the court—is my true passion and calling.'
        },
        {
          question: 'What do you enjoy most about training youth players?',
          answer: 'Watching players develop not just as athletes, but as complete people. When they succeed in life because of lessons learned through basketball, that\'s the ultimate victory for families and our entire community.'
        }
      ]
    }
  ]

  const toggleTrainer = (index: number) => {
    setExpandedTrainer(expandedTrainer === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Featured Image and Quote */}
      <div className="relative bg-black min-h-[500px] flex items-center mt-[120px] md:mt-[200px]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/kevin-houston-featured-basketball-trainer.png"
            alt="Kevin Houston - The Basketball Factory Director"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-audiowide uppercase mb-8 text-white leading-tight">
              MEET OUR <span className="text-tbf-gold">TRAINERING STAFF</span>
            </h1>
            
            {/* Featured Quote */}
            <div className="bg-tbf-gold p-6 md:p-10 rounded-lg shadow-2xl border-4 border-white mb-8">
              <svg className="w-12 h-12 text-white mb-4 mx-auto opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.5 10c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5c.494 0 .963-.103 1.39-.291-.48.943-1.467 1.591-2.59 1.591-.276 0-.5.224-.5.5s.224.5.5.5c2.481 0 4.5-2.019 4.5-4.5 0-1.933-1.567-3.5-3.5-3.5zm11 0c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5c.494 0 .963-.103 1.39-.291-.48.943-1.467 1.591-2.59 1.591-.276 0-.5.224-.5.5s.224.5.5.5c2.481 0 4.5-2.019 4.5-4.5 0-1.933-1.567-3.5-3.5-3.5z"/>
              </svg>
              <p className="text-white text-lg md:text-2xl font-semibold leading-relaxed italic">
                At The Basketball Factory, we stand by a promise to teach your kid the essentials of basketball with a firm commitment to professionalism, structure, training, and practice. We focus on personal growth, teamwork, and core values that will serve them well beyond the court, preparing them to tackle any of life&apos;s challenges with confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-audiowide mb-6 text-black">
              MEET OUR <span className="text-tbf-gold">TRAINERS</span>
            </h2>
            <p className="text-gray-700 text-base md:text-xl leading-relaxed mb-6">
              Our trainers at The Basketball Factory are integral to our AAU basketball development program in Northern New Jersey. With a team of seasoned and certified trainers who have experienced the game firsthand, we focus on skill development, discipline, and character building through our structured training curriculum.
            </p>
            <p className="text-gray-700 text-base md:text-xl leading-relaxed mb-6">
              Each trainer holds certifications from esteemed organizations like <strong>USA Basketball</strong>, <strong>American Development Model</strong>, and the <strong>National Federation of State High School Associations (NFHS)</strong>, demonstrating their expertise and commitment to proper training standards. These certifications ensure your child learns from qualified professionals who understand how to develop young athletes correctly and safely.
            </p>
            <p className="text-gray-700 text-base md:text-xl leading-relaxed">
              To maintain the integrity of our program, all trainers undergo background verification. We believe that trainers who have played the game at high levels bring invaluable experience and understanding, which is why our team includes former professional and collegiate players dedicated to developing the next generation of basketball talent through hard work, proper training, and character development across <strong>Bergen, Passaic, and Morris Counties</strong>.
            </p>
          </div>

          {/* Stats Highlight */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl md:text-5xl font-audiowide text-tbf-gold mb-2">100%</div>
              <p className="text-gray-700 font-semibold">Certified Trainers</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl md:text-5xl font-audiowide text-tbf-gold mb-2">20+</div>
              <p className="text-gray-700 font-semibold">Years of Experience</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="text-4xl md:text-5xl font-audiowide text-tbf-gold mb-2">9</div>
              <p className="text-gray-700 font-semibold">Dedicated Trainers</p>
            </div>
          </div>

          {/* Kevin Houston Highlight Section */}
          <div className="max-w-4xl mx-auto text-center bg-black text-white p-8 md:p-12 rounded-lg shadow-xl">
            <h3 className="text-2xl md:text-4xl font-audiowide mb-4">
              SERVING SUSSEX COUNTY WITH <span className="text-tbf-gold">THE BASKETBALL FACTORY IN AAU NJ</span>
            </h3>
            <p className="text-base md:text-xl leading-relaxed">
              Kevin Houston has more than 20 years of experience as a player, trainer, and trainer. He focuses on developing young athletes into skilled basketball players with strong fundamentals, work ethic, and character through proven European training methods that emphasize discipline and proper technique.
            </p>
          </div>
        </div>
      </div>

      {/* Individual Trainer Sections */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-audiowide text-center mb-12 text-black">
            OUR <span className="text-tbf-gold">TRAINERING TEAM</span>
          </h2>
          
          <div className="max-w-6xl mx-auto space-y-12">
            {trainers.map((trainer, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="grid md:grid-cols-5 gap-0">
                  {/* Trainer Image */}
                  <div className="md:col-span-2 relative h-96 md:h-auto">
                    <Image
                      src={trainer.image}
                      alt={`${trainer.name} - Youth Basketball Trainer in Sparta NJ`}
                      fill
                      className="object-cover object-top"
                    />
                  </div>

                  {/* Trainer Info */}
                  <div className="md:col-span-3 p-6 md:p-10">
                    {/* Name and Title */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl md:text-4xl font-audiowide mb-2 text-black">
                          {trainer.name}
                        </h3>
                        <p className="text-tbf-gold font-bold text-lg md:text-xl uppercase tracking-wide">
                          {trainer.title}
                        </p>
                      </div>
                      
                      {/* Certification Badge */}
                      <div className="flex-shrink-0 ml-4">
                        <Image
                          src={trainer.certificationImage}
                          alt="Certified Basketball Trainer"
                          width={200}
                          height={200}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Quote */}
                    <div className="bg-gray-100 p-4 md:p-6 rounded-lg mb-6 border-l-4 border-tbf-gold">
                      <p className="text-gray-800 italic text-base md:text-lg font-medium">
                        &quot;{trainer.quote}&quot;
                      </p>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-700 leading-relaxed mb-6 text-base md:text-lg">
                      {trainer.bio}
                    </p>

                    {/* Training Philosophy */}
                    <div className="mb-6">
                      <h4 className="font-audiowide text-sm uppercase tracking-wide mb-2 text-black">
                        Training Philosophy
                      </h4>
                      <p className="text-gray-700 italic leading-relaxed">
                        {trainer.philosophy}
                      </p>
                    </div>

                    {/* Q&A Toggle Button */}
                    <button
                      onClick={() => toggleTrainer(index)}
                      className="w-full md:w-auto bg-tbf-gold text-white px-8 py-3 font-bold hover:bg-tbf-gold transition-colors rounded shadow-lg flex items-center justify-center gap-2"
                    >
                      {expandedTrainer === index ? 'Hide' : 'Learn More About'} {trainer.name.split(' ')[0]}
                      <svg 
                        className={`w-5 h-5 transition-transform ${expandedTrainer === index ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Q&A Section (Expandable) */}
                {expandedTrainer === index && (
                  <div className="bg-gray-50 p-6 md:p-10 border-t-2 border-gray-200 animate-fadeIn">
                    <h4 className="text-2xl md:text-3xl font-audiowide mb-6 text-black text-center">
                      GET TO KNOW <span className="text-tbf-gold">{trainer.name.split(' ')[0].toUpperCase()}</span>
                    </h4>
                    
                    <div className="max-w-3xl mx-auto space-y-6">
                      {trainer.qna.map((qa, qaIndex) => (
                        <div key={qaIndex} className="bg-white p-6 rounded-lg shadow-md">
                          <h5 className="font-bold text-tbf-gold mb-3 text-base md:text-lg">
                            {qa.question}
                          </h5>
                          <p className="text-gray-700 leading-relaxed">
                            {qa.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-black py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-audiowide mb-8 text-white">
              OUR TRAINERING <span className="text-tbf-gold">PHILOSOPHY</span>
            </h2>
            <p className="text-white text-base md:text-xl mb-6 leading-relaxed">
              At The Basketball Factory, we believe in developing the <strong>complete athlete</strong>. Our Sparta, NJ basketball trainers focus on skill development, character building, discipline, and work ethic. We create a supportive yet demanding environment where players can grow, learn from mistakes, and develop both as basketball players and as individuals of strong character.
            </p>
            <p className="text-white text-base md:text-xl mb-6 leading-relaxed">
              Every trainer on our staff is committed to mentoring young athletes and helping them succeed through hard work and proper training. We emphasize <strong>teamwork, discipline, and a strong work ethic</strong> while teaching fundamental basketball skills and fostering a genuine love for the game. Our trainers have been where your child wants to go—they've experienced high-level basketball and understand what it takes to succeed.
            </p>
            <p className="text-white text-base md:text-xl leading-relaxed">
              Our youth basketball program in Sparta has helped countless athletes develop into confident, capable individuals who excel in all areas of life. We focus on building strong fundamentals, character, and the mental toughness needed to succeed—skills that translate far beyond the basketball court into academics, careers, and personal relationships.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-audiowide mb-6 text-black">
              READY TO JOIN THE <span className="text-tbf-gold">TBF FAMILY?</span>
            </h2>
            <p className="text-gray-700 text-base md:text-xl mb-8 leading-relaxed">
              Train with trainers who have walked your path and are dedicated to your success. Register today for tryouts and become part of a legacy of excellence in Sparta, NJ AAU basketball.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/#boys-spring">
                <button className="w-full sm:w-auto bg-tbf-gold text-white px-10 py-4 text-lg font-bold hover:bg-tbf-gold transition-colors shadow-xl rounded">
                  BOYS PROGRAM TRYOUTS
                </button>
              </Link>
              
              <Link href="/#girls-spring">
                <button className="w-full sm:w-auto bg-black text-white px-10 py-4 text-lg font-bold hover:bg-gray-800 transition-colors shadow-xl rounded">
                  GIRLS PROGRAM TRYOUTS
                </button>
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                <strong>Have questions about our training staff or programs?</strong>
              </p>
              <p className="text-gray-600 mb-6">
                Contact us at <a href="mailto:khouston@thebasketballfactorynj.com" className="text-tbf-gold hover:underline font-semibold">khouston@thebasketballfactorynj.com</a> or call <a href="tel:+19732408759" className="text-tbf-gold hover:underline font-semibold">(973) 240-8759</a>
              </p>
              <p className="text-sm text-gray-500">
                Located at <strong>38 Station Rd, Sparta, NJ 07871</strong> • Serving the Sussex County community
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
