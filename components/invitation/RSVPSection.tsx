'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Heart, Sparkles, Send } from 'lucide-react'
import confetti from 'canvas-confetti'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants } from '@/lib/animations'

interface RSVPSectionProps {
  invitationId: string
  rsvpDeadline?: Date | string | null
  rsvpMaxGuests?: number | null
  rsvpAllowPlusOne?: boolean
  rsvpRequireContact?: boolean
  rsvpConfirmMsg?: string | null
  rsvpDeclineMsg?: string | null
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
}

export function RSVPSection({
  invitationId,
  rsvpConfirmMsg,
  theme,
  preset = 'elegant',
  isRtl = true,
}: RSVPSectionProps) {
  const [guestName, setGuestName] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const fadeVariants = getFadeUpVariants(preset)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName.trim()) {
      setErrorMessage(isRtl ? 'يرجى كتابة الاسم الكريم' : 'Please enter your name')
      return
    }

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitationId,
          guestName: guestName.trim(),
          message: message.trim() || undefined,
          attendance: 'yes',
          guestCount: 1,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء إرسال التأكيد')
      }

      setIsSubmitted(true)

      // Festive celebratory confetti
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: [theme.colors.primary, '#C8A96B', '#DFCA9B', '#FFFFFF', '#332A25'],
      })
    } catch (err: any) {
      setErrorMessage(err.message || (isRtl ? 'تعذر إرسال البيانات، يرجى المحاولة لاحقاً.' : 'Failed to submit response.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="rsvp"
      className="py-20 px-4 md:px-8 border-y relative overflow-hidden"
      style={{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border }}
    >
      <div className="max-w-xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest mb-3 border shadow-xs"
            style={{
              backgroundColor: `${theme.colors.primary}12`,
              borderColor: `${theme.colors.primary}33`,
              color: theme.colors.primary,
            }}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>{isRtl ? 'تأكيد الحضور' : 'RSVP'}</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif-luxury font-bold" style={{ color: theme.colors.text }}>
            {isRtl ? 'يسعدنا ويشرفنا حضوركم' : 'We Look Forward to Seeing You'}
          </h2>

          <p className="text-xs md:text-sm mt-3 opacity-80 max-w-md mx-auto leading-relaxed" style={{ color: theme.colors.textLight }}>
            {isRtl
              ? 'شاركونا فرحتنا الكبرى بتأكيد حضوركم وترك كلمة طيبة للعروسين'
              : 'Kindly confirm your presence and share your warm wishes with the couple'}
          </p>

          <div className="w-14 h-[1.5px] mx-auto mt-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
        </motion.div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            /* Success Confirmation Card */
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center p-8 md:p-12 rounded-2xl border shadow-lg relative overflow-hidden"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.primary,
              }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border shadow-xs"
                style={{
                  backgroundColor: `${theme.colors.primary}15`,
                  borderColor: theme.colors.primary,
                  color: theme.colors.primary,
                }}
              >
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h3 className="text-2xl font-serif-luxury font-bold mb-2" style={{ color: theme.colors.text }}>
                {isRtl ? `أهلاً وسهلاً بك، ${guestName}!` : `Thank You, ${guestName}!`}
              </h3>

              <p className="text-sm md:text-base leading-relaxed opacity-90 max-w-md mx-auto mb-6" style={{ color: theme.colors.textLight }}>
                {rsvpConfirmMsg ||
                  (isRtl
                    ? 'تم تأكيد حضوركم بكل سرور، ننتظركم بشوق ومحبة لنحتفل معاً بهذه المناسبة السعيدة!'
                    : 'Your attendance has been confirmed. We look forward to celebrating together!')}
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false)
                  setGuestName('')
                  setMessage('')
                }}
                className="text-xs underline cursor-pointer transition-opacity hover:opacity-80 font-medium"
                style={{ color: theme.colors.primary }}
              >
                {isRtl ? 'تسجيل رد آخر' : 'Submit another response'}
              </button>
            </motion.div>
          ) : (
            /* Simplified RSVP Form: Name (Required) + Congratulations (Optional) */
            <motion.form
              key="form"
              variants={fadeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="p-6 md:p-9 rounded-2xl border shadow-md space-y-5"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: `${theme.colors.primary}33`,
              }}
            >
              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 text-center font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Guest Name (ONLY REQUIRED FIELD) */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 flex items-center justify-between" style={{ color: theme.colors.text }}>
                  <span>{isRtl ? 'الاسم الكريم *' : 'Your Full Name *'}</span>
                  <span className="text-[10px] text-red-500 font-semibold">{isRtl ? '(مطلوب)' : '(Required)'}</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={isRtl ? 'اكتب اسمك الكريم هنا...' : 'e.g. John Doe'}
                  className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none transition-all shadow-xs"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  }}
                />
              </div>

              {/* Congratulations Message (OPTIONAL) */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-bold mb-2 flex items-center justify-between" style={{ color: theme.colors.text }}>
                  <span>{isRtl ? 'تهنئة أو كلمة للعروسين' : 'Warm Wishes / Congratulations'}</span>
                  <span className="text-[10px] opacity-60 font-medium" style={{ color: theme.colors.textLight }}>
                    {isRtl ? '(اختياري)' : '(Optional)'}
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isRtl
                      ? 'بارك الله لكما وبارك عليكما وجمع بينكما في خير...'
                      : 'Send your love, blessings, and congratulations...'
                  }
                  className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all shadow-xs resize-none"
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  }}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer hover:opacity-95 hover:shadow-lg disabled:opacity-50"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#FFFFFF',
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isRtl ? 'جاري تأكيد الحضور...' : 'Confirming...'}</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{isRtl ? 'تأكيد الحضور ومشاركة الفرحة' : 'Confirm Attendance'}</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
