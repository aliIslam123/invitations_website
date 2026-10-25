'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants } from '@/lib/animations'

export interface GalleryPhoto {
  id: string
  url: string
  caption?: string | null
  altText?: string | null
  displayOrder: number
  isVisible: boolean
}

interface GallerySectionProps {
  photos: GalleryPhoto[]
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
}

export function GallerySection({
  photos,
  theme,
  preset = 'elegant',
  isRtl = true,
}: GallerySectionProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const fadeVariants = getFadeUpVariants(preset)

  const visiblePhotos = photos
    .filter((p) => p && p.url && p.isVisible !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  if (visiblePhotos.length === 0) {
    return null
  }

  const handlePrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + visiblePhotos.length) % visiblePhotos.length
    )
  }, [visiblePhotos.length])

  const handleNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % visiblePhotos.length
    )
  }, [visiblePhotos.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null)
      if (e.key === 'ArrowRight') isRtl ? handlePrev() : handleNext()
      if (e.key === 'ArrowLeft') isRtl ? handleNext() : handlePrev()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, isRtl, handlePrev, handleNext])

  return (
    <section className="py-20 px-4 md:px-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: theme.colors.primary }}>
            {isRtl ? 'لحظات لا تُنسى' : 'Moments of Love'}
          </p>
          <h2 className="text-3xl md:text-4xl font-serif-luxury font-bold" style={{ color: theme.colors.text }}>
            {isRtl ? 'معرض الصور التذكارية' : 'Photo Gallery'}
          </h2>
          <div className="w-14 h-[1px] mx-auto mt-3" style={{ backgroundColor: theme.colors.primary }} />
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {visiblePhotos.map((photo, index) => {
            return (
              <motion.div
                key={photo.id || index}
                variants={fadeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                onClick={() => setLightboxIndex(index)}
                className="group relative h-64 md:h-80 overflow-hidden rounded-sm cursor-pointer border shadow-sm bg-black/5"
                style={{ borderColor: `${theme.colors.primary}22` }}
              >
                <img
                  src={photo.url}
                  alt={photo.altText || photo.caption || 'صورة من الزفاف'}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />

                {/* Hover overlay with caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-[#DFCA9B]" />
                    <span className="text-xs uppercase tracking-wider text-[#DFCA9B]">
                      {isRtl ? 'عرض الصورة' : 'View Fullscreen'}
                    </span>
                  </div>
                  {photo.caption && (
                    <p className="text-sm font-medium leading-snug line-clamp-2">
                      {photo.caption}
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8"
          >
            {/* Top Bar with Counter & Close Button */}
            <div className="flex items-center justify-between text-white z-10">
              <span className="text-xs md:text-sm font-mono opacity-80">
                {lightboxIndex + 1} / {visiblePhotos.length}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
                aria-label="Close lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Main Image Stage */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <motion.img
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={visiblePhotos[lightboxIndex].url}
                alt={visiblePhotos[lightboxIndex].caption || 'صورة مكبرة'}
                className="max-h-[80vh] max-w-full object-contain rounded-sm shadow-2xl"
              />

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  isRtl ? handleNext() : handlePrev()
                }}
                className="absolute left-2 md:left-6 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  isRtl ? handlePrev() : handleNext()
                }}
                className="absolute right-2 md:right-6 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            {visiblePhotos[lightboxIndex].caption && (
              <div className="text-center text-white/90 text-sm md:text-base font-serif-luxury pb-2 z-10">
                <p>{visiblePhotos[lightboxIndex].caption}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
