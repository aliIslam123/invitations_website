'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, Heart, Download } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'

interface WeddingCalendarCardProps {
  weddingDate: Date | string | null | undefined
  theme: ThemeConfig
  isRtl?: boolean
  className?: string
}

export function WeddingCalendarCard({
  weddingDate,
  theme,
  isRtl = true,
  className = '',
}: WeddingCalendarCardProps) {
  const dateObj = useMemo(() => {
    if (!weddingDate) return null
    const d = typeof weddingDate === 'string' ? new Date(weddingDate) : weddingDate
    return isNaN(d.getTime()) ? null : d
  }, [weddingDate])

  if (!dateObj) return null

  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() // 0-11
  const weddingDay = dateObj.getDate()

  // Arabic Month Names
  const arabicMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ]

  const englishMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const monthTitle = isRtl
    ? `${arabicMonths[month]} ${year}`
    : `${englishMonths[month]} ${year}`

  // Days of week in RTL starting Monday (إث) to Sunday (أح), exactly as in sample image
  const weekdaysAr = ['إث', 'ثل', 'أر', 'خم', 'جم', 'سب', 'أح']
  const weekdaysEn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekdays = isRtl ? weekdaysAr : weekdaysEn

  // Calculation of calendar days
  const { totalDays, leadingEmptySlots } = useMemo(() => {
    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Day of week of the 1st day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const firstDay = new Date(year, month, 1).getDay()

    // Convert so Monday is index 0:
    // Mon(1) -> 0, Tue(2) -> 1, ..., Sat(6) -> 5, Sun(0) -> 6
    const mondayBasedFirstDay = firstDay === 0 ? 6 : firstDay - 1

    return {
      totalDays: daysInMonth,
      leadingEmptySlots: mondayBasedFirstDay,
    }
  }, [year, month])

  // Google Calendar Link generator
  const googleCalendarUrl = useMemo(() => {
    const startIso = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z'
    // End time + 4 hours
    const endDate = new Date(dateObj.getTime() + 4 * 60 * 60 * 1000)
    const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '').slice(0, 15) + 'Z'
    const title = encodeURIComponent(isRtl ? 'حفل الزفاف المبارك' : 'Wedding Celebration')
    const details = encodeURIComponent(isRtl ? 'يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا' : 'We are delighted to celebrate with you')
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}`
  }, [dateObj, isRtl])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`relative max-w-[320px] sm:max-w-[340px] mx-auto bg-white rounded-2xl border shadow-md p-5 text-center font-sans ${className}`}
      style={{
        borderColor: `${theme.colors.primary}33`,
        boxShadow: `0 10px 30px -10px ${theme.colors.primary}18`,
      }}
    >
      {/* Month & Year Header */}
      <h4
        className="text-base sm:text-lg font-serif-luxury font-bold tracking-wide mb-3"
        style={{ color: theme.colors.text }}
      >
        {monthTitle}
      </h4>

      {/* Weekdays Row with clean top/bottom borders matching user's image */}
      <div
        className="grid grid-cols-7 border-t border-b py-2 mb-2"
        style={{ borderColor: `${theme.colors.primary}25` }}
      >
        {weekdays.map((dayName, idx) => (
          <span
            key={idx}
            className="text-[11px] sm:text-xs font-semibold text-[#918579] text-center"
          >
            {dayName}
          </span>
        ))}
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-y-2 text-center items-center">
        {/* Leading empty slots before day 1 */}
        {Array.from({ length: leadingEmptySlots }).map((_, idx) => (
          <div key={`empty-${idx}`} className="h-8" />
        ))}

        {/* Days of the month */}
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isWeddingDay = day === weddingDay

          return (
            <div
              key={day}
              className="flex items-center justify-center h-8 relative"
            >
              {isWeddingDay ? (
                /* Heart badge matching user's uploaded screenshot */
                <div className="relative inline-flex items-center justify-center w-8 h-8 group cursor-default">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 fill-current transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
                    style={{ color: theme.colors.primary }}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white pt-0.5">
                    {day}
                  </span>
                </div>
              ) : (
                <span className="text-xs sm:text-[13px] font-medium text-[#332A25] select-none hover:text-[#C8A96B] transition-colors">
                  {day}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Add to Calendar Button */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center">
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all hover:opacity-90 cursor-pointer shadow-xs"
          style={{
            backgroundColor: `${theme.colors.primary}15`,
            color: theme.colors.primary,
            border: `1px solid ${theme.colors.primary}33`,
          }}
          title={isRtl ? 'حفظ الموعد في تقويم جوجل' : 'Save date to calendar'}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>{isRtl ? 'إضافة للتقويم' : 'Add to Calendar'}</span>
        </a>
      </div>
    </motion.div>
  )
}
