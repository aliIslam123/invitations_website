'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getTimeRemaining, TimeRemaining } from '@/lib/utils'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants } from '@/lib/animations'
import { Sparkles } from 'lucide-react'
import { WeddingCalendarCard } from './WeddingCalendarCard'

interface CountdownSectionProps {
  weddingDate?: Date | string | null
  timezone?: string
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
  postEventMessage?: string | null
  calendarEnabled?: boolean
}

export function CountdownSection({
  weddingDate,
  timezone,
  theme,
  preset = 'elegant',
  isRtl = true,
  postEventMessage,
  calendarEnabled = true,
}: CountdownSectionProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null)
  const fadeVariants = getFadeUpVariants(preset)

  useEffect(() => {
    if (!weddingDate) return

    // Initial calculation
    setTimeRemaining(getTimeRemaining(weddingDate))

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(weddingDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [weddingDate])

  if (!weddingDate || !timeRemaining) {
    return null
  }

  // When wedding date has already occurred
  if (timeRemaining.isPast) {
    return (
      <section
        className="py-16 px-4 text-center border-y"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }}
      >
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-4" style={{ color: theme.colors.primary }} />
          <h3
            className="text-2xl md:text-3xl font-serif-luxury font-bold mb-3"
            style={{ color: theme.colors.text }}
          >
            {isRtl ? 'تم بحمد الله وتوفيقه' : 'The Celebration Has Concluded'}
          </h3>
          <p className="text-sm md:text-base opacity-80" style={{ color: theme.colors.textLight }}>
            {postEventMessage ||
              (isRtl
                ? 'شكراً لكل من شرفنا بمحبته ودعواته، غمرتم قلوبنا بالفرح والامتنان.'
                : 'Thank you to everyone who joined and sent their warmest wishes.')}
          </p>

          {calendarEnabled !== false && weddingDate && (
            <div className="mt-8">
              <WeddingCalendarCard
                weddingDate={weddingDate}
                theme={theme}
                isRtl={isRtl}
              />
            </div>
          )}
        </motion.div>
      </section>
    )
  }

  const units = [
    { label: isRtl ? 'أيام' : 'Days', value: timeRemaining.days },
    { label: isRtl ? 'ساعات' : 'Hours', value: timeRemaining.hours },
    { label: isRtl ? 'دقائق' : 'Minutes', value: timeRemaining.minutes },
    { label: isRtl ? 'ثواني' : 'Seconds', value: timeRemaining.seconds },
  ]

  return (
    <section
      className="py-16 px-4 text-center border-y"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }}
    >
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="max-w-2xl mx-auto"
      >
        <p
          className="text-xs uppercase tracking-widest font-semibold mb-3"
          style={{ color: theme.colors.primary }}
        >
          {isRtl ? 'العد التنازلي لليلة العمر' : 'Counting Down To Forever'}
        </p>

        <h3
          className="text-xl md:text-2xl font-serif-luxury font-bold mb-8"
          style={{ color: theme.colors.text }}
        >
          {isRtl ? 'نلتقي بعد' : 'Until We Say I Do'}
        </h3>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
          {units.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-3 sm:p-5 rounded-sm border shadow-sm flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: `${theme.colors.primary}44`,
              }}
            >
              <span
                className="text-2xl sm:text-4xl font-serif-luxury font-bold tracking-tight mb-1"
                style={{ color: theme.colors.primary }}
              >
                {String(unit.value).padStart(2, '0')}
              </span>
              <span
                className="text-[10px] sm:text-xs uppercase tracking-wider font-medium"
                style={{ color: theme.colors.textLight }}
              >
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Wedding Month Calendar Card (شكل التقويم ليوم الزفاف تحت خانة الميعاد) */}
        {calendarEnabled !== false && weddingDate && (
          <div className="mt-10">
            <WeddingCalendarCard
              weddingDate={weddingDate}
              theme={theme}
              isRtl={isRtl}
            />
          </div>
        )}
      </motion.div>
    </section>
  )
}
