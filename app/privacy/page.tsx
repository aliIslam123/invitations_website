import React from 'react'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { Shield, Lock, FileText } from 'lucide-react'

export const metadata = {
  title: 'سياسة الخصوصية وحماية البيانات | فرحة العمر',
  description: 'تعرف على التزامنا بحماية بيانات العروسين والضيوف وسريتها.',
}

export default function PrivacyPage() {
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
              <Shield className="w-3.5 h-3.5" />
              <span>خصوصية وسرية تامة</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#332A25]">
              سياسة الخصوصية
            </h1>
            <p className="text-xs sm:text-sm text-[#7A6B5F]">
              تاريخ آخر تحديث: أكتوبر 2026
            </p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-xl border border-[#EAE1D3] shadow-xs space-y-8 text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25] flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C8A96B]" />
                <span>1. التزامنا تجاه خصوصيتكم</span>
              </h2>
              <p>
                نحن في منصة «فرحة العمر» نقدّر بشدة خصوصية عملائنا وضيوفهم. إن البيانات التي تشاركونها معنا لبناء دعوة الزفاف (مثل الأسماء، التواريخ، الصور، ومواقع الحفل) تُعامل بسرية واحترافية تامة.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C8A96B]" />
                <span>2. البيانات التي يتم جمعها</span>
              </h2>
              <ul className="list-disc list-inside space-y-1 pr-2">
                <li>بيانات الحساب: الاسم، البريد الإلكتروني، وصورة الملف الشخصي عند التسجيل عبر Google أو البريد.</li>
                <li>بيانات الدعوة: أسماء العروسين، تاريخ الحفل، اسم القاعة، ورابط الخريطة، والوسائط المرفوعة.</li>
                <li>بيانات الضيوف (RSVP): أسماء الضيوف، حالة الحضور، عدد المرافقين، والرسائل التهنئة المرسلة.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25]">
                3. حماية بيانات الضيوف وردود الحضور
              </h2>
              <p>
                لا يمكن لأي طرف خارجي الاطلاع على ردود الضيوف أو أرقامهم أو هواتفهم؛ هذه البيانات متاحة حصرياً لصاحب الدعوة داخل لوحة تحكمه الآمنة. لا نقوم إطلاقاً ببيع أو تأجير أي بيانات لطرف ثالث.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-serif-luxury font-bold text-[#332A25]">
                4. أمان البيانات والتشفير
              </h2>
              <p>
                يتم نقل كافة البيانات والاتصالات عبر بروتوكول التشفير الآمن (HTTPS / SSL)، وتُحفظ كلمات المرور بشكل مشفر وغير قابل للاسترجاع (Hashed).
              </p>
            </section>
          </div>
        </div>
      </main>

      <MarketingFooter />
    </div>
  )
}
