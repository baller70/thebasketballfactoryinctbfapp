
import { Metadata } from 'next';
import Header from '@/components/header';
import NewsletterContent from '@/components/newsletter/newsletter-content';

export const metadata: Metadata = {
  title: 'Volume 1 - Welcome to The Basketball Factory Newsletter',
  description: 'Inaugural newsletter from The Basketball Factory featuring player spotlights, training tips, and winter program updates.',
};

interface NewsletterSection {
  type: 'intro' | 'heading' | 'text' | 'list' | 'signature';
  content?: string;
  items?: string[];
  name?: string;
  title?: string;
  subtitle?: string;
}

interface NewsletterData {
  volume: number;
  title: string;
  date: string;
  author: string;
  authorTitle: string;
  sections: NewsletterSection[];
}

export default function Volume1Page() {
  const newsletterData: NewsletterData = {
    volume: 1,
    title: 'Welcome to The Basketball Factory Newsletter',
    date: 'November 21, 2025',
    author: 'Kevin Houston',
    authorTitle: 'Director & Head Trainer',
    sections: [
      {
        type: 'intro' as const,
        content: `Welcome to the inaugural edition of The Basketball Factory Newsletter! We're excited to launch this monthly publication to keep you informed about our programs, share training insights, celebrate player achievements, and provide valuable basketball development tips.`
      },
      {
        type: 'heading' as const,
        content: 'A MESSAGE FROM THE DIRECTOR'
      },
      {
        type: 'text' as const,
        content: `As we enter the winter season, I'm incredibly proud of the progress our athletes have made. Our facility continues to be a place where dedication meets opportunity, and where young athletes transform their basketball dreams into reality.

This newsletter will serve as your monthly update on everything happening at The Basketball Factory. From player spotlights to training techniques, program announcements to success stories, we're committed to keeping you connected to our basketball community.`
      },
      {
        type: 'heading' as const,
        content: 'WINTER PROGRAMS NOW OPEN'
      },
      {
        type: 'text' as const,
        content: `Our Winter 2025-2026 programs are officially underway! We're running comprehensive training sessions for both High School and Middle School athletes, featuring:`
      },
      {
        type: 'list' as const,
        items: [
          'High School Winter Workouts: 15 intensive training sessions (8 Sundays + 7 Mondays)',
          'Middle School Winter Workouts: Complete skill development curriculum for grades 3-8',
          'Sunday Sessions: 10:00 AM - 11:30 AM',
          'Monday Sessions: 6:30 PM - 8:00 PM',
          'Expert coaching focused on fundamentals, game situations, and competitive play'
        ]
      },
      {
        type: 'text' as const,
        content: `Registration is open for both full program packages and pay-as-you-go options. Visit our programs page or contact us at (973) 240-8759 for more information.`
      },
      {
        type: 'heading' as const,
        content: 'PLAYER SPOTLIGHT: SUCCESS STORIES'
      },
      {
        type: 'text' as const,
        content: `This month, we're celebrating the achievements of our alumni who have successfully transitioned to college basketball. Our "Who We Trained" page now features over 25 players who have earned college scholarships and continue to excel at the next level.

Notable achievements include athletes competing at Division I, Division II, Division III, and JUCO programs across the country. Their success is a testament to the quality training and dedication fostered at The Basketball Factory.`
      },
      {
        type: 'heading' as const,
        content: 'TRAINING TIP OF THE MONTH'
      },
      {
        type: 'text' as const,
        content: `**Master the Fundamentals First**

Many young athletes want to learn flashy moves before mastering the basics. However, the foundation of great basketball is built on fundamental skills:

- **Ball Handling**: Practice with both hands daily, focusing on control over speed
- **Footwork**: Proper stance and movement are the keys to offensive and defensive success  
- **Shooting Form**: Repetition with correct technique builds muscle memory
- **Basketball IQ**: Understanding the game mentally accelerates physical development

Remember, even the most elite players continuously work on fundamentals. That's why I'm known as "Mr. Basic" – because mastering the basics is what separates good players from great ones.`
      },
      {
        type: 'heading' as const,
        content: 'UPCOMING EVENTS & ANNOUNCEMENTS'
      },
      {
        type: 'list' as const,
        items: [
          'Private lesson availability for December and January – limited spots remaining',
          'Free youth programs continuing: Little Ballers, Future Stars, and Youth Basketball Basics',
          'Spring 2026 program registration opening in January',
          'New training equipment arriving for enhanced skill development',
          'Holiday training schedule will be announced via email and social media'
        ]
      },
      {
        type: 'heading' as const,
        content: 'STAY CONNECTED'
      },
      {
        type: 'text' as const,
        content: `Follow us on social media for daily training tips, player highlights, and program updates. Visit our website at thebasketballfactoryinc.com to explore our full range of programs, read our blog, and learn more about our training philosophy.

Have questions or want to discuss your child's basketball development? We're always here to help. Contact us at khouston@thebasketballfactorynj.com or call (973) 240-8759.

Thank you for being part of The Basketball Factory family. Let's make this season one of growth, achievement, and basketball excellence!`
      },
      {
        type: 'signature' as const,
        name: 'Kevin Houston',
        title: 'Director & Head Trainer',
        subtitle: '"Mr. Basic" | Hall of Fame Coach'
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white">
      <Header alwaysDark />
      <NewsletterContent data={newsletterData} />
    </main>
  );
}
