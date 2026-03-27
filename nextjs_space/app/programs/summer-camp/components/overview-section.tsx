import { CheckCircle2, Star, Utensils, Users, Trophy, Gamepad2, Shirt, Medal } from 'lucide-react';

export default function OverviewSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            More Than Just a <span className="text-tbf-gold">Basketball Camp</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At The Basketball Factory summer camp, kids don&apos;t just play basketball — they make lifelong friends, compete in team challenges, enjoy theme days, and create memories that last all year. It&apos;s the highlight of their summer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* A Typical Day at Camp */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-tbf-gold p-3 rounded-lg">
                <Star className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black font-russo-one">A Day at Camp</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <span className="text-tbf-gold font-bold text-sm w-20 flex-shrink-0">Morning</span>
                <span className="text-gray-700">Q&amp;A trivia to kick things off (Who are the seven dwarves? Which NBA team has the most championships?) — then basketball skill stations across all 16 baskets</span>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <span className="text-tbf-gold font-bold text-sm w-20 flex-shrink-0">Midday</span>
                <span className="text-gray-700">Team competitions — 3-on-3 tournaments, 2-on-2 battles, March Madness 1-on-1, and full-court games</span>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <span className="text-tbf-gold font-bold text-sm w-20 flex-shrink-0">Lunch</span>
                <span className="text-gray-700">Pizza &amp; subs available for purchase, or bring your own. Gatorade &amp; water for sale. Bring your own water bottle!</span>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <span className="text-tbf-gold font-bold text-sm w-20 flex-shrink-0">Afternoon</span>
                <span className="text-gray-700">Fun games — dodgeball, kickball, human tic-tac-toe, relay races — then back to team competition for points</span>
              </div>
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="bg-gradient-to-br from-tbf-gold/5 to-white border-2 border-tbf-gold/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-tbf-gold p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black font-russo-one">What Makes Us Different</h3>
            </div>
            <div className="grid gap-3">
              {[
                { icon: Trophy, text: 'NBA All-Star Friday — dunk contest, 3-point shootout, skills challenge, hot shot, free throw contest' },
                { icon: Shirt, text: 'Theme days every day — Jersey Day, Blackout Day, Hat Day, Color Wars & more' },
                { icon: Users, text: '4 teams with real NBA/WNBA team names competing all week for the championship belt' },
                { icon: Gamepad2, text: 'Not just basketball — dodgeball, kickball, human tic-tac-toe, relay races & more' },
                { icon: Medal, text: 'Points system all week — earn points for wins, trivia, sportsmanship & effort' },
                { icon: Star, text: '16 baskets in our facility — every kid gets maximum reps and playing time' },
                { icon: Users, text: 'High school players help coach — kids look up to them and it creates a great energy' },
                { icon: Utensils, text: 'Lunch available daily (pizza & subs) or bring your own — Gatorade & water for sale' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NBA All-Star Friday Highlight */}
        <div className="bg-black rounded-2xl p-8 md:p-12 text-center">
          <div className="inline-block bg-tbf-gold/20 border border-tbf-gold px-4 py-2 rounded-full mb-4">
            <span className="text-tbf-gold font-bold text-sm uppercase tracking-wider">The Grand Finale</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-russo-one">
            NBA ALL-STAR <span className="text-tbf-gold">FRIDAY</span>
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            Every Friday is All-Star Day — the highlight of the week. Kids compete in individual and team challenges for the ultimate prize: the TBF Championship Belt.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {['Dunk Contest', '3-Point Shootout', 'Skills Challenge', 'Hot Shot', 'Free Throw Contest'].map((event) => (
              <div key={event} className="bg-tbf-gold/10 border border-tbf-gold/30 rounded-lg p-3">
                <p className="text-tbf-gold font-bold text-sm">{event}</p>
              </div>
            ))}
          </div>
          <p className="text-tbf-gold font-bold mt-6 text-lg">
            The winning team takes home the Championship Belt!
          </p>
        </div>
      </div>
    </section>
  );
}
