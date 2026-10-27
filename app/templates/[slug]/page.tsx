import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTheme, getAllThemes } from '@/lib/themes'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Palette,
  Smartphone,
  Calendar,
  MapPin,
  Clock,
  Heart,
  Music,
} from 'lucide-react'

export async function generateStaticParams() {
  const themes = getAllThemes()
  return themes.map((t) => ({ slug: t.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const theme = getTheme(slug)
  if (!theme) return { title: 'تصميم غير موجود' }
  return {
    title: `قالب ${theme.nameAr} (${theme.name}) | فرحة العمر`,
    description: theme.descriptionAr,
  }
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const theme = getTheme(slug)

  if (!theme || theme.id !== slug) {
    // If not found in known themes, show not found
    const all = getAllThemes()
    if (!all.some((t) => t.id === slug)) {
      notFound()
    }
  }

  const { sampleData, colors, fonts } = theme

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      <MarketingHeader />

      <main className="flex-1 py-10 px-4 sm:px-8 md:px-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7A6B5F] hover:text-[#C8A96B] transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة لمكتبة التصاميم</span>
            </Link>

            <span className="text-[11px] font-mono uppercase tracking-widest text-[#918579] bg-white px-3 py-1 rounded-full border border-[#EAE1D3]">
              قالب: {theme.id}
            </span>
          </div>

          {/* Template Info Card */}
          <div className="bg-white p-6 md:p-8 rounded-lg border border-[#EAE1D3] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[#FAF7F0] text-[#A68648] border border-[#C8A96B]/30">
                  {theme.category}
                </span>
                {theme.badge && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#C8A96B] text-white">
                    {theme.badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-serif-luxury font-bold text-[#332A25]">
                {theme.nameAr}
                <span className="block md:inline md:mr-3 text-base font-normal text-[#918579] font-mono">
                  {theme.name}
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
                {theme.descriptionAr}
              </p>

              {/* Color Palette Indicators */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-[11px] text-[#918579]">لوحة الألوان:</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    title={`Primary: ${colors.primary}`}
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    title={`Accent: ${colors.accent}`}
                    style={{ backgroundColor: colors.accent }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    title={`Gold: ${colors.gold}`}
                    style={{ backgroundColor: colors.gold }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                    title={`Background: ${colors.background}`}
                    style={{ backgroundColor: colors.background }}
                  />
                </div>
              </div>
            </div>

            {/* Main CTA */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3">
              <Link
                href={`/dashboard/invitations/new?theme=${theme.id}`}
                className="w-full md:w-56 py-3.5 px-6 rounded-sm text-center text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>استخدم هذا التصميم الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Interactive Live Mockup Preview Window */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury font-bold text-base text-[#332A25]">
                معاينة حية للدعوة بهذا القالب
              </h3>
              <span className="text-xs text-[#918579] flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>محاكاة شاشة الجوال للضيوف</span>
              </span>
            </div>

            {/* Mobile Device Frame Container */}
            <div className="flex justify-center p-4 sm:p-8 bg-[#EAE1D3]/40 rounded-xl border border-[#EAE1D3]">
              <div
                className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-4 border-[#332A25]/20 flex flex-col"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  minHeight: '650px',
                }}
              >
                {/* Mobile Top Status Notch */}
                <div className="h-6 bg-black/10 flex items-center justify-between px-6 text-[10px] opacity-70">
                  <span>9:41</span>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-[#C8A96B]" />
                    <span>فرحة العمر</span>
                  </div>
                </div>

                {/* Live Preview Card Content */}
                <div className="p-8 flex-1 flex flex-col justify-between text-center relative">
                  {/* Decorative Frame */}
                  <div
                    className="absolute inset-4 border pointer-events-none opacity-40"
                    style={{ borderColor: colors.accent }}
                  />

                  {/* Monogram / Top badge */}
                  <div className="relative z-10 pt-4">
                    <div
                      className="w-14 h-14 mx-auto rounded-full flex items-center justify-center border text-base font-bold shadow-xs mb-3"
                      style={{
                        borderColor: colors.accent,
                        backgroundColor: colors.surface,
                        color: colors.primary,
                      }}
                    >
                      {sampleData.groomName.charAt(0)} & {sampleData.brideName.charAt(0)}
                    </div>

                    <p
                      className="text-xs uppercase tracking-widest font-semibold"
                      style={{ color: colors.gold }}
                    >
                      بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ
                    </p>
                  </div>

                  {/* Couple Names & Title */}
                  <div className="relative z-10 py-6 space-y-3">
                    <p className="text-xs" style={{ color: colors.textLight }}>
                      يسرنا ويسعدنا دعوتكم لحضور
                    </p>

                    <h2
                      className="text-3xl font-bold tracking-tight"
                      style={{ fontFamily: fonts.arabic }}
                    >
                      {sampleData.groomName}
                      <span className="block text-xl my-1" style={{ color: colors.primary }}>
                        &
                      </span>
                      {sampleData.brideName}
                    </h2>

                    <p
                      className="text-xs max-w-xs mx-auto leading-relaxed"
                      style={{ color: colors.textLight }}
                    >
                      {sampleData.title}
                    </p>
                  </div>

                  {/* Date & Location Preview */}
                  <div className="relative z-10 space-y-4">
                    <div
                      className="p-4 rounded-lg border backdrop-blur-xs space-y-2"
                      style={{
                        backgroundColor: `${colors.surface}CC`,
                        borderColor: colors.border,
                      }}
                    >
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                        <Calendar className="w-4 h-4" style={{ color: colors.primary }} />
                        <span>{sampleData.eventDate}</span>
                      </div>
                      <div
                        className="flex items-center justify-center gap-2 text-xs"
                        style={{ color: colors.textLight }}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{sampleData.venueName} - {sampleData.city}</span>
                      </div>
                    </div>

                    {/* Preview RSVP Button */}
                    <div
                      className="py-3 px-6 rounded-md text-xs font-semibold shadow-xs"
                      style={{
                        backgroundColor: colors.primary,
                        color: '#FFFFFF',
                      }}
                    >
                      تأكيد الحضور (RSVP)
                    </div>
                  </div>

                  {/* Bottom Music Note */}
                  <div
                    className="relative z-10 pt-4 flex items-center justify-center gap-1.5 text-[10px]"
                    style={{ color: colors.textLight }}
                  >
                    <Music className="w-3 h-3" style={{ color: colors.gold }} />
                    <span>تأثيرات موسيقية سينمائية هادئة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
