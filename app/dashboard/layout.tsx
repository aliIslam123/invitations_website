import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import {
  LayoutDashboard,
  Mail,
  PlusCircle,
  Users,
  Image as ImageIcon,
  Palette,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  Shield,
  Home,
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/sign-in?returnTo=/dashboard')
  }

  const isAdmin = session.role === 'ADMIN'

  const navLinks = [
    { href: '/dashboard', label: 'نظرة عامة', icon: LayoutDashboard },
    { href: '/dashboard/invitations', label: 'دعوات الزفاف', icon: Mail },
    { href: '/dashboard/invitations/new', label: 'إنشاء دعوة جديدة', icon: PlusCircle },
    { href: '/dashboard/rsvp', label: 'إدارة الحضور (RSVP)', icon: Users },
    { href: '/dashboard/media', label: 'مكتبة الوسائط', icon: ImageIcon },
    { href: '/dashboard/themes', label: 'السمات والتصاميم', icon: Palette },
    { href: '/dashboard/settings', label: 'الإعدادات والأمان', icon: Settings },
  ]

  return (
    <div dir="rtl" className="min-h-screen flex flex-col md:flex-row bg-[#FAF7F0] text-[#332A25]">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-l border-[#EAE1D3] flex flex-col justify-between shrink-0 shadow-xs">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-[#EAE1D3] flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#C8A96B] flex items-center justify-center text-[#C8A96B]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif-luxury font-bold text-base leading-tight text-[#332A25]">
                  فرحة العمر
                </h1>
                <p className="text-[10px] text-[#918579] tracking-wider uppercase">
                  Wedding Studio
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs md:text-sm font-medium transition-colors hover:bg-[#FAF7F0] hover:text-[#C8A96B] text-[#332A25]"
                >
                  <Icon className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>{link.label}</span>
                </Link>
              )
            })}

            {/* Admin Link if authorized */}
            {isAdmin && (
              <div className="pt-3 mt-3 border-t border-[#EAE1D3]">
                <Link
                  href="/platform-admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-semibold bg-[#FAF7F0] text-[#A68648] hover:bg-[#EAE1D3]/50 transition-colors"
                >
                  <Shield className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>إدارة المنصة (Admin)</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* User Footer & Logout */}
        <div className="p-4 border-t border-[#EAE1D3] bg-[#FAF7F0]/50 space-y-2">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="font-semibold text-[#332A25] truncate max-w-[140px]">
              {session.name || session.email}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#C8A96B]/20 text-[#A68648] font-bold">
              {session.role}
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded border border-[#EAE1D3] text-[11px] font-medium hover:bg-white transition-colors text-[#332A25]"
            >
              <Home className="w-3 h-3 text-[#C8A96B]" />
              <span>الموقع العام</span>
            </Link>

            <a
              href="/wedding/mohamed-and-asmaa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded border border-[#EAE1D3] text-[11px] font-medium hover:bg-white transition-colors"
              title="معاينة نموذج الدعوة"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C8A96B]" />
            </a>

            <a
              href="/auth/logout"
              className="flex items-center justify-center p-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-[#EAE1D3] px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[#918579]">
              منصة إدارة بطاقات ودعوات الزفاف الرقمية الفاخرة
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/invitations/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إنشاء دعوة جديدة</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
