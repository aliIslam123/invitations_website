'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Quote } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants } from '@/lib/animations'

interface MessageSectionProps {
  heading?: string | null
  body?: string | null
  familyNamesEnabled?: boolean
  familyNamesContent?: string | null
  brideFather?: string | null
  brideMother?: string | null
  groomFather?: string | null
  groomMother?: string | null
  brideName?: string
  groomName?: string
  bridePhoto?: string | null
  groomPhoto?: string | null
  couplePhoto?: string | null
  brideBio?: string | null
  groomBio?: string | null
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
}

export function MessageSection({
  heading,
  body,
  familyNamesEnabled,
  familyNamesContent,
  brideFather,
  brideMother,
  groomFather,
  groomMother,
  brideName,
  groomName,
  bridePhoto,
  groomPhoto,
  couplePhoto,
  brideBio,
  groomBio,
  theme,
  preset = 'elegant',
  isRtl = true,
}: MessageSectionProps) {
  const fadeVariants = getFadeUpVariants(preset)

  const defaultHeading = isRtl ? 'بسم الله الرحمن الرحيم' : 'In The Name of Love'
  const defaultBody = isRtl
    ? 'بكل الحب والفرحة، نتشرف بدعوتكم لمشاركتنا أجمل لحظات حياتنا وبداية حكايتنا معاً.'
    : 'With hearts full of love and gratitude, we invite you to celebrate the beginning of our forever together.'

  return (
    <section
      id="invitation-content"
      className="relative py-20 px-4 md:px-8 overflow-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative Top Accent */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <div className="h-[1px] w-12" style={{ backgroundColor: theme.colors.primary }} />
          <Heart className="w-5 h-5 fill-current" style={{ color: theme.colors.primary }} />
          <div className="h-[1px] w-12" style={{ backgroundColor: theme.colors.primary }} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-2xl md:text-3xl font-serif-luxury font-bold mb-6 tracking-wide"
          style={{ color: theme.colors.text }}
        >
          {heading || defaultHeading}
        </motion.h2>

        {/* Family Names Announcement (if enabled) */}
        {familyNamesEnabled && familyNamesContent && (
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="mb-8 p-6 rounded-sm border max-w-2xl mx-auto shadow-sm"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: `${theme.colors.primary}33`,
            }}
          >
            <p
              className="text-base md:text-lg font-medium leading-relaxed"
              style={{ color: theme.colors.text }}
            >
              {familyNamesContent}
            </p>
          </motion.div>
        )}

        {/* Message Body */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative max-w-2xl mx-auto mb-12"
        >
          <Quote
            className="w-8 h-8 mx-auto mb-4 opacity-30"
            style={{ color: theme.colors.primary }}
          />
          <p
            className="text-base md:text-xl leading-loose font-normal"
            style={{ color: theme.colors.textLight }}
          >
            {body || defaultBody}
          </p>
        </motion.div>

        {/* Couple Portraits & Bios (if photos exist) */}
        {(bridePhoto || groomPhoto || couplePhoto) && (
          <motion.div
            variants={fadeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="mt-12 pt-10 border-t flex flex-wrap justify-center items-center gap-8 md:gap-16"
            style={{ borderColor: `${theme.colors.border}` }}
          >
            {/* Bride Card */}
            {bridePhoto && (
              <div className="flex flex-col items-center max-w-xs text-center">
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 p-1 mb-4 shadow-md"
                  style={{ borderColor: theme.colors.primary }}
                >
                  <img
                    src={bridePhoto}
                    alt={brideName || 'العروس'}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                {brideName && (
                  <h3
                    className="font-serif-luxury font-bold text-lg md:text-xl"
                    style={{ color: theme.colors.text }}
                  >
                    {brideName}
                  </h3>
                )}
                {brideBio && (
                  <p className="text-xs md:text-sm mt-1" style={{ color: theme.colors.textLight }}>
                    {brideBio}
                  </p>
                )}
              </div>
            )}

            {/* Couple Centerpiece (if provided) */}
            {couplePhoto && !bridePhoto && !groomPhoto && (
              <div className="max-w-md mx-auto rounded-sm overflow-hidden shadow-xl border p-2 bg-white">
                <img
                  src={couplePhoto}
                  alt="العروسان"
                  className="w-full h-72 object-cover rounded-sm"
                  loading="lazy"
                />
              </div>
            )}

            {/* Groom Card */}
            {groomPhoto && (
              <div className="flex flex-col items-center max-w-xs text-center">
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 p-1 mb-4 shadow-md"
                  style={{ borderColor: theme.colors.primary }}
                >
                  <img
                    src={groomPhoto}
                    alt={groomName || 'العريس'}
                    className="w-full h-full object-cover rounded-full"
                    loading="lazy"
                  />
                </div>
                {groomName && (
                  <h3
                    className="font-serif-luxury font-bold text-lg md:text-xl"
                    style={{ color: theme.colors.text }}
                  >
                    {groomName}
                  </h3>
                )}
                {groomBio && (
                  <p className="text-xs md:text-sm mt-1" style={{ color: theme.colors.textLight }}>
                    {groomBio}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  )
}
