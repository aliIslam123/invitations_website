'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Compass, CheckCircle2 } from 'lucide-react'
import { getTheme, ThemeConfig } from '@/lib/themes'
import { AnimationPreset } from '@/lib/animations'
import { InvitationCover } from './InvitationCover'
import { HeroSection } from './HeroSection'
import { MessageSection } from './MessageSection'
import { CountdownSection } from './CountdownSection'
import { EventsSection } from './EventsSection'
import { TimelineSection } from './TimelineSection'
import { GallerySection } from './GallerySection'
import { RSVPSection } from './RSVPSection'
import { AdditionalSections } from './AdditionalSections'
import { MusicPlayer } from './MusicPlayer'
import { FloatingPetalsBackground, FloralEffectType } from './FloatingPetalsBackground'

export interface InvitationData {
  id: string
  slug: string
  title: string
  language: string
  direction: string
  coverEnabled: boolean
  coverType: string
  coverImage?: string | null
  coverMonogram?: string | null
  themeId: string
  themeCustom?: string | null
  animationPreset: string

  musicEnabled: boolean
  musicUrl?: string | null
  musicTitle?: string | null
  musicPosition?: string

  rsvpEnabled: boolean
  rsvpDeadline?: Date | string | null
  rsvpMaxGuests?: number | null
  rsvpAllowPlusOne?: boolean
  rsvpRequireContact?: boolean
  rsvpConfirmMsg?: string | null
  rsvpDeclineMsg?: string | null

  couple?: any
  events?: any[]
  gallery?: any[]
  timeline?: any[]
  sections?: any[]
}

interface InvitationRendererProps {
  invitation: InvitationData
  isPreviewMode?: boolean
}

