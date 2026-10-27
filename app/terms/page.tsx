import React from 'react'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { FileCheck, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'شروط وأحكام الاستخدام | فرحة العمر',
  description: 'الشروط والأحكام المنظمة لاستخدام منصة فرحة العمر لإنشاء دعوات الزفاف الرقمية.',
}

export default function TermsPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      <MarketingHeader />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-8 md:px-12">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C8A96B]/50 bg-white text-xs font-semibold text-[#A68648]">
              <FileCheck className="w-3.5 h-3.5" />
              <span>الاتفاقية القانونية</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#332A25]">
              شروط وأحكام الاستخدام
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6B5F]">
              تاريخ آخر تحديث: أكتوبر 2026
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-xl border border-[#EAE1D3] shadow-xs space-y-8 text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25]">
                1. قبول الشروط
              </h2>
              <p>
                باستخدامك لمنصة «فرحة العمر» أو تسجيل حساب أو إنشاء دعوة زفاف، فإنك تقر وتوافق على الالتزام بكافة الشروط والأحكام الموضحة هنا.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25]">
                2. ملكية المحتوى ومسؤولية المستخدم
              </h2>
              <p>
                يتحمل المستخدم المسؤولية الكاملة عن كافة النصوص والصور والمقاطع الصوتية التي يقوم برفعها أو تضمينها في دعوة الزفاف، ويقر بامتلاكه الحق القانوني في استخدامها دون انتهاك حقوق الملكية الفكرية للآخرين.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25]">
                3. الاستخدام المقبول
              </h2>
              <p>
                المنصة مخصصة للأغراض الاجتماعية والمناسبات السعيدة والأفراح. يُحظر تماماً استخدام المنصة لنشر أي محتوى مسيء، غير لائق، ينتهك الآداب العامة، أو يروج لأنشطة غير قانونية.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25]">
                4. استمرارية وتوافر الخدمة
              </h2>
              <p>
                نعمل جاهدين على توفير استمرارية الخدمة بنسبة تفوق 99.9%، وتأمين وصول ضيوفكم إلى روابط الدعوات على مدار الساعة دون انقطاع.
              </p>
            </section>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
