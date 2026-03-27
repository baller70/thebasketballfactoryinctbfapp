import { CheckCircle2, Target, Crosshair, Hand, Footprints, Trophy, Users } from 'lucide-react';

export default function OverviewSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Intro */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            Learn It. Practice It. <span className="text-tbf-gold">Play It.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            This isn&apos;t just drills and lectures — it&apos;s the perfect mix of learning fundamentals and applying them in real games. Kids learn the right way to shoot, dribble, pass, and finish, then immediately put those skills to the test in 1-on-1, 2-on-2, 3-on-3, 4-on-4, and 5-on-5 games.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Skills They'll Learn */}
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-tbf-gold p-3 rounded-lg">
                <Target className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black font-russo-one">Skills They&apos;ll Learn</h3>
            </div>
            <div className="grid gap-3">
              {[
                { icon: Crosshair, title: 'Shooting', desc: 'Proper shooting form, release point, follow-through, and range development' },
                { icon: Hand, title: 'Ball Handling', desc: 'Dribbling with both hands, crossovers, between the legs, and ball control under pressure' },
                { icon: Users, title: 'Passing', desc: 'Chest passes, bounce passes, outlet passes, and reading the floor' },
                { icon: Footprints, title: 'Footwork', desc: 'Pivoting, jab steps, triple threat position, and defensive slides' },
                { icon: Trophy, title: 'Finishing', desc: 'Layups with both hands, floaters, reverse finishes, and finishing through contact' },
              ].map((skill) => (
                <div key={skill.title} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                  <div className="bg-tbf-gold/10 p-2 rounded-lg flex-shrink-0">
                    <skill.icon className="w-5 h-5 text-tbf-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-black">{skill.title}</p>
                    <p className="text-gray-600 text-sm">{skill.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gradient-to-br from-tbf-gold/5 to-white border-2 border-tbf-gold/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-tbf-gold p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-black font-russo-one">How Each Session Works</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <span className="bg-tbf-gold text-black font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <div>
                  <p className="font-bold text-black">Warm-Up &amp; Skill Focus</p>
                  <p className="text-gray-600 text-sm">Each session starts with a focused skill topic — shooting form, ball handling technique, passing fundamentals, or footwork drills</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <span className="bg-tbf-gold text-black font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <div>
                  <p className="font-bold text-black">Drill Stations &amp; Reps</p>
                  <p className="text-gray-600 text-sm">With 16 baskets, every kid gets maximum reps. No standing around waiting — everyone is working at the same time</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                <span className="bg-tbf-gold text-black font-bold text-sm w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <div>
                  <p className="font-bold text-black">Live Games &amp; Competition</p>
                  <p className="text-gray-600 text-sm">Put skills to the test in 1-on-1, 2-on-2, 3-on-3, 4-on-4, and full 5-on-5 games. This is where learning becomes playing</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-tbf-gold/10 rounded-lg p-4 text-center">
              <p className="text-black font-bold">The Perfect Balance</p>
              <p className="text-gray-600 text-sm">Half skill development, half live games — kids learn the fundamentals and immediately apply them in real competition</p>
            </div>
          </div>
        </div>

        {/* 16 Baskets Highlight */}
        <div className="bg-black rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-russo-one">
            <span className="text-tbf-gold">16 BASKETS</span> = MAXIMUM REPS
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Most gyms have 2-4 baskets. We have 16. That means every kid is shooting, dribbling, and working on their game at the same time — not standing in line waiting for a turn. More reps means faster improvement.
          </p>
        </div>
      </div>
    </section>
  );
}
