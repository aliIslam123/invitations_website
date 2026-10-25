'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Sparkles, Volume2, ArrowDown } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset } from '@/lib/animations'

interface InvitationCoverProps {
  brideName: string
  groomName: string
  weddingDate?: Date | string | null
  monogram?: string | null
  coverImage?: string | null
  coverType?: string
  theme: ThemeConfig
  preset: AnimationPreset
  onOpen: () => void
  isRtl?: boolean
}

export function InvitationCover({
  brideName,
  groomName,
  weddingDate,
  monogram,
  coverImage,
  coverType = 'elegant',
  theme,
  preset,
  onOpen,
  isRtl = true,
}: InvitationCoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (coverType === 'none') {
    return null
  }

  const handleOpen = () => {
    setIsOpen(true)
    onOpen()
  }

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  const defaultMonogram = monogram || `${brideName.charAt(0)} & ${groomName.charAt(0)}`

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="cover-wrapper"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: 'blur(10px)',
            transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: theme.colors.background }}
        >
          {/* Background image with overlay */}
          {coverImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
              style={{
                backgroundImage: `url('${coverImage}')`,
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: theme.colors.secondary,
                  opacity: 0.65,
                }}
              />
            </div>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${theme.colors.background} 0%, ${theme.colors.border} 100%)`,
              }}
            />
          )}

          {/* Luxury Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mx-4 max-w-lg w-full p-8 md:p-12 text-center rounded-sm shadow-2xl backdrop-blur-md border"
            style={{
              backgroundColor: `${theme.colors.surface}EE`,
              borderColor: `${theme.colors.primary}55`,
              boxShadow: `0 25px 50px -12px ${theme.colors.secondary}33`,
            }}
          >
            {/* Ornate corner borders */}
            <div
              className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2"
              style={{ borderColor: theme.colors.primary }}
            />
            <div
              className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2"
              style={{ borderColor: theme.colors.primary }}
            />
            <div
              className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2"
              style={{ borderColor: theme.colors.primary }}
            />
            <div
              className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2"
              style={{ borderColor: theme.colors.primary }}
            />

            {/* Monogram Seal */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="mx-auto w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 mb-6 shadow-sm"
              style={{
                borderColor: theme.colors.primary,
                backgroundColor: `${theme.colors.background}`,
              }}
            >
              <span
                className="font-serif-luxury text-xl md:text-2xl font-bold tracking-widest"
                style={{ color: theme.colors.primary }}
              >
                {defaultMonogram}
              </span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-xs uppercase tracking-widest font-medium mb-3"
              style={{ color: theme.colors.textLight }}
            >
              {isRtl ? 'دعوة لحضور حفل زفاف' : 'The Wedding Invitation of'}
            </motion.p>

            {/* Couple Names */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mb-4"
            >
              <h1
                className="text-2xl md:text-4xl font-serif-luxury font-bold leading-relaxed tracking-wide"
                style={{ color: theme.colors.text }}
              >
                {isRtl ? (
                  <>
                    <span>{brideName}</span>
                    <span className="mx-3 inline-block" style={{ color: theme.colors.primary }}>
                      &
                    </span>
                    <span>{groomName}</span>
                  </>
                ) : (
                  <>
                    <span>{brideName}</span>
                    <span className="mx-3 inline-block font-normal" style={{ color: theme.colors.primary }}>
                      &
                    </span>
                    <span>{groomName}</span>
                  </>
                )}
              </h1>
            </motion.div>

            {/* Gold Divider with Icon */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.65, duration: 0.8 }}
              className="flex items-center justify-center my-6 gap-3"
            >
              <div className="h-[1px] w-16" style={{ backgroundColor: theme.colors.primary }} />
              <Heart className="w-4 h-4 fill-current" style={{ color: theme.colors.primary }} />
              <div className="h-[1px] w-16" style={{ backgroundColor: theme.colors.primary }} />
            </motion.div>

            {/* Date */}
            {formattedDate && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-sm md:text-base font-medium mb-8"
                style={{ color: theme.colors.textLight }}
              >
                {formattedDate}
              </motion.p>
            )}

            {/* Open Invitation CTA */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleOpen}
              className="relative px-8 py-3.5 rounded-sm font-medium tracking-wide text-sm md:text-base transition-all duration-300 shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
              style={{
                backgroundColor: theme.colors.primary,
                color: '#FFFFFF',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isRtl ? 'افتح الدعوة' : 'Open Invitation'}</span>
            </motion.button>

            {/* Skip hint */}
            <button
              onClick={handleOpen}
              className="mt-6 text-xs transition-colors duration-200 underline opacity-70 hover:opacity-100 cursor-pointer block mx-auto"
              style={{ color: theme.colors.textLight }}
            >
              {isRtl ? 'تخطي الغلاف مباشرة' : 'Skip Cover'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
