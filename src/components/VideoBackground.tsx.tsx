// src/components/VideoBackground.tsx
'use client'
import { useEffect, useState } from 'react'

export default function VideoBackground() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = window.innerHeight // Approximate hero section height
      
      // Show video after scrolling past hero section
      setIsVisible(scrollY > heroHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 -z-5">
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