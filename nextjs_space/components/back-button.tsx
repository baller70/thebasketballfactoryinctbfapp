
'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-2 text-white hover:text-gold transition-colors px-4 py-2 mt-4"
    >
      <ChevronLeft className="h-5 w-5" />
      <span className="text-sm font-bold uppercase tracking-wider">Back</span>
    </button>
  )
}