export function InvitationRenderer({
  invitation,
  isPreviewMode = false,
}: InvitationRendererProps) {
  const [coverOpened, setCoverOpened] = useState(!invitation.coverEnabled)
  const [musicTrigger, setMusicTrigger] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)

  const animationFrameRef = useRef<number | null>(null)
  const isAutoScrollingRef = useRef(false)

  // Resolve Theme configuration and custom settings
  const baseTheme = getTheme(invitation.themeId || 'royal-champagne')
  let theme: ThemeConfig = { ...baseTheme }
  let floralEffect: FloralEffectType = 'romantic'
  let autoScrollEnabled = true
  let calendarEnabled = true
  let showLocationCard = true
  let showMonogram = true
  let musicTrimEnabled = false
  let musicStart: number | null = null
  let musicEnd: number | null = null

  if (invitation.themeCustom) {
    try {
      const custom =
        typeof invitation.themeCustom === 'string'
          ? JSON.parse(invitation.themeCustom)
          : invitation.themeCustom
      theme = {
        ...theme,
        colors: { ...theme.colors, ...(custom.colors || {}) },
        fonts: { ...theme.fonts, ...(custom.fonts || {}) },
      }
      if (custom.backgroundEffect) {
        floralEffect = custom.backgroundEffect
      }
      if (custom.autoScrollEnabled !== undefined) {
        autoScrollEnabled = custom.autoScrollEnabled
      }
      if (custom.calendarEnabled !== undefined) {
        calendarEnabled = custom.calendarEnabled
      }
      if (custom.showLocationCard !== undefined) {
        showLocationCard = custom.showLocationCard
      }
      if (custom.showMonogram !== undefined) {
        showMonogram = custom.showMonogram
      }
      if (custom.musicTrimEnabled !== undefined) {
        musicTrimEnabled = custom.musicTrimEnabled
      }
      if (custom.musicStart !== undefined && custom.musicStart !== null) {
        musicStart = Number(custom.musicStart)
      }
      if (custom.musicEnd !== undefined && custom.musicEnd !== null) {
        musicEnd = Number(custom.musicEnd)
      }
    } catch {
      // Keep base theme if custom parsing fails
    }
  }

  const preset = (invitation.animationPreset || 'elegant') as AnimationPreset
  const isRtl = invitation.direction === 'rtl' || invitation.language === 'ar'

  const couple = invitation.couple || {}
  
  // Resolve Groom Name with full reactive support for first name, last/family name, and full name
  const groomFirst = (couple.groomFirstName || '').trim()
  const groomLast = (couple.groomLastName || '').trim()
  const groomFull = (couple.groomFullName || '').trim()
  const groomName = (groomFirst || groomLast)
    ? [groomFirst, groomLast].filter(Boolean).join(' ')
    : (groomFull || 'العريس')

  // Resolve Bride Name with full reactive support for first name, last/family name, and full name
  const brideFirst = (couple.brideFirstName || '').trim()
  const brideLast = (couple.brideLastName || '').trim()
  const brideFull = (couple.brideFullName || '').trim()
  const brideName = (brideFirst || brideLast)
    ? [brideFirst, brideLast].filter(Boolean).join(' ')
    : (brideFull || 'العروس')
  const weddingDate = couple.weddingDate || null
  const weddingTime = couple.weddingTime || null

  // Cinematic gentle auto-scroll downwards
  const startAutoScroll = useCallback(() => {
    isAutoScrollingRef.current = true
    setIsAutoScrolling(true)

    const scrollStep = () => {
      if (!isAutoScrollingRef.current) return

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (window.scrollY >= maxScroll - 10) {
        // Reached end of page
        isAutoScrollingRef.current = false
        setIsAutoScrolling(false)
        return
      }

      window.scrollBy({ top: 1.2, behavior: 'instant' })
      animationFrameRef.current = requestAnimationFrame(scrollStep)
    }

    animationFrameRef.current = requestAnimationFrame(scrollStep)
  }, [])

  const stopAutoScroll = useCallback(() => {
    isAutoScrollingRef.current = false
    setIsAutoScrolling(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  // Pause auto-scroll if guest touches screen, moves mouse wheel, or presses key
  useEffect(() => {
    const handleUserInteraction = () => {
      if (isAutoScrollingRef.current) {
        stopAutoScroll()
      }
    }

    window.addEventListener('wheel', handleUserInteraction, { passive: true })
    window.addEventListener('touchstart', handleUserInteraction, { passive: true })
    window.addEventListener('keydown', handleUserInteraction, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleUserInteraction)
      window.removeEventListener('touchstart', handleUserInteraction)
      window.removeEventListener('keydown', handleUserInteraction)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [stopAutoScroll])

  // Handle opening cover & starting music & auto-scroll
  const handleOpenCover = () => {
    setCoverOpened(true)
    if (invitation.musicEnabled && invitation.musicUrl) {
      setMusicTrigger(true)
    }
    // Start gentle auto-scroll after the cover exit animation finishes
    if (autoScrollEnabled) {
      setTimeout(() => {
        startAutoScroll()
      }, 850)
    }
  }

  // Determine section order from saved sections
  const savedSections = (invitation.sections || []).slice().sort((a, b) => a.displayOrder - b.displayOrder)
  const defaultOrder = ['hero', 'message', 'countdown', 'events', 'timeline', 'gallery', 'rsvp', 'additional']
  const baseKeys = savedSections.length > 0 
    ? savedSections.filter(s => s.isVisible).map(s => s.sectionKey)
    : defaultOrder
  const orderedKeys = baseKeys.includes('additional') ? baseKeys : [...baseKeys, 'additional']

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <HeroSection
            key="hero"
            layout={couple.heroLayout || 'cinematic'}
            brideName={brideName}
            groomName={groomName}
            familyNamesEnabled={Boolean(couple.familyNamesEnabled)}
            familyNamesContent={couple.familyNamesContent}
            weddingDate={weddingDate}
            weddingTime={weddingTime}
            heroImage={couple.heroImage}
            heroImageMobile={couple.heroImageMobile}
            invitationText={couple.invitationText}
            invitationSubtext={couple.invitationSubtext}
            monogram={showMonogram ? (couple.monogram || invitation.coverMonogram) : null}
            showMonogram={showMonogram}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
            rsvpEnabled={Boolean(invitation.rsvpEnabled)}
          />
        )

      case 'message':
        return (
          <MessageSection
            key="message"
            heading={couple.messageHeading}
            body={couple.messageBody}
            familyNamesEnabled={couple.familyNamesEnabled}
            familyNamesContent={couple.familyNamesContent}
            brideFather={couple.brideFather}
            brideMother={couple.brideMother}
            groomFather={couple.groomFather}
            groomMother={couple.groomMother}
            brideName={brideName}
            groomName={groomName}
            bridePhoto={couple.bridePhoto}
            groomPhoto={couple.groomPhoto}
            couplePhoto={couple.couplePhoto}
            brideBio={couple.brideBio}
            groomBio={couple.groomBio}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
          />
        )

      case 'countdown':
        return (
          <CountdownSection
            key="countdown"
            weddingDate={weddingDate}
            timezone={couple.timezone}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
            postEventMessage={couple.postEventMessage}
            calendarEnabled={calendarEnabled}
          />
        )

      case 'events': {
        const eventsList = (invitation.events || []).filter((e: any) => e && e.isVisible !== false)
        if (eventsList.length === 0) return null
        return (
          <EventsSection
            key="events"
            events={invitation.events || []}
            weddingDate={weddingDate}
            sectionTitle={couple.eventsTitle || (invitation as any).eventsTitle}
            sectionSubtitle={couple.eventsSubtitle || (invitation as any).eventsSubtitle}
            showLocationCard={showLocationCard}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
          />
        )
      }

      case 'timeline': {
        const timelineSec = (invitation.sections || []).find((s: any) => s.sectionKey === 'timeline')
        if (timelineSec && timelineSec.isVisible === false) return null
        const visibleTimelineItems = (invitation.timeline || []).filter((item: any) => item.isVisible !== false)
        if (visibleTimelineItems.length === 0) return null
        return (
          <TimelineSection
            key="timeline"
            items={invitation.timeline || []}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
          />
        )
      }

      case 'gallery':
        return (
          <GallerySection
            key="gallery"
            photos={invitation.gallery || []}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
          />
        )

      case 'rsvp':
        if (!invitation.rsvpEnabled) return null
        return (
          <RSVPSection
            key="rsvp"
            invitationId={invitation.id}
            rsvpDeadline={invitation.rsvpDeadline}
            rsvpMaxGuests={invitation.rsvpMaxGuests}
            rsvpAllowPlusOne={invitation.rsvpAllowPlusOne}
            rsvpRequireContact={invitation.rsvpRequireContact}
            rsvpConfirmMsg={invitation.rsvpConfirmMsg}
            rsvpDeclineMsg={invitation.rsvpDeclineMsg}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
          />
        )

      case 'dresscode':
      case 'additional':
        return (
          <AdditionalSections
            key="additional"
            dressCodeEnabled={couple.dressCodeEnabled}
            dressCodeContent={couple.dressCodeContent}
            giftInfoEnabled={couple.giftInfoEnabled}
            giftInfoContent={couple.giftInfoContent}
            contactEnabled={couple.contactEnabled}
            contactPhone={couple.contactPhone}
            contactWhatsapp={couple.contactWhatsapp}
            wishesEnabled={couple.wishesEnabled}
            closingTitle={couple.closingTitle || (couple.postEventMessage ? (isRtl ? 'كلمة شكر وتقدير' : 'With Love & Gratitude') : null)}
            closingMessage={couple.closingMessage || couple.postEventMessage}
            brideName={brideName}
            groomName={groomName}
            theme={theme}
            preset={preset}
            isRtl={isRtl}
          />
        )

      default:
        return null
    }
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative min-h-screen selection:bg-[#C8A96B] selection:text-white"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        fontFamily: isRtl ? theme.fonts.arabic : theme.fonts.body,
      }}
    >
      {/* Subtle Floating Petals / Floral / Sparkles Background */}
      <FloatingPetalsBackground effectType={floralEffect} theme={theme} />

      {/* Cinematic Invitation Cover */}
      <AnimatePresence>
        {!isPreviewMode && invitation.coverEnabled && !coverOpened && (
          <InvitationCover
            brideName={brideName}
            groomName={groomName}
            weddingDate={weddingDate}
            monogram={showMonogram ? (couple.monogram || invitation.coverMonogram) : null}
            showMonogram={showMonogram}
            coverImage={invitation.coverImage}
            coverType={invitation.coverType}
            theme={theme}
            preset={preset}
            onOpen={handleOpenCover}
            isRtl={isRtl}
          />
        )}
      </AnimatePresence>

      {/* Floating Interactive Music Player */}
      {invitation.musicEnabled && (
        <MusicPlayer
          musicUrl={invitation.musicUrl}
          musicTitle={invitation.musicTitle}
          musicStart={musicTrimEnabled ? musicStart : null}
          musicEnd={musicTrimEnabled ? musicEnd : null}
          musicTrimEnabled={musicTrimEnabled}
          theme={theme}
          position={invitation.musicPosition}
          isRtl={isRtl}
          autoStartTrigger={musicTrigger}
        />
      )}

      {/* Floating Gentle Tour / Auto-Scroll Button */}
      {coverOpened && !isPreviewMode && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={() => {
            if (isAutoScrolling) {
              stopAutoScroll()
            } else {
              startAutoScroll()
            }
          }}
          className={`fixed bottom-6 ${
            invitation.musicPosition === 'bottom-left' ? 'left-24' : 'left-6'
          } z-30 flex items-center gap-2 p-2 px-3.5 rounded-full shadow-xl border backdrop-blur-md cursor-pointer transition-transform hover:scale-105 active:scale-95`}
          style={{
            backgroundColor: `${theme.colors.surface}EB`,
            borderColor: theme.colors.primary,
            color: theme.colors.text,
          }}
          title={isRtl ? 'جولة سينمائية تلقائية' : 'Cinematic Tour'}
        >
          {isAutoScrolling ? (
            <>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.colors.primary }} />
              <Pause className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span className="text-[11px] font-medium hidden sm:inline">
                {isRtl ? 'إيقاف الجولة' : 'Pause Tour'}
              </span>
            </>
          ) : (
            <>
              <Compass className="w-4 h-4 text-[#C8A96B]" />
              <span className="text-[11px] font-medium hidden sm:inline">
                {isRtl ? 'جولة هادئة' : 'Smooth Tour'}
              </span>
            </>
          )}
        </motion.button>
      )}

      {/* Main Content Sections */}
      <main className="relative z-10 w-full overflow-hidden">
        {orderedKeys.map((key) => renderSection(key))}
      </main>
    </div>
  )
}
