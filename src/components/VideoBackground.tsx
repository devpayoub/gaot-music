// src/components/VideoBackground.tsx
'use client'
import { useEffect, useState } from 'react'

export default function VideoBackground() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const featuredAlbumsSection = document.querySelector('[data-section="featured-albums"]')
      
      if (featuredAlbumsSection) {
        const rect = featuredAlbumsSection.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight && rect.bottom > 0
        
        setIsVisible(isInView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="absolute inset-0 -z-10">
      <video
        autoPlay
        muted
        loop
        className="w-full h-full object-cover opacity-10"
      >
        <source src="/back.mp4" type="video/mp4" />
      </video>
    </div>
  )
} 