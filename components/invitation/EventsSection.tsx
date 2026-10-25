'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Navigation, ExternalLink, Sparkles, Shirt } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants } from '@/lib/animations'
import { buildMapsUrl } from '@/lib/utils'

export interface EventItem {
  id: string
  title: string
  date: Date | string
  startTime?: string | null
  endTime?: string | null
  venueName?: string | null
  address?: string | null
  mapsUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  venueImage?: string | null
  description?: string | null
  dressCode?: string | null
  notes?: string | null
  isVisible: boolean
  showLocationCard?: boolean
  showDressCode?: boolean
}

interface EventsSectionProps {
  events: EventItem[]
  sectionTitle?: string | null
  sectionSubtitle?: string | null
  showLocationCard?: boolean
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
}

export function EventsSection({
  events,
  sectionTitle,
  sectionSubtitle,
  showLocationCard = true,
  theme,
  preset = 'elegant',
  isRtl = true,
}: EventsSectionProps) {
  const [activeMapId, setActiveMapId] = useState<string | null>(null)
  const fadeVariants = getFadeUpVariants(preset)

  const visibleEvents = (events || []).filter((e) => e && e.isVisible !== false)

  if (visibleEvents.length === 0) {
    return null
  }

  const defaultSubtitle = isRtl ? 'الموعد والمكان' : 'Schedule & Locations'
  const defaultTitle = isRtl ? 'تفاصيل الحفل والموقع' : 'Wedding Events'

  return (
    <section
      id="wedding-events"
      className="py-20 px-4 md:px-8"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-3"
            style={{ color: theme.colors.primary }}
          >
            {sectionSubtitle || defaultSubtitle}
          </p>
          <h2
            className="text-3xl md:text-4xl font-serif-luxury font-bold"
            style={{ color: theme.colors.text }}
          >
            {sectionTitle || defaultTitle}
          </h2>
          <div
            className="w-16 h-[1px] mx-auto mt-4"
            style={{ backgroundColor: theme.colors.primary }}
          />
        </motion.div>

        {/* Events List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleEvents.map((event, index) => {
            const formattedDate =
              event.date && !isNaN(new Date(event.date).getTime())
                ? new Date(event.date).toLocaleDateString(
                    isRtl ? 'ar-SA' : 'en-US',
                    {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )
                : ''

            const destinationUrl = buildMapsUrl({
              mapsUrl: event.mapsUrl,
              latitude: event.latitude,
              longitude: event.longitude,
              venueName: event.venueName,
              address: event.address,
            })

            const isMapOpen = activeMapId === event.id

            return (
              <motion.div
                key={event.id || index}
                variants={fadeVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                className="rounded-sm border overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: `${theme.colors.primary}33`,
                }}
              >
                {/* Venue Photo (if available) */}
                {event.venueImage && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={event.venueImage}
                      alt={event.venueName || event.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute bottom-3 left-4 right-4 text-white text-xs font-medium tracking-wide">
                      {event.venueName}
                    </span>
                  </div>
                )}

                <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Event Title */}
                    <h3
                      className="text-xl md:text-2xl font-serif-luxury font-bold mb-4"
                      style={{ color: theme.colors.text }}
                    >
                      {event.title}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-2.5 mb-2.5 text-sm font-medium" style={{ color: theme.colors.text }}>
                      <Calendar className="w-4 h-4 shrink-0" style={{ color: theme.colors.primary }} />
                      <span>{formattedDate}</span>
                    </div>

                    {/* Time */}
                    {(event.startTime || event.endTime) && (
                      <div className="flex items-center gap-2.5 mb-4 text-sm" style={{ color: theme.colors.textLight }}>
                        <Clock className="w-4 h-4 shrink-0" style={{ color: theme.colors.primary }} />
                        <span>
                          {event.startTime}
                          {event.endTime ? ` - ${event.endTime}` : ''}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {event.description && (
                      <p className="text-xs md:text-sm leading-relaxed mb-4" style={{ color: theme.colors.textLight }}>
                        {event.description}
                      </p>
                    )}

                    {/* Dress Code Tag */}
                    {event.dressCode && event.showDressCode !== false && !event.notes?.includes('hideDressCode') && (
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mb-4"
                        style={{
                          backgroundColor: `${theme.colors.primary}15`,
                          color: theme.colors.primary,
                        }}
                      >
                        <Shirt className="w-3.5 h-3.5" />
                        <span>{event.dressCode}</span>
                      </div>
                    )}

                    {/* Location Card: Venue, Address & Google Maps Navigation */}
                    {showLocationCard !== false &&
                      event.showLocationCard !== false &&
                      !event.notes?.includes('hideLocation') &&
                      (event.venueName || event.address || destinationUrl) && (
                      <div
                        className="my-4 p-4 rounded border space-y-3 shadow-xs"
                        style={{
                          backgroundColor: `${theme.colors.primary}0a`,
                          borderColor: `${theme.colors.primary}30`,
                        }}
                      >
                        {/* Venue & Address (اللوكيشن مكتوب) */}
                        {(event.venueName || event.address) && (
                          <div className="flex items-start gap-2.5 text-sm" style={{ color: theme.colors.text }}>
                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: theme.colors.primary }} />
                            <div className="flex-1">
                              {event.venueName && <p className="font-bold text-base">{event.venueName}</p>}
                              {event.address && (
                                <p className="text-xs opacity-90 mt-1 whitespace-pre-line leading-relaxed" style={{ color: theme.colors.textLight }}>
                                  {event.address}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Location Link & Map Actions (اللوكيشن كـ لينك) */}
                        {destinationUrl && (
                          <div className="pt-3 border-t flex flex-wrap items-center gap-2" style={{ borderColor: `${theme.colors.primary}20` }}>
                            {/* Outbound Google Maps Navigation */}
                            <a
                              href={destinationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xs hover:opacity-90 cursor-pointer"
                              style={{
                                backgroundColor: theme.colors.primary,
                                color: '#FFFFFF',
                              }}
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              <span>{isRtl ? 'فتح اللوكيشن في خرائط جوجل' : 'Open in Google Maps'}</span>
                              <ExternalLink className="w-3 h-3 opacity-80" />
                            </a>

                            {/* Embedded Map Toggle */}
                            <button
                              type="button"
                              onClick={() => setActiveMapId(isMapOpen ? null : event.id)}
                              className="px-3 py-2 rounded-sm border text-xs font-medium transition-colors hover:bg-black/5 cursor-pointer"
                              style={{
                                borderColor: theme.colors.border,
                                color: theme.colors.text,
                              }}
                            >
                              {isMapOpen ? (isRtl ? 'إخفاء الخريطة' : 'Hide Map') : (isRtl ? 'معاينة الخريطة' : 'Preview Map')}
                            </button>
                          </div>
                        )}

                        {/* Embedded Map Container */}
                        {isMapOpen && (
                          <div className="h-60 w-full rounded overflow-hidden border mt-2" style={{ borderColor: theme.colors.border }}>
                            <iframe
                              title={`خريطة ${event.venueName || event.title}`}
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              scrolling="no"
                              marginHeight={0}
                              marginWidth={0}
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                [event.venueName, event.address].filter(Boolean).join(' ') || 'Cairo'
                              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
