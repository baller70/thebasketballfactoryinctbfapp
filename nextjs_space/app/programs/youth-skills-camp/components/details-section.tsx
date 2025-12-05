
import { Target, Trophy, Users, Heart } from 'lucide-react';

export default function DetailsSection() {
  const details = [
    {
      icon: Target,
      title: 'Fundamentals Focus',
      description: 'Master the essential skills every young player needs including proper shooting form, ball handling, and footwork.',
    },
    {
      icon: Trophy,
      title: 'Skill Progression',
      description: 'Structured curriculum designed to build skills progressively, ensuring each athlete improves at their own pace.',
    },
    {
      icon: Users,
      title: 'Small Group Training',
      description: 'Low coach-to-player ratio ensures every athlete receives personalized attention and feedback.',
    },
    {
      icon: Heart,
      title: 'Confidence Building',
      description: 'Positive, encouraging environment that helps young athletes develop confidence and love for the game.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 font-russo-one">
            Program <span className="text-tbf-gold">Details</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our youth skills camp is designed specifically for developing fundamental basketball skills in young athletes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {details.map((detail) => (
            <div key={detail.title} className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-tbf-gold transition-all hover:shadow-xl">
              <div className="bg-tbf-gold/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <detail.icon className="w-8 h-8 text-tbf-gold" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4 font-audiowide">{detail.title}</h3>
              <p className="text-gray-600 leading-relaxed">{detail.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
