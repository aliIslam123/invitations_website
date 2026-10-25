import React from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Heart,
  Palette,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  QrCode,
  Music,
  Users,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      {/* Navigation Bar */}
      <header className="h-20 border-b border-[#EAE1D3] bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#C8A96B] bg-[#FAF7F0] flex items-center justify-center text-[#C8A96B] shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-lg md:text-xl text-[#332A25] tracking-wide block">
              فرحة العمر • Luxury Wedding
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#918579] block">
              Digital Wedding Invitation Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
          >
            لوحة الإدارة (Admin)
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-6 md:px-12 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 20%, #EAE1D3 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C8A96B]/40 bg-white/80 text-xs font-semibold text-[#A68648] mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>منصة بطاقات ودعوات الزفاف الرقمية الفاخرة</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif-luxury font-bold text-[#332A25] leading-tight mb-6">
            دعوات زفاف رقمية سينمائية
            <span className="block text-3xl sm:text-4xl md:text-5xl font-normal mt-2 text-[#C8A96B]">
              تخلّد أجمل لحظات العمر
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#918579] leading-relaxed mb-10">
            تجربة رقمية فريدة تدمج أناقة المطبوعات الملكية مع تفاعلية التكنولوجيا: فتح بطاقة سينمائي،
            موسيقى هادئة، عداد تنازلي، مسار الحفل، خرائط Google Maps، وتأكيد حضور تفاعلي متكامل.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/wedding/ahmed-and-sara"
              className="px-8 py-4 rounded-sm text-sm font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-md flex items-center gap-2"
            >
              <span>مشاهدة نموذج الدعوة (أحمد وسارة)</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-sm text-sm font-semibold border border-[#C8A96B] text-[#332A25] bg-white hover:bg-[#FAF7F0] transition-colors shadow-xs"
            >
              دخول لوحة التحكم والمحرر
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Highlight Grid */}
      <section className="py-20 px-6 md:px-12 bg-white border-y border-[#EAE1D3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-widest font-semibold text-[#C8A96B] mb-2">
              المزايا والإمكانيات
            </p>
            <h2 className="text-3xl font-serif-luxury font-bold text-[#332A25]">
              صُممت لتفوق التوقعات
            </h2>
            <div className="w-12 h-[1px] bg-[#C8A96B] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-sm border border-[#EAE1D3] bg-[#FAF7F0]/40 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-[#332A25]">
                افتتاحية كرت سينمائية
              </h3>
              <p className="text-xs text-[#918579] leading-relaxed">
                غلاف بطاقة رقمي أنيق بشعار العروسين وتأثير فتح ورقي ناعم يبدأ بتشغيل الموسيقى بتفاعل راقي.
              </p>
            </div>

            <div className="p-8 rounded-sm border border-[#EAE1D3] bg-[#FAF7F0]/40 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-[#332A25]">
                مخصصة لواتساب والجوال أولاً
              </h3>
              <p className="text-xs text-[#918579] leading-relaxed">
                تصفح مثالي وسريع للضيوف القادمين من روابط واتساب، مع توافق كامل للأجهزة الذكية بمختلف أبعادها.
              </p>
            </div>

            <div className="p-8 rounded-sm border border-[#EAE1D3] bg-[#FAF7F0]/40 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shadow-xs">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif-luxury font-bold text-[#332A25]">
                محرر مباشر وسحب وإفلات
              </h3>
              <p className="text-xs text-[#918579] leading-relaxed">
                لوحة تحكم مرنة تتيح إعادة ترتيب الأقسام، واختيار السمات الستة، والتحكم في كل التفاصيل مع معاينة حية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center text-xs text-[#918579] border-t border-[#EAE1D3]">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-[#C8A96B] fill-current" />
        </div>
        <p className="font-serif-luxury text-base text-[#332A25] font-bold">
          منصة دعوات الزفاف الرقمية الفاخرة
        </p>
        <p className="mt-1">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
