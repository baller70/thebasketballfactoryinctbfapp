'use client'

import { useSearchParams } from 'next/navigation'
import { AlertCircle, X } from 'lucide-react'
import { useState, Suspense } from 'react'

function CanceledBannerContent() {
  const searchParams = useSearchParams()
  const canceled = searchParams.get('canceled')
  const [dismissed, setDismissed] = useState(false)

  if (canceled !== 'true' || dismissed) return null

  return (
    <div className="bg-yellow-900/80 border-b border-tbf-gold/50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-tbf-gold flex-shrink-0" />
          <p className="text-white text-sm">
            Payment was canceled. Your booking is still saved — scroll down to try again when you&apos;re ready.
          </p>
        </div>
        <button onClick={() => setDismissed(true)} className="text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default function CanceledBanner() {
  return (
    <Suspense fallback={null}>
      <CanceledBannerContent />
    </Suspense>
  )
}
