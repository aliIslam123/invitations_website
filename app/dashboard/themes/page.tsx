import React from 'react'
import Link from 'next/link'
import { getAllThemes } from '@/lib/themes'
import { Sparkles, Palette, Check, ArrowRight } from 'lucide-react'

export default function ThemesPage() {
  const themes = getAllThemes()

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="border-b border-[#EAE1D3] pb-4">
        <h2 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
          السمات والتصاميم المعتمدة (Wedding Themes)
        </h2>
        <p className="text-xs text-[#918579] mt-0.5">
          استكشف السمات البصرية الفاخرة الستة المصممة بعناية لتناسب مختلف أذواق حفلات الزفاف
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="rounded-sm border border-[#EAE1D3] bg-white overflow-hidden shadow-xs flex flex-col justify-between"
          >
            {/* Visual Palette Preview Header */}
            <div
              className="p-6 relative overflow-hidden"
              style={{ backgroundColor: theme.colors.background }}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-serif-luxury font-bold text-lg"
                  style={{ color: theme.colors.text }}
                >
                  {theme.nameAr}
                </span>
                <span
                  className="text-[10px] font-mono uppercase px-2 py-0.5 rounded border"
                  style={{
                    borderColor: theme.colors.primary,
                    color: theme.colors.primary,
                  }}
                >
                  {theme.heroLayout}
                </span>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-2 mb-4">
                {[
                  theme.colors.primary,
                  theme.colors.secondary,
                  theme.colors.accent,
                  theme.colors.gold,
                  theme.colors.background,
                ].map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border shadow-xs"
                    style={{ backgroundColor: color, borderColor: `${theme.colors.border}` }}
                    title={color}
                  />
                ))}
              </div>

              <p
                className="text-xs leading-relaxed opacity-90 line-clamp-2"
                style={{ color: theme.colors.textLight }}
              >
                {theme.description}
              </p>
            </div>

            {/* Theme Details and Metadata */}
            <div className="p-5 border-t border-[#EAE1D3] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#918579]">الخطوط المعتمدة:</span>
                <span className="font-semibold text-[#332A25] truncate max-w-[150px]">
                  {theme.fonts.arabic.split(',')[0]} / {theme.fonts.heading.split(',')[0]}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#918579]">نمط المعرض:</span>
                <span className="font-semibold text-[#332A25]">{theme.galleryLayout}</span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#918579]">نمط العداد:</span>
                <span className="font-semibold text-[#332A25]">{theme.countdownStyle}</span>
              </div>

              <div className="pt-3 border-t border-[#EAE1D3] flex items-center gap-2">
                <Link
                  href={`/dashboard/invitations/create`}
                  className="w-full py-2 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>إنشاء دعوة بهذا الطراز</span>
                  <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
