
'use client'

interface SectionDividerProps {
  variant?: 'top' | 'bottom' | 'both'
  style?: 'basketball' | 'wave' | 'diagonal' | 'geometric'
  className?: string
}

export default function SectionDivider({ 
  variant = 'top', 
  style = 'basketball',
  className = '' 
}: SectionDividerProps) {
  
  if (style === 'basketball') {
    return (
      <div className={`relative ${className}`}>
        {(variant === 'top' || variant === 'both') && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-tbf-gold to-transparent">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                {/* Basketball Icon */}
                <div className="w-12 h-12 bg-tbf-gold rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                {/* Decorative lines */}
                <div className="absolute top-1/2 -left-20 w-16 h-0.5 bg-gradient-to-l from-tbf-gold to-transparent"></div>
                <div className="absolute top-1/2 -right-20 w-16 h-0.5 bg-gradient-to-r from-tbf-gold to-transparent"></div>
              </div>
            </div>
          </div>
        )}
        {(variant === 'bottom' || variant === 'both') && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-tbf-gold to-transparent"></div>
        )}
      </div>
    )
  }

  if (style === 'wave') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {(variant === 'top' || variant === 'both') && (
          <div className="absolute top-0 left-0 right-0">
            <svg className="w-full h-8" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path 
                d="M0,50 Q300,0 600,50 T1200,50 L1200,0 L0,0 Z" 
                fill="currentColor" 
                className="text-tbf-gold opacity-20"
              />
              <path 
                d="M0,50 Q300,20 600,50 T1200,50 L1200,0 L0,0 Z" 
                fill="currentColor" 
                className="text-tbf-gold"
              />
            </svg>
          </div>
        )}
        {(variant === 'bottom' || variant === 'both') && (
          <div className="absolute bottom-0 left-0 right-0 rotate-180">
            <svg className="w-full h-8" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <path 
                d="M0,50 Q300,0 600,50 T1200,50 L1200,0 L0,0 Z" 
                fill="currentColor" 
                className="text-tbf-gold opacity-20"
              />
              <path 
                d="M0,50 Q300,20 600,50 T1200,50 L1200,0 L0,0 Z" 
                fill="currentColor" 
                className="text-tbf-gold"
              />
            </svg>
          </div>
        )}
      </div>
    )
  }

  if (style === 'diagonal') {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {(variant === 'top' || variant === 'both') && (
          <div className="absolute top-0 left-0 right-0">
            <svg className="w-full h-12" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <polygon 
                points="0,0 1200,0 1200,100 0,50" 
                fill="currentColor" 
                className="text-tbf-gold opacity-10"
              />
              <polygon 
                points="0,0 1200,0 1200,60 0,30" 
                fill="currentColor" 
                className="text-tbf-gold"
              />
            </svg>
            {/* Basketball decorative elements */}
            <div className="absolute top-6 left-1/4 w-3 h-3 bg-white rounded-full opacity-60"></div>
            <div className="absolute top-3 left-1/2 w-2 h-2 bg-white rounded-full opacity-40"></div>
            <div className="absolute top-8 right-1/3 w-2.5 h-2.5 bg-white rounded-full opacity-50"></div>
          </div>
        )}
        {(variant === 'bottom' || variant === 'both') && (
          <div className="absolute bottom-0 left-0 right-0 rotate-180">
            <svg className="w-full h-12" viewBox="0 0 1200 100" preserveAspectRatio="none">
              <polygon 
                points="0,0 1200,0 1200,100 0,50" 
                fill="currentColor" 
                className="text-tbf-gold opacity-10"
              />
              <polygon 
                points="0,0 1200,0 1200,60 0,30" 
                fill="currentColor" 
                className="text-tbf-gold"
              />
            </svg>
          </div>
        )}
      </div>
    )
  }

  if (style === 'geometric') {
    return (
      <div className={`relative ${className}`}>
        {(variant === 'top' || variant === 'both') && (
          <div className="absolute top-0 left-0 right-0">
            <div className="h-2 bg-gradient-to-r from-tbf-gold via-black to-tbf-gold opacity-80"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-tbf-gold to-transparent mt-1"></div>
            {/* Decorative diamonds */}
            <div className="absolute -top-4 left-1/4 w-8 h-8 bg-tbf-gold transform rotate-45 opacity-20"></div>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-black transform rotate-45"></div>
            <div className="absolute -top-4 right-1/4 w-8 h-8 bg-tbf-gold transform rotate-45 opacity-20"></div>
          </div>
        )}
        {(variant === 'bottom' || variant === 'both') && (
          <div className="absolute bottom-0 left-0 right-0">
            <div className="h-px bg-gradient-to-r from-transparent via-tbf-gold to-transparent mb-1"></div>
            <div className="h-2 bg-gradient-to-r from-tbf-gold via-black to-tbf-gold opacity-80"></div>
          </div>
        )}
      </div>
    )
  }

  return null
}
