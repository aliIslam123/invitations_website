import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowLeft,
  Heart,
  Palette,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  QrCode,
  Music,
  Users,
  Calendar,
  MapPin,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { getAllThemes } from '@/lib/themes'
import { TemplateCard } from '@/components/marketing/TemplateCard'

export default async function HomePage() {
  const allTemplates = getAllThemes()
  const featuredTemplates = allTemplates.slice(0, 8)

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-4 sm:px-8 md:px-12 text-center overflow-hidden border-b border-[#EAE1D3]">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 50% 15%, #EAE1D3 0%, transparent 65%)',
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C8A96B]/50 bg-white/90 text-xs font-semibold text-[#A68648] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>المنصة الرائدة لبطاقات ودعوات الزفاف الرقمية الملكية</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif-luxury font-bold text-[#332A25] leading-[1.15] tracking-tight">
              دعوتكم تبدأ بحكاية
              <span className="block text-2xl sm:text-4xl md:text-5xl font-normal mt-3 text-[#C8A96B]">
                تليق بأجمل ليالي العمر
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#7A6B5F] leading-relaxed">
              اصنع دعوة زفافك بطريقتك، اختار التصميم اللي يشبهكم، وخصص كل تفصيلة: الموسيقى، مسار الحفل، واللوكيشن وشاركها بكل سهولة وأناقة مع أحبابكم عبر واتساب.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/templates"
                className="px-8 py-4 rounded-sm text-sm font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 group"
              >
                <span>ابدأ تصميم دعوتك الآن</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/wedding/mohamed-and-asmaa"
                target="_blank"
                className="px-6 py-4 rounded-sm text-sm font-semibold border border-[#C8A96B] text-[#332A25] bg-white/80 hover:bg-white transition-all shadow-xs flex items-center gap-2"
              >
                <span>مشاهدة نموذج دعوة حية</span>
                <ExternalLink className="w-4 h-4 text-[#C8A96B]" />
              </Link>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#918579]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96B]" />
                <span>16 تصميماً ملكياً فريداً</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96B]" />
                <span>رابط خاص ومشاركة واتساب فورية</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96B]" />
                <span>تأكيد حضور RSVP ذكي</span>
              </span>
            </div>
          </div>
        </section>

        {/* Featured Templates Showcase */}
        <section className="py-20 px-4 sm:px-8 md:px-12 bg-white border-b border-[#EAE1D3]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest font-semibold text-[#C8A96B]">
                  تصاميم استثنائية
                </p>
                <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#332A25]">
                  اختر التصميم الذي يمثّل أناقتكم
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B5F]">
                  مكتبة متكاملة من 16 تصميماً تتنوع بين الفخامة الملكية، الخط العربي الأصيل، والنعومة العصرية.
                </p>
              </div>

              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8A96B] hover:text-[#A68648] group whitespace-nowrap self-start md:self-end"
              >
                <span>تصفح كل التصاميم الـ 16</span>
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Template Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTemplates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>

            <div className="text-center pt-4">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm text-xs font-semibold text-[#332A25] bg-[#FAF7F0] border border-[#EAE1D3] hover:border-[#C8A96B] transition-all shadow-xs"
              >
                <span>مشاهدة باقي التصاميم والخيارات</span>
                <ArrowLeft className="w-4 h-4 text-[#C8A96B]" />
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Steps: How It Works */}
        <section className="py-20 px-4 sm:px-8 md:px-12 bg-[#FAF7F0] border-b border-[#EAE1D3]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#C8A96B]">
                بساطة مطلقة
              </p>
              <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#332A25]">
                كيف تصنع دعوتك في 3 خطوات سهلة؟
              </h2>
              <div className="w-12 h-[1px] bg-[#C8A96B] mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="p-8 rounded-lg border border-[#EAE1D3] bg-white text-center space-y-4 shadow-xs relative">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF7F0] border border-[#C8A96B] flex items-center justify-center font-serif-luxury font-bold text-lg text-[#C8A96B]">
                  1
                </div>
                <h3 className="text-lg font-serif-luxury font-bold text-[#332A25]">
                  اختر التصميم المناسب
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  تصفح 16 قالباً ملكياً مصمماً بعناية فائقة، وعاين كل قالب ببيانات افتراضية وتأثيرات واقعية لتختار الأنسب لليلتكم.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-8 rounded-lg border border-[#EAE1D3] bg-white text-center space-y-4 shadow-xs relative">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF7F0] border border-[#C8A96B] flex items-center justify-center font-serif-luxury font-bold text-lg text-[#C8A96B]">
                  2
                </div>
                <h3 className="text-lg font-serif-luxury font-bold text-[#332A25]">
                  خصص تفاصيل يومكم المميز
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  اكتب أسماءكم، موعد الحفل، خريطة الموقع، وارفع المقطع الصوتي واقتطع الجزء المفضل بكل سلاسة عبر المحرر المرئي التفاعلي.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-8 rounded-lg border border-[#EAE1D3] bg-white text-center space-y-4 shadow-xs relative">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF7F0] border border-[#C8A96B] flex items-center justify-center font-serif-luxury font-bold text-lg text-[#C8A96B]">
                  3
                </div>
                <h3 className="text-lg font-serif-luxury font-bold text-[#332A25]">
                  انشر وشارك بكل حب
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  احصل على رابط خاص بدعوتكم مع زر مشاركة فوري عبر واتساب وباركود QR عالي الدقة جاهز للطباعة أو الإرسال.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/how-it-works"
                className="text-xs font-semibold text-[#C8A96B] hover:text-[#A68648] inline-flex items-center gap-1"
              >
                <span>تعرف بالتفصيل على كافة إمكانيات المحرر وتأكيد الحضور</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-20 px-4 sm:px-8 md:px-12 bg-white border-b border-[#EAE1D3]">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <p className="text-xs uppercase tracking-widest font-semibold text-[#C8A96B]">
                مميزات متقدمة
              </p>
              <h2 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-[#332A25]">
                كل ما تحتاجه لدعوة رقمية ساحرة
              </h2>
              <div className="w-12 h-[1px] bg-[#C8A96B] mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-[#EAE1D3] bg-[#FAF7F0]/40 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif-luxury font-bold text-[#332A25]">
                  افتتاحية المغلف السينمائية
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  غلاف تفاعلي بمحاكاة ورقية ثلاثية الأبعاد وختم شمعي يبدأ بتشغيل الموسيقى بتناغم راقي عند فتحه.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[#EAE1D3] bg-[#FAF7F0]/40 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                  <Music className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif-luxury font-bold text-[#332A25]">
                  موسيقى مخصصة مع قص الصوت
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  ارفع مقطعك الصوتي وحدد وقت البداية والنهاية بدقة مع تحكم بالصوت ليعيش الضيف أجواء الفرح.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[#EAE1D3] bg-[#FAF7F0]/40 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif-luxury font-bold text-[#332A25]">
                  خرائط Google وتفاصيل الموقع
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  كرت موقع تفاعلي يتيح لضيوفكم الانتقال مباشرة إلى قاعة الحفل عبر خرائط جوجل بضغطة زر واحدة.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[#EAE1D3] bg-[#FAF7F0]/40 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif-luxury font-bold text-[#332A25]">
                  عداد تنازلي وإضافة للتقويم
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  عداد تنازلي حي يحسب الأيام والساعات، مع إمكانية حفظ موعد الزفاف في تقويم هاتف الضيف فوراً.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[#EAE1D3] bg-[#FAF7F0]/40 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif-luxury font-bold text-[#332A25]">
                  تأكيد الحضور الذكي (RSVP)
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  استقبل ردود الحضور واعتذارات الضيوف وعدد المرافقين مباشرة في لوحة تحكمك دون الحاجة للمتابعة اليدوية.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-[#EAE1D3] bg-[#FAF7F0]/40 space-y-3">
                <div className="w-10 h-10 rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif-luxury font-bold text-[#332A25]">
                  باركود QR ومشاركة واتساب
                </h3>
                <p className="text-xs text-[#7A6B5F] leading-relaxed">
                  توليد باركود QR بجودة عالية لكل دعوة، مع رابط مباشر يمكنك نسخه أو إرساله بنقرة واحدة عبر الواتساب.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Conversion Banner */}
        <section className="py-20 px-4 sm:px-8 md:px-12 text-center bg-[#FAF7F0]">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#332A25]">
              جاهزون لبدء حكايتكم؟
            </h2>
            <p className="text-sm sm:text-base text-[#7A6B5F]">
              اختر قالبك المفضل الآن، وابدأ في تخصيص أدق التفاصيل لترسل لأحبابك دعوة تظل محفورة في ذاكرتهم.
            </p>
            <div className="pt-2">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-sm text-sm font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-all shadow-md hover:shadow-lg"
              >
                <span>ابدأ الآن باختيار التصميم</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  )
}
