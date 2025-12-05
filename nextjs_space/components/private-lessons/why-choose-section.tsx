
'use client'

export default function WhyChooseSection() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-tbf-gold text-sm font-bold tracking-wider uppercase mb-4 block">
            Why Parents Choose Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 font-audiowide uppercase">
            WHY CHOOSE <span className="text-tbf-gold">MR. BASIC?</span>
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto leading-relaxed">
            Kevin Houston, known as "Mr. Basic," believes in mastering fundamentals first. His proven training method has helped hundreds of young athletes in Sparta and Sussex County transform their game through dedicated skill development and mental preparation.
          </p>
        </div>

        {/* Training Philosophy */}
        <div className="bg-gradient-to-r from-tbf-gold/10 to-transparent border-l-4 border-tbf-gold p-8 rounded-lg max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4 font-audiowide uppercase">The "Mr. Basic" Philosophy</h3>
          <p className="text-white/80 text-lg leading-relaxed mb-4">
            "I believe every young athlete can excel when they master the basics. Through my private lessons here in Sparta, I focus on building a strong foundation in ball handling, shooting mechanics, footwork, and game awareness. This isn't just about basketball skills - it's about developing confidence, discipline, and a winning mindset that serves kids on and off the court."
          </p>
          <p className="text-tbf-gold font-semibold text-lg">
            - Kevin Houston, Head Trainer & Director, The Basketball Factory
          </p>
        </div>
      </div>
    </section>
  )
}