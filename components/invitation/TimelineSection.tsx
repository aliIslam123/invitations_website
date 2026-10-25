'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Coffee, Heart, Sparkles, Utensils, Music, Cake, Clock } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants } from '@/lib/animations'

export interface TimelineItemData {
  id: string
  time?: string | null
  title: string
  description?: string | null
  icon?: string | null
  displayOrder: number
  isVisible: boolean
}

interface TimelineSectionProps {
  items: TimelineItemData[]
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
}

export function TimelineSection({
  items,
  theme,
  preset = 'elegant',
  isRtl = true,
}: TimelineSectionProps) {
  const fadeVariants = getFadeUpVariants(preset)

  const visibleItems = items
    .filter((item) => item.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  if (visibleItems.length === 0) {
    return null
  }

  const getIcon = (iconName?: string | null) => {
    switch (iconName) {
      case 'coffee':
        return <Coffee className="w-4 h-4" />
      case 'heart':
        return <Heart className="w-4 h-4 fill-current" />
      case 'sparkles':
        return <Sparkles className="w-4 h-4" />
      case 'utensils':
        return <Utensils className="w-4 h-4" />
      case 'cake':
        return <Cake className="w-4 h-4" />
      case 'music':
        return <Music className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <section className="py-20 px-4 md:px-8 border-y" style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-widest font-semibold mb-2" style={{ color: theme.colors.primary }}>
            {isRtl ? 'برنامج الحفل' : 'Schedule of the Day'}
          </p>
          <h2 className="text-3xl font-serif-luxury font-bold" style={{ color: theme.colors.text }}>
            {isRtl ? 'مسار الليلة المباركة' : 'Wedding Timeline'}
          </h2>
          <div className="w-14 h-[1px] mx-auto mt-3" style={{ backgroundColor: theme.colors.primary }} />
        </motion.div>

        {/* Timeline Line & Items */}
        <div className="relative">
          {/* Vertical central stem */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${theme.colors.primary}, transparent)`,
            }}
          />

          <div className="space-y-12">
            {visibleItems.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <motion.div
                  key={item.id || index}
                  variants={fadeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                  className={`relative flex items-center ${
                    isEven ? 'flex-row' : 'flex-row-reverse'
                  } gap-6 md:gap-12`}
                >
                  {/* Content Box */}
                  <div className={`flex-1 ${isEven ? 'text-right' : 'text-left'}`}>
                    {item.time && (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1"
                        style={{
                          backgroundColor: `${theme.colors.primary}15`,
                          color: theme.colors.primary,
                        }}
                      >
                        {item.time}
                      </span>
                    )}
                    <h4 className="text-lg md:text-xl font-serif-luxury font-bold" style={{ color: theme.colors.text }}>
                      {item.title}
                    </h4>
                    {item.description && (
                      <p className="text-xs md:text-sm mt-1 leading-relaxed" style={{ color: theme.colors.textLight }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Center Node Icon */}
                  <div
                    className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 shadow-sm transition-transform hover:scale-110"
                    style={{
                      backgroundColor: theme.colors.background,
                      borderColor: theme.colors.primary,
                      color: theme.colors.primary,
                    }}
                  >
                    {getIcon(item.icon)}
                  </div>

                  {/* Empty Spacer to balance layout */}
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
