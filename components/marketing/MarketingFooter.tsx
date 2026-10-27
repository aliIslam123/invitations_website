import React from 'react'
import Link from 'next/link'
import { Sparkles, Heart, Shield, Lock, Smartphone, Globe, Mail } from 'lucide-react'

export function MarketingFooter() {
  return (
    <footer
      dir="rtl"
      className="border-t border-[#EAE1D3] bg-[#FAF7F0] text-[#6B5E55] pt-16 pb-12 px-6 sm:px-8 md:px-12"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand column */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#C8A96B] bg-white flex items-center justify-center text-[#C8A96B] shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif-luxury font-bold text-lg text-[#332A25] tracking-wide block">
                فرحة العمر
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[#918579] block">
                Luxury Wedding Invitations
              </span>
            </div>
          </div>
          <p className="text-xs text-[#918579] leading-relaxed">
            المنصة العربية الأولى المتخصصة في صناعة وتصميم دعوات الزفاف الرقمية الملكية والسينمائية. تفاصيل استثنائية لأجمل ليالي العمر.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#C8A96B]">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>صُنع بكل حب للأعراس العربية</span>
          </div>
        </div>

        {/* Templates link */}
        <div className="space-y-3">
          <h4 className="font-serif-luxury font-bold text-sm text-[#332A25]">
            مكتبة التصاميم
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/templates?category=luxury" className="hover:text-[#C8A96B] transition-colors">
                تصاميم فاخرة وملكية
              </Link>
            </li>
            <li>
              <Link href="/templates?category=minimalist" className="hover:text-[#C8A96B] transition-colors">
                تصاميم مينيمال وبسيطة
              </Link>
            </li>
            <li>
              <Link href="/templates?category=cultural" className="hover:text-[#C8A96B] transition-colors">
                تصاميم الخط والتراث العربي
              </Link>
            </li>
            <li>
              <Link href="/templates?category=romantic" className="hover:text-[#C8A96B] transition-colors">
                تصاميم رومانسية ناعمة
              </Link>
            </li>
            <li>
              <Link href="/templates?category=modern" className="hover:text-[#C8A96B] transition-colors">
                تصاميم عصرية ومجلات الموضة
              </Link>
            </li>
          </ul>
        </div>

        {/* Platform links */}
        <div className="space-y-3">
          <h4 className="font-serif-luxury font-bold text-sm text-[#332A25]">
            المنصة والخدمات
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/how-it-works" className="hover:text-[#C8A96B] transition-colors">
                كيف تعمل المنصة
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-[#C8A96B] transition-colors">
                الأسئلة الشائعة
              </Link>
            </li>
            <li>
              <Link href="/wedding/mohamed-and-asmaa" target="_blank" className="hover:text-[#C8A96B] transition-colors">
                نموذج دعوة حي ومباشر
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-[#C8A96B] transition-colors">
                مساحة العروسين (لوحة التحكم)
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal & Safety */}
        <div className="space-y-3">
          <h4 className="font-serif-luxury font-bold text-sm text-[#332A25]">
            الخصوصية والأمان
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/privacy" className="hover:text-[#C8A96B] transition-colors flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-[#C8A96B]" />
                <span>سياسة الخصوصية وحماية البيانات</span>
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-[#C8A96B] transition-colors">
                شروط وأحكام الاستخدام
              </Link>
            </li>
          </ul>
          <div className="pt-2">
            <p className="text-[11px] text-[#918579] leading-relaxed">
              جميع بيانات العروسين والضيوف مشفرة وآمنة وفق أعلى معايير الخصوصية.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-[#EAE1D3] flex flex-col sm:flex-row items-center justify-between text-xs text-[#918579] gap-4">
        <p>© {new Date().getFullYear()} فرحة العمر • منصة بطاقات ودعوات الزفاف الرقمية الفاخرة. جميع الحقوق محفوظة.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/privacy" className="hover:text-[#332A25]">الخصوصية</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-[#332A25]">الشروط</Link>
          <span>•</span>
          <Link href="/faq" className="hover:text-[#332A25]">المساعدة</Link>
        </div>
      </div>
    </footer>
  )
}
