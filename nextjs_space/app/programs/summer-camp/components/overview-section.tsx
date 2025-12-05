
import { CheckCircle2, Calendar } from 'lucide-react';

export default function OverviewSection() {
  const included = [
    'Professional coaching and instruction',
    'Skill development drills and stations',
    'Full-court games and scrimmages',
    'Individual and team competitions',
    'Basketball fundamentals training',
    'Character development and sportsmanship',
    'Age-appropriate curriculum',
    'Safe and supportive environment',
  ];

  const trainingDates = [
    { date: '8 Week Options Available 2025', year: '2025' },
    { date: 'Mon-Fri 9:00 AM-3:00 PM', year: '2025' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-tbf-gold p-3 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-3xl font-bold text-black font-russo-one">What's Included</h2>
            </div>
            <div className="grid gap-3">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
                  <CheckCircle2 className="w-5 h-5 text-tbf-gold flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-tbf-gold/5 to-white border-2 border-tbf-gold/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-tbf-gold p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <h2 className="text-3xl font-bold text-black font-russo-one">Training Dates</h2>
            </div>
            <div className="space-y-4">
              {trainingDates.map((month) => (
                <div key={month.date} className="bg-white p-5 rounded-xl border-2 border-gray-100 hover:border-tbf-gold transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-black font-audiowide">{month.year}</span>
                    <span className="bg-tbf-gold text-black px-3 py-1 rounded-full text-xs font-bold">CONFIRMED</span>
                  </div>
                  <p className="text-gray-700 font-medium">{month.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
