import React from 'react'
import Link from 'next/link'
import { MarketingHeader } from '@/components/marketing/MarketingHeader'
import { MarketingFooter } from '@/components/marketing/MarketingFooter'
import { Sparkles, HelpCircle, ArrowLeft, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'الأسئلة الشائعة | فرحة العمر',
  description: 'إجابات على الأسئلة الأكثر شيوعاً حول تصميم ونشر ومشاركة دعوات الزفاف الرقمية وتأكيد الحضور.',
}

const FAQS = [
  {
    q: 'هل تعمل الدعوة الرقمية بسلاسة على كافة الهواتف وأنظمة التشغيل؟',
    a: 'نعم، صُممت جميع القوالب والدعوات في منصة فرحة العمر بتقنيات الويب المتجاوبة والمتقدمة (Mobile First)، وتعمل بكفاءة فائقة على أجهزة الآيفون (iOS)، والأندرويد، وكافة المتصفحات دون الحاجة لتحميل أي تطبيق.',
  },
  {
    q: 'كيف يتم تشغيل الموسيقى عند فتح الضيف للدعوة؟',
    a: 'احتراماً لسياسات المتصفحات العالمية ومنعاً للإزعاج المفاجئ، تبدأ الموسيقى بالعمل تلقائياً فور نقر الضيف على زر "فتح الدعوة" في الغلاف التفاعلي، مما يمنحه تجربة سينمائية ساحرة ومدروسة.',
  },
  {
    q: 'هل يمكنني قص المقطع الصوتي واختيار جزء معين منه؟',
    a: 'بكل تأكيد! يتضمن المحرر أداة متطورة لقص الصوت، حيث يمكنك رفع أي مقطع صوتي وتحديد نقطة البداية ونقطة النهاية بالثواني مع استماع فوري للمقطع قبل الحفظ.',
  },
  {
    q: 'هل يمكنني تعديل بيانات الدعوة وموعد الحفل بعد النشر والمشاركة؟',
    a: 'نعم، ميزة الدعوات الرقمية أنها مرنة دائماً. يمكنك الدخول إلى لوحة تحكمك وتعديل أي تفصيلة (مثل وقت الحفل، خريطة الموقع، أو الرسائل) وسيتم تحديثها فوراً للضيوف على نفس الرابط دون الحاجة لإعادة إرسال الرابط.',
  },
  {
    q: 'كيف تظهر خريطة موقع القاعة (Google Maps) للضيوف؟',
    a: 'توفر المنصة بطاقة موقع تفاعلية تعرض اسم القاعة والمدينة، وبمجرد نقر الضيف على زر "فتح الموقع في الخرائط" يتم تحويله مباشرة إلى تطبيق Google Maps أو Waze ليتم توجيهه خطوة بخطوة إلى مكان الحفل.',
  },
  {
    q: 'أين أجد ردود الضيوف وتأكيدات حضورهم (RSVP)؟',
    a: 'تصلك كافة ردود الضيوف لحظياً داخل لوحة تحكمك الخاصة. يمكنك الاطلاع على أسماء الحاضرين والمعتذرين، عدد المرافقين، وملاحظاتهم، وتصديرها أو فرزها متى شئت.',
  },
  {
    q: 'هل يمكنني إخفاء أو إظهار أقسام معينة (مثل الزي الرسمي أو مسار الحفل)؟',
    a: 'نعم، كل قسم في الدعوة مزود بمفتاح تشغيل/إيقاف في المحرر المرئي. يمكنك إظهار أو إخفاء مسار الحفل، الزي الرسمي، كارت الهدايا، بطاقة الموقع، وغيرها حسب رغبتكم.',
  },
  {
    q: 'كيف أستفيد من رمز الاستجابة السريعة (QR Code)؟',
    a: 'توفر المنصة كود QR خاص بدعوتكم بدقة عالية جداً. يمكنك تنزيله كصورة وطباعته على كروت الدعوة الورقية أو لافتات الاستقبال في القاعة ليتسنى للضيوف مسحه ومشاهدة التفاصيل.',
  },
]

export default function FAQPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      <MarketingHeader />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-8 md:px-12">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C8A96B]/50 bg-white text-xs font-semibold text-[#A68648]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>مركز المساعدة والمعلومات</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-[#332A25]">
              الأسئلة الشائعة
            </h1>
            <p className="text-xs sm:text-base text-[#7A6B5F] max-w-lg mx-auto leading-relaxed">
              جمعنا لكم الإجابات الوافية عن أكثر الاستفسارات التي تهم العروسين حول تصميم الدعوات الرقمية ومشاركتها.
            </p>
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-lg border border-[#EAE1D3] bg-white shadow-xs space-y-2 hover:border-[#C8A96B] transition-colors"
              >
                <h3 className="font-serif-luxury font-bold text-base md:text-lg text-[#332A25]">
                  {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-[#7A6B5F] leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          {/* Need more help banner */}
          <div className="p-8 rounded-xl bg-white border border-[#EAE1D3] text-center space-y-4 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-xl text-[#332A25]">
              لديك سؤال آخر أو تحتاج لمساعدة خاصة؟
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B5F] max-w-md mx-auto">
              فريقنا جاهز دائماً لمساعدتكم ومرافقتكم في تجهيز أجمل بطاقة دعوة تليق بيومكم المميز.
            </p>
            <div className="pt-2">
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-all shadow-xs"
              >
                <span>ابدأ الآن بتصفح القوالب</span>
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
