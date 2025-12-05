
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ImageModalProps {
  src: string
  alt: string
  title?: string
  description?: string
  children: React.ReactNode
}

export default function ImageModal({ src, alt, title, description, children }: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            aria-label="Close modal"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative max-w-6xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[80vh]">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            {(title || description) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                {title && <h3 className="text-2xl font-bold mb-2">{title}</h3>}
                {description && <p className="text-gray-200">{description}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
