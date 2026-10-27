import React from 'react'
import Link from 'next/link'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import {
  Sparkles,
  ArrowLeft,
  Palette,
  Edit3,
  Share2,
  CheckCircle2,
  Sliders,
  Music,
  MapPin,
  QrCode,
  Users,
} from 'lucide-react'

export const metadata = {
  title: 'كيف تعمل المنصة | فرحة العمر',
  description: 'تعرف على خطوات صناعة وتخصيص ومشاركة دعوة زفافك الرقمية الفاخرة بسهولة واحترافية.',
}

export default function HowItWorksPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      <MarketingHeader />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-8 md:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C8A96B]/50 bg-white text-xs font-semibold text-[#A68648]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>دليل الاستخدام الكامل</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#332A25]">
              كيف تعمل منصة فرحة العمر؟
            </h1>
            <p className="text-xs sm:text-base text-[#7A6B5F] max-w-xl mx-auto leading-relaxed">
              صممنا تجربة المستخدم لتكون في غاية السهولة والسلاسة، تمكن أي عروسين من إطلاق دعوة زفاف سينمائية في دقائق معدودة.
            </p>
          </div>

          {/* Detailed Steps Progression */}
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="p-8 rounded-xl border border-[#EAE1D3] bg-white shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border-2 border-[#C8A96B] flex items-center justify-center font-serif-luxury font-bold text-2xl text-[#C8A96B] shrink-0">
                1
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#A68648]">
                  <Palette className="w-4 h-4" />
                  <span>الخطوة الأولى: اختيار التصميم</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif-luxury font-bold text-[#332A25]">
                  استكشف مكتبة القوالب الملكية
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
                  تضم المنصة 16 تصميماً ملكياً متنوعاً مصممة بواسطة نخبة من المصممين المحترفين: من الخط العربي التقليدي والألوان الملكية الدافئة إلى التصاميم العصرية ومجلات الموضة. يمكنك معاينة القالب قبل اختياره لمعرفة كيف سيبدو على هواتف ضيوفك.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#918579]">
                  <span className="bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#EAE1D3]">16 قالباً فريداً</span>
                  <span className="bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#EAE1D3]">تنسيقات ألوان ملكية</span>
                  <span className="bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#EAE1D3]">خطوط عربية مختارة بعناية</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-xl border border-[#EAE1D3] bg-white shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border-2 border-[#C8A96B] flex items-center justify-center font-serif-luxury font-bold text-2xl text-[#C8A96B] shrink-0">
                2
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#A68648]">
                  <Edit3 className="w-4 h-4" />
                  <span>الخطوة الثانية: التخصيص عبر المحرر الحي</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif-luxury font-bold text-[#332A25]">
                  تحكم كامل في كل عنصر وكل بطاقة
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
                  لا تحتاج لأي خبرة برمجية أو تصميمية. محررنا المرئي يمنحك معاينة فورية ومباشرة لما تعدله مع حفظ تلقائي مستمر:
                </p>
                <ul className="space-y-2 text-xs text-[#7A6B5F] pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>تعديل أسماء العروسين وتاريخ وساعة الحفل واسم القاعة والمدينة.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>إضافة رابط قاعة الحفل على خرائط Google وتحديد إرشادات الوصول.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>رفع ملف الموسيقى وقص المقطع بدقة واختيار أوقات البدء والانتهاء.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                    <span>إظهار أو إخفاء أي قسم بضغطة زر (مسار الحفل، الزي الرسمي، كارت الهدايا، شارة الحروف).</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-xl border border-[#EAE1D3] bg-white shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border-2 border-[#C8A96B] flex items-center justify-center font-serif-luxury font-bold text-2xl text-[#C8A96B] shrink-0">
                3
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#A68648]">
                  <Share2 className="w-4 h-4" />
                  <span>الخطوة الثالثة: النشر ومشاركة الدعوة</span>
                </div>
                <h2 className="text-xl md:text-2xl font-serif-luxury font-bold text-[#332A25]">
                  شارك أحبابك بنقرة واحدة وتابع الحضور
                </h2>
                <p className="text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
                  بمجرد نشر الدعوة، يتم إنشاء رابط فريد وخاص بدعوتكم لا يمكن لأحد غيركم تعديله. يمكنك مشاركته عبر واتساب بنقرة واحدة، وتحميل كود QR بدقة فائقة لطباعته في كروتكم أو بطاقات الطاولات.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs text-[#918579]">
                  <span className="bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#EAE1D3]">مشاركة فورية عبر واتساب</span>
                  <span className="bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#EAE1D3]">رمز استجابة سريعة QR عالي الجودة</span>
                  <span className="bg-[#FAF7F0] px-3 py-1 rounded-full border border-[#EAE1D3]">إحصائيات وردود تأكيد الحضور</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Banner */}
          <div className="p-8 rounded-xl bg-gradient-to-br from-[#FAF7F0] to-[#EAE1D3]/50 border border-[#C8A96B]/30 text-center space-y-4">
            <h3 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
              ابدأ تجربتك الآن واصنع دعوتك بنفسك
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B5F] max-w-md mx-auto">
              تصفح القوالب الآن واختر ما يناسبكم، لن يستغرق الأمر سوى بضع دقائق.
            </p>
            <div className="pt-2">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-all shadow-md"
              >
                <span>تصفح قوالب الدعوات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
