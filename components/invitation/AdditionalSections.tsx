'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shirt, Gift, MessageCircle, Phone, Heart, Share2 } from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { AnimationPreset, getFadeUpVariants } from '@/lib/animations'

interface AdditionalSectionsProps {
  dressCodeEnabled?: boolean
  dressCodeContent?: string | null
  giftInfoEnabled?: boolean
  giftInfoContent?: string | null
  contactEnabled?: boolean
  contactPhone?: string | null
  contactWhatsapp?: string | null
  wishesEnabled?: boolean
  closingTitle?: string | null
  closingMessage?: string | null
  brideName: string
  groomName: string
  theme: ThemeConfig
  preset?: AnimationPreset
  isRtl?: boolean
}

export function AdditionalSections({
  dressCodeEnabled,
  dressCodeContent,
  giftInfoEnabled,
  giftInfoContent,
  contactEnabled,
  contactPhone,
  contactWhatsapp,
  wishesEnabled,
  closingTitle,
  closingMessage,
  brideName,
  groomName,
  theme,
  preset = 'elegant',
  isRtl = true,
}: AdditionalSectionsProps) {
  const fadeVariants = getFadeUpVariants(preset)

  return (
    <div className="py-12 px-4 md:px-8 space-y-12" style={{ backgroundColor: theme.colors.background }}>
      {(dressCodeEnabled || giftInfoEnabled) && (
        <div
          className={`mx-auto grid gap-8 ${
            dressCodeEnabled && giftInfoEnabled
              ? 'max-w-4xl grid-cols-1 md:grid-cols-2'
              : 'max-w-lg grid-cols-1'
          }`}
        >
          {/* Dress Code Card */}
          {dressCodeEnabled && (
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 rounded-sm border text-center shadow-sm"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: `${theme.colors.primary}33`,
              }}
            >
              <Shirt className="w-8 h-8 mx-auto mb-3" style={{ color: theme.colors.primary }} />
              <h4 className="text-xl font-serif-luxury font-bold mb-2" style={{ color: theme.colors.text }}>
                {isRtl ? 'قواعد الزي (Dress Code)' : 'Dress Code'}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.colors.textLight }}>
                {dressCodeContent || (isRtl ? 'نرجو التكرم بالالتزام بالزي الرسمي الكامل' : 'Formal Attire Requested')}
              </p>
            </motion.div>
          )}

          {/* Gift Information Card */}
          {giftInfoEnabled && (
            <motion.div
              variants={fadeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="p-8 rounded-sm border text-center shadow-sm"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: `${theme.colors.primary}33`,
              }}
            >
              <Gift className="w-8 h-8 mx-auto mb-3" style={{ color: theme.colors.primary }} />
              <h4 className="text-xl font-serif-luxury font-bold mb-2" style={{ color: theme.colors.text }}>
                {isRtl ? 'معلومات الهدية' : 'Gift Registry & Wishes'}
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: theme.colors.textLight }}>
                {giftInfoContent || (isRtl ? 'حضوركم ومشاركتكم فرحتنا هي أجمل وأثمن هدية لنا.' : 'Your presence is our greatest gift.')}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Contact & Inquiries Card */}
      {contactEnabled && (contactPhone || contactWhatsapp) && (
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-md mx-auto p-6 rounded-sm border text-center shadow-sm"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: `${theme.colors.primary}33`,
          }}
        >
          <h4 className="text-lg font-serif-luxury font-bold mb-2" style={{ color: theme.colors.text }}>
            {isRtl ? 'للاستفسارات والتواصل' : 'Inquiries & Assistance'}
          </h4>
          <p className="text-xs mb-4" style={{ color: theme.colors.textLight }}>
            {isRtl ? 'يسعدنا الرد على استفساراتكم عبر الأرقام التالية:' : 'Feel free to contact us:'}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {contactWhatsapp && (
              <a
                href={`https://wa.me/${contactWhatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold text-white bg-[#25D366] hover:opacity-90 transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>
            )}
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold border hover:bg-black/5 transition-colors"
                style={{ borderColor: theme.colors.border, color: theme.colors.text }}
              >
                <Phone className="w-4 h-4" />
                <span>اتصال هاتف</span>
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Heartfelt Closing Message at the End of the Invitation */}
      {closingMessage && (
        <motion.div
          variants={fadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto p-8 rounded-lg border text-center shadow-sm relative overflow-hidden"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: `${theme.colors.primary}40`,
          }}
        >
          <div
            className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center border"
            style={{
              borderColor: theme.colors.primary,
              backgroundColor: `${theme.colors.primary}15`,
            }}
          >
            <Heart className="w-5 h-5 fill-current" style={{ color: theme.colors.primary }} />
          </div>
          {closingTitle && (
            <h4
              className="text-xl md:text-2xl font-serif-luxury font-bold mb-3"
              style={{ color: theme.colors.text }}
            >
              {closingTitle}
            </h4>
          )}
          <p
            className="text-sm md:text-base leading-relaxed whitespace-pre-line"
            style={{ color: theme.colors.textLight }}
          >
            {closingMessage}
          </p>
        </motion.div>
      )}

      {/* Keepsake Footer */}
      <footer className="pt-16 pb-12 text-center border-t" style={{ borderColor: theme.colors.border }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-4 h-4 fill-current" style={{ color: theme.colors.primary }} />
        </div>
        <h5 className="font-serif-luxury text-xl md:text-2xl font-bold mb-2" style={{ color: theme.colors.text }}>
          {isRtl ? `${groomName} & ${brideName}` : `${brideName} & ${groomName}`}
        </h5>
        <p className="text-xs tracking-widest uppercase opacity-60" style={{ color: theme.colors.textLight }}>
          {isRtl ? 'دعوة زفاف خاصة ومميزة' : 'A Celebration of Love'}
        </p>
      </footer>
    </div>
  )
}
