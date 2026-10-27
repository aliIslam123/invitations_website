import React from 'react'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { getAllThemes } from '@/lib/themes'
import { TemplatesFilterView } from '@/components/marketing/TemplatesFilterView'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'مكتبة تصاميم وقوالب دعوات الزفاف | فرحة العمر',
  description: 'استكشف 16 قالباً وتصميماً ملكياً فريداً لدعوات الزفاف الرقمية، اختر التصميم الأنسب لليلتكم وخصصه بكل سهولة.',
}

export default async function TemplatesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const allTemplates = getAllThemes()

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      <MarketingHeader />

      <main className="flex-1 py-12 md:py-16 px-4 sm:px-8 md:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C8A96B]/50 bg-white text-xs font-semibold text-[#A68648]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>16 قالباً ملكياً حصرياً</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#332A25]">
              مكتبة تصاميم دعوات الزفاف
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
              اختر التصميم الذي يعبر عن ذوقكم، من الفخامة الكلاسيكية إلى البساطة العصرية والتراث العربي الأصيل. يمكنك معاينة أي تصميم والبدء في تخصيصه فوراً.
            </p>
          </div>

          {/* Interactive Filter and Templates Grid */}
          <TemplatesFilterView
            initialTemplates={allTemplates}
            initialCategory={category || 'all'}
          />
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
