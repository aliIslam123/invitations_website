import React from 'react'
import Link from 'next/link'
import { ThemeConfig } from '@/lib/themes'
import { Eye, Sparkles, ArrowLeft, Heart, Calendar, MapPin } from 'lucide-react'

interface TemplateCardProps {
  template: ThemeConfig
  showUseButton?: boolean
}

export function TemplateCard({ template, showUseButton = true }: TemplateCardProps) {
  const { sampleData, colors } = template

  return (
    <div className="group relative rounded-lg border border-[#EAE1D3] bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C8A96B] transition-all duration-300 flex flex-col">
      {/* Visual Canvas Representation */}
      <div
        className="relative h-64 p-6 flex flex-col justify-between items-center text-center overflow-hidden border-b border-[#EAE1D3]"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        {/* Decorative corner / border embellishments */}
        <div
          className="absolute inset-2 border pointer-events-none opacity-40 transition-opacity group-hover:opacity-75"
          style={{ borderColor: colors.accent }}
        />

        {/* Top Badges */}
        <div className="relative z-10 w-full flex items-center justify-between">
          {template.badge ? (
            <span
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs"
              style={{
                backgroundColor: colors.primary,
                color: colors.background === '#FAF7F0' || colors.background === '#FAFAFA' || colors.background === '#FFFFFF' ? '#FFFFFF' : '#FFFFFF',
              }}
            >
              {template.badge}
            </span>
          ) : (
            <span />
          )}

          <span
            className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-black/5"
            style={{ color: colors.textLight }}
          >
            {template.category}
          </span>
        </div>

        {/* Center Mockup Info */}
        <div className="relative z-10 my-auto py-2">
          <div
            className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center border text-xs"
            style={{
              borderColor: colors.accent,
              color: colors.primary,
              backgroundColor: colors.surface,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </div>

          <h4
            className="text-lg md:text-xl font-bold tracking-tight mb-1"
            style={{ fontFamily: template.fonts.arabic }}
          >
            {sampleData.groomName} & {sampleData.brideName}
          </h4>

          <p
            className="text-xs line-clamp-1 opacity-80"
            style={{ color: colors.textLight }}
          >
            {sampleData.title}
          </p>
        </div>

        {/* Bottom Details */}
        <div className="relative z-10 w-full flex items-center justify-center gap-4 text-[11px]" style={{ color: colors.textLight }}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{sampleData.eventDate}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{sampleData.city}</span>
          </span>
        </div>

        {/* Palette Bar Preview */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 flex">
          <div className="flex-1" style={{ backgroundColor: colors.primary }} />
          <div className="flex-1" style={{ backgroundColor: colors.accent }} />
          <div className="flex-1" style={{ backgroundColor: colors.gold }} />
          <div className="flex-1" style={{ backgroundColor: colors.secondary }} />
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-5 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury font-bold text-base text-[#332A25] group-hover:text-[#C8A96B] transition-colors">
              {template.nameAr}
            </h3>
            <span className="text-[11px] text-[#918579] font-mono">
              {template.name}
            </span>
          </div>
          <p className="text-xs text-[#7A6B5F] line-clamp-2 leading-relaxed">
            {template.descriptionAr}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F0EBE3]">
          <Link
            href={`/templates/${template.id}`}
            className="py-2.5 px-3 rounded text-center text-xs font-medium text-[#332A25] bg-[#FAF7F0] hover:bg-[#F0EBE3] transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>معاينة كاملة</span>
          </Link>

          {showUseButton && (
            <Link
              href={`/dashboard/invitations/new?theme=${template.id}`}
              className="py-2.5 px-3 rounded text-center text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>اختر التصميم</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
