'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, ChevronDown, Sparkles, CheckCircle2 } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants, getStaggerContainerVariants } from '@/lib/animations'

interface HeroSectionProps {
  layout?: string
  brideName: string
  groomName: string
  weddingDate?: Date | string | null
  weddingTime?: string | null
  venueTeaser?: string | null
  heroImage?: string | null
  heroImageMobile?: string | null
  invitationText?: string | null
  invitationSubtext?: string | null
  monogram?: string | null
  showMonogram?: boolean
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
  rsvpEnabled?: boolean
}

export function HeroSection({
  layout = 'cinematic',
  brideName,
  groomName,
  weddingDate,
  weddingTime,
  venueTeaser,
  heroImage,
  heroImageMobile,
  invitationText,
  invitationSubtext,
  monogram,
  showMonogram = true,
  theme,
  preset = 'elegant',
  isRtl = true,
  rsvpEnabled = false,
}: HeroSectionProps) {
  const containerVariants = getStaggerContainerVariants(preset)
  const itemVariants = getFadeUpVariants(preset)

  const formattedDate =
    weddingDate && !isNaN(new Date(weddingDate).getTime())
      ? new Date(weddingDate).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

  const defaultImage =
    heroImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80'

  // Scroll to first content section smoothly
  const handleScrollDown = () => {
    const nextElem = document.getElementById('invitation-content') || document.querySelector('section:nth-of-type(2)')
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ─────────────────────────────────────────────────────────────
  // LAYOUT 1: SPLIT SCREEN
  // ─────────────────────────────────────────────────────────────
  if (layout === 'split') {
    return (
      <section className="relative min-h-[90vh] flex flex-col md:flex-row items-stretch overflow-hidden">
        {/* Text Half */}
        <div
          className="flex-1 flex flex-col justify-center items-center text-center p-8 md:p-16 z-10"
          style={{ backgroundColor: theme.colors.background }}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md w-full"
          >
            {showMonogram !== false && monogram && (
              <motion.div
                variants={itemVariants}
                className="w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center mb-6 font-serif-luxury font-bold text-lg"
                style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
              >
                {monogram}
              </motion.div>
            )}

            <motion.p
              variants={itemVariants}
              className="text-xs uppercase tracking-widest font-semibold mb-3"
              style={{ color: theme.colors.primary }}
            >
              {invitationText || (isRtl ? 'دعوة زفاف خاصة' : 'Wedding Celebration')}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-serif-luxury font-bold mb-4 leading-tight"
              style={{ color: theme.colors.text }}
            >
              <div>{brideName}</div>
              <div className="text-2xl my-2 font-normal" style={{ color: theme.colors.primary }}>
                &
              </div>
              <div>{groomName}</div>
            </motion.h1>

            {formattedDate && (
              <motion.div
                variants={itemVariants}
                className="mt-6 pt-6 border-t flex flex-col items-center gap-2 text-sm"
                style={{ borderColor: `${theme.colors.border}`, color: theme.colors.textLight }}
              >
                <div className="flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4" style={{ color: theme.colors.primary }} />
                  <span>{formattedDate}</span>
                </div>
                {weddingTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: theme.colors.primary }} />
                    <span>{weddingTime}</span>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Image Half */}
        <div className="flex-1 relative min-h-[350px] md:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${defaultImage}')` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${theme.colors.background} 0%, transparent 40%)`,
            }}
          />
        </div>
      </section>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // LAYOUT 2: MINIMAL LUXURY
  // ─────────────────────────────────────────────────────────────
  if (layout === 'minimal') {
    return (
      <section
        className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 py-20"
        style={{ backgroundColor: theme.colors.background }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          {showMonogram !== false && monogram && (
            <motion.span
              variants={itemVariants}
              className="text-sm uppercase tracking-widest block mb-6 font-semibold"
              style={{ color: theme.colors.primary }}
            >
              {monogram}
            </motion.span>
          )}

          <motion.p
            variants={itemVariants}
            className="text-xs uppercase tracking-widest mb-4"
            style={{ color: theme.colors.textLight }}
          >
            {invitationText || (isRtl ? 'يسعدنا دعوتكم لمشاركتنا فرحتنا' : 'Save The Date')}
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-serif-luxury font-light tracking-wide mb-6"
            style={{ color: theme.colors.text }}
          >
            <span>{brideName}</span>
            <span className="mx-4 font-serif italic font-normal" style={{ color: theme.colors.primary }}>
              &
            </span>
            <span>{groomName}</span>
          </motion.h1>

          <motion.div
            variants={itemVariants}
            className="w-16 h-[1px] mx-auto my-6"
            style={{ backgroundColor: theme.colors.primary }}
          />

          {formattedDate && (
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl font-serif-luxury"
              style={{ color: theme.colors.text }}
            >
              {formattedDate}
            </motion.p>
          )}

          {weddingTime && (
            <motion.p
              variants={itemVariants}
              className="text-sm mt-2"
              style={{ color: theme.colors.textLight }}
            >
              {weddingTime}
            </motion.p>
          )}
        </motion.div>

        {/* Scroll Indicator */}
        <div
          onClick={handleScrollDown}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity flex flex-col items-center gap-1"
          style={{ color: theme.colors.textLight }}
        >
          <span className="text-[10px] uppercase tracking-wider">{isRtl ? 'التفاصيل' : 'Details'}</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </section>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // LAYOUT 3: ARABIC TYPOGRAPHY FOCAL HERO
  // ─────────────────────────────────────────────────────────────
  if (layout === 'arabic') {
    return (
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
        style={{ backgroundColor: theme.colors.background }}
      >
        {/* Subtle patterned backdrop */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${theme.colors.primary} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-xl mx-auto p-8 border"
          style={{
            borderColor: `${theme.colors.primary}44`,
            backgroundColor: `${theme.colors.surface}DD`,
          }}
        >
          {/* Ornate corner squares */}
          <div className="absolute top-2 left-2 w-3 h-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
          <div className="absolute top-2 right-2 w-3 h-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
          <div className="absolute bottom-2 left-2 w-3 h-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />
          <div className="absolute bottom-2 right-2 w-3 h-3 rotate-45" style={{ backgroundColor: theme.colors.primary }} />

          <motion.p
            variants={itemVariants}
            className="text-xs uppercase tracking-widest font-semibold mb-4"
            style={{ color: theme.colors.primary }}
          >
            {invitationText || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
          </motion.p>

          <motion.div variants={itemVariants} className="my-6">
            <h1
              className="text-3xl md:text-5xl font-arabic-luxury font-bold leading-relaxed"
              style={{ color: theme.colors.text }}
            >
              <span>{brideName}</span>
              <span className="block text-2xl md:text-3xl my-2 font-normal" style={{ color: theme.colors.primary }}>
                وَ
              </span>
              <span>{groomName}</span>
            </h1>
          </motion.div>

          {invitationSubtext && (
            <motion.p
              variants={itemVariants}
              className="text-sm font-medium mb-6 opacity-90 leading-relaxed"
              style={{ color: theme.colors.textLight }}
            >
              {invitationSubtext}
            </motion.p>
          )}

          {formattedDate && (
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t flex items-center justify-center gap-4 text-sm font-medium"
              style={{ borderColor: `${theme.colors.border}`, color: theme.colors.text }}
            >
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" style={{ color: theme.colors.primary }} />
                <span>{formattedDate}</span>
              </div>
              {weddingTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" style={{ color: theme.colors.primary }} />
                  <span>{weddingTime}</span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </section>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // DEFAULT: FULL-SCREEN CINEMATIC HERO
  // ─────────────────────────────────────────────────────────────
  return (
    <section className="relative min-h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Photography with Zoom animation */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${defaultImage}')` }}
      >
        {/* Multi-layered cinematic gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(26,20,16,0.35) 0%, rgba(26,20,16,0.55) 50%, rgba(26,20,16,0.85) 100%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)`,
          }}
        />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 px-4 py-16 max-w-3xl mx-auto flex flex-col items-center"
      >
        {/* Monogram or Badge */}
        {showMonogram !== false && monogram && (
          <motion.div
            variants={itemVariants}
            className="w-16 h-16 rounded-full border border-white/40 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg bg-black/20"
          >
            <span className="font-serif-luxury text-xl font-bold tracking-widest text-[#EAE1D3]">
              {monogram}
            </span>
          </motion.div>
        )}

        {/* Top Invitation Hook */}
        <motion.p
          variants={itemVariants}
          className="text-xs md:text-sm uppercase tracking-[0.25em] font-medium text-[#DFCA9B] mb-4 drop-shadow-sm"
        >
          {invitationText || (isRtl ? 'دعوة لحضور حفل الزفاف' : 'The Wedding Celebration of')}
        </motion.p>

        {/* Bride & Groom Names — Visual Focal Point */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-serif-luxury font-bold tracking-wide leading-tight mb-6 drop-shadow-md"
        >
          <span className="inline-block">{brideName}</span>
          <span className="mx-3 md:mx-6 font-normal inline-block text-[#DFCA9B] font-serif italic text-3xl md:text-5xl">
            &
          </span>
          <span className="inline-block">{groomName}</span>
        </motion.h1>

        {/* Subtle Decorative Gold Divider */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 my-4 w-full">
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#DFCA9B] to-[#DFCA9B]" />
          <Sparkles className="w-4 h-4 text-[#DFCA9B]" />
          <div className="h-[1px] w-20 bg-gradient-to-l from-transparent via-[#DFCA9B] to-[#DFCA9B]" />
        </motion.div>

        {/* Date and Time Bar */}
        {(formattedDate || weddingTime) && (
          <motion.div
            variants={itemVariants}
            className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm md:text-base font-medium text-white/95 backdrop-blur-sm bg-black/30 px-6 py-2.5 rounded-full border border-white/20"
          >
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#DFCA9B]" />
                <span>{formattedDate}</span>
              </div>
            )}
            {formattedDate && weddingTime && <span className="text-white/40">•</span>}
            {weddingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#DFCA9B]" />
                <span>{weddingTime}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Venue Teaser */}
        {venueTeaser && (
          <motion.div
            variants={itemVariants}
            className="mt-3 flex items-center gap-1.5 text-xs md:text-sm text-white/80"
          >
            <MapPin className="w-3.5 h-3.5 text-[#DFCA9B]" />
            <span>{venueTeaser}</span>
          </motion.div>
        )}

        {/* RSVP Quick Action Button */}
        {rsvpEnabled && (
          <motion.div variants={itemVariants} className="mt-6">
            <button
              type="button"
              onClick={() => {
                const rsvpElem = document.getElementById('rsvp')
                if (rsvpElem) {
                  rsvpElem.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold text-[#332A25] bg-gradient-to-r from-[#DFCA9B] via-[#C8A96B] to-[#DFCA9B] shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#332A25]" />
              <span>{isRtl ? 'تأكيد الحضور (RSVP)' : 'Confirm Attendance'}</span>
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Animated Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center gap-1 text-white/70 hover:text-white transition-colors"
      >
        <span className="text-[11px] uppercase tracking-widest font-medium">
          {isRtl ? 'التفاصيل' : 'Discover'}
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce text-[#DFCA9B]" />
      </motion.div>
    </section>
  )
}
