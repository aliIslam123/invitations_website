'use client'

import React, { useMemo } from 'react'
import { ThemeConfig } from '@/lib/themes'

export type FloralEffectType = 'petals' | 'leaves' | 'sparkles' | 'romantic' | 'none'

interface FloatingPetalsBackgroundProps {
  effectType?: FloralEffectType
  theme: ThemeConfig
}

interface Particle {
  id: number
  type: 'petal' | 'leaf' | 'sparkle' | 'jasmine'
  left: number // 0-100%
  size: number // px
  duration: number // seconds
  delay: number // seconds
  driftX: number // px
  swayX: number // px
  opacity: number // 0.1 - 0.3
  color: string
}

export function FloatingPetalsBackground({
  effectType = 'romantic',
  theme,
}: FloatingPetalsBackgroundProps) {
  if (effectType === 'none') {
    return null
  }

  // Generate a deterministic or stable set of particles
  const particles = useMemo<Particle[]>(() => {
    const list: Particle[] = []
    const count = 22

    const primaryColor = theme.colors.primary || '#C8A96B'
    const secondaryColor = theme.colors.secondary || '#DFCA9B'

    for (let i = 0; i < count; i++) {
      let pType: 'petal' | 'leaf' | 'sparkle' | 'jasmine' = 'petal'

      if (effectType === 'petals') {
        pType = i % 3 === 0 ? 'jasmine' : 'petal'
      } else if (effectType === 'leaves') {
        pType = i % 4 === 0 ? 'sparkle' : 'leaf'
      } else if (effectType === 'sparkles') {
        pType = 'sparkle'
      } else {
        // romantic blend
        const mod = i % 4
        if (mod === 0) pType = 'petal'
        else if (mod === 1) pType = 'jasmine'
        else if (mod === 2) pType = 'leaf'
        else pType = 'sparkle'
      }

      // Pick color based on particle type and theme
      let color = primaryColor
      if (pType === 'petal') {
        color = theme.name.includes('burgundy')
          ? '#9B3B48'
          : theme.name.includes('blush')
          ? '#E8B4B8'
          : '#E2B89D'
      } else if (pType === 'leaf') {
        color = theme.name.includes('botanical') ? '#556B2F' : primaryColor
      } else if (pType === 'jasmine') {
        color = '#FAF5E8'
      } else {
        color = secondaryColor
      }

      const left = ((i * 17 + 7) % 96) + 2
      const size = pType === 'sparkle' ? 7 + (i % 6) : 16 + (i % 14)
      const duration = 14 + (i % 10) * 1.5
      const delay = (i * 0.8) % 12
      const driftX = ((i * 23) % 100) - 50
      const swayX = ((i * 19) % 50) - 25
      const opacity = 0.12 + ((i * 7) % 16) / 100 // 0.12 to 0.28

      list.push({
        id: i,
        type: pType,
        left,
        size,
        duration,
        delay,
        driftX,
        swayX,
        opacity,
        color,
      })
    }
    return list
  }, [effectType, theme])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-20 transition-opacity duration-1000"
    >
      {particles.map((p) => {
        if (p.type === 'sparkle') {
          return (
            <div
              key={p.id}
              className="twinkle-sparkle absolute"
              style={{
                left: `${p.left}%`,
                top: `${((p.id * 23) % 90) + 5}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration * 0.3}s`,
                animationDelay: `${p.delay}s`,
                color: p.color,
                opacity: p.opacity * 1.2,
              }}
            >
              {/* Star sparkle SVG */}
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-full h-full drop-shadow-sm"
              >
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          )
        }

        return (
          <div
            key={p.id}
            className="floating-petal absolute"
            style={
              {
                left: `${p.left}%`,
                top: '-5%',
                width: `${p.size}px`,
                height: `${p.size * 1.25}px`,
                animationDuration: `${p.duration}s, ${p.duration * 0.4}s`,
                animationDelay: `${p.delay}s, ${p.delay * 0.5}s`,
                ['--drift-x' as any]: `${p.driftX}px`,
                ['--sway-x' as any]: `${p.swayX}px`,
                ['--petal-opacity' as any]: p.opacity,
                color: p.color,
              } as React.CSSProperties
            }
          >
            {p.type === 'leaf' ? (
              // Delicate botanical leaf SVG
              <svg
                viewBox="0 0 32 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full filter drop-shadow-sm opacity-85"
              >
                <path
                  d="M16 2C26 10 30 25 16 38C2 25 6 10 16 2Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M16 4V36"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M16 14L22 10M16 22L23 18M16 18L10 15M16 26L9 23"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : p.type === 'jasmine' ? (
              // Delicate blossom / Jasmine petal SVG
              <svg
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full filter drop-shadow-sm"
              >
                <circle cx="15" cy="15" r="4" fill="rgba(200, 169, 107, 0.6)" />
                <path
                  d="M15 11C12 4 18 4 15 11ZM19 15C26 12 26 18 19 15ZM15 19C18 26 12 26 15 19ZM11 15C4 18 4 12 11 15Z"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
              </svg>
            ) : (
              // Organic Rose Petal SVG
              <svg
                viewBox="0 0 32 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full filter drop-shadow-sm"
              >
                <path
                  d="M16 2C24 4 30 14 28 24C26 33 19 36 16 36C13 36 6 33 4 24C2 14 8 4 16 2Z"
                  fill="currentColor"
                  fillOpacity="0.85"
                />
                <path
                  d="M16 8C19 15 20 25 16 32"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="0.9"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        )
      })}
    </div>
  )
}
