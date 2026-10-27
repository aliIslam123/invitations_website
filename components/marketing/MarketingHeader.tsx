import React from 'react'
import Link from 'next/link'
import { Sparkles, LayoutDashboard, ArrowLeft, Heart, User, LogIn } from 'lucide-react'
import { getSession } from '@/lib/auth'

export async function MarketingHeader() {
  const session = await getSession()

  return (
    <header
      dir="rtl"
      className="h-20 border-b border-[#EAE1D3] bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 md:px-12 flex items-center justify-between"
    >
      {/* Brand Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full border border-[#C8A96B] bg-[#FAF7F0] flex items-center justify-center text-[#C8A96B] shadow-xs group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-serif-luxury font-bold text-lg md:text-xl text-[#332A25] tracking-wide block leading-tight">
            فرحة العمر
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#918579] block">
            Luxury Wedding Invitations
          </span>
        </div>
      </Link>

      {/* Main Navigation Links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B5E55]">
        <Link
          href="/templates"
          className="hover:text-[#C8A96B] transition-colors relative py-1 hover:font-semibold"
        >
          مكتبة التصاميم
        </Link>
        <Link
          href="/how-it-works"
          className="hover:text-[#C8A96B] transition-colors relative py-1 hover:font-semibold"
        >
          كيف تعمل المنصة
        </Link>
        <Link
          href="/faq"
          className="hover:text-[#C8A96B] transition-colors relative py-1 hover:font-semibold"
        >
          الأسئلة الشائعة
        </Link>
      </nav>

      {/* Actions / Auth */}
      <div className="flex items-center gap-3">
        {session ? (
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>لوحة التحكم</span>
            </Link>
            {session.role === 'ADMIN' && (
              <Link
                href="/platform-admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-medium border border-[#EAE1D3] text-[#7A6B5F] hover:text-[#332A25] hover:bg-[#FAF7F0] transition-colors"
              >
                <span>إدارة المنصة</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/auth/sign-in"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-sm text-xs font-medium border border-[#EAE1D3] text-[#332A25] hover:bg-[#FAF7F0] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>تسجيل الدخول</span>
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
            >
              <span>ابدأ تصميم دعوتك</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
