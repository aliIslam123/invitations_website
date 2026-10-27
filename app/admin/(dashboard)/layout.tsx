import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import {
  Shield,
  LayoutDashboard,
  Users,
  Palette,
  ExternalLink,
  LogOut,
  Sparkles,
  ArrowRight,
  Home,
  CheckCircle2,
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  if (session.role !== 'ADMIN') {
    redirect('/admin/login?error=unauthorized')
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col md:flex-row bg-[#F1F5F9] text-slate-900">
      {/* Executive Sidebar */}
      <aside className="w-full md:w-64 bg-[#0B0F19] text-slate-100 flex flex-col justify-between shrink-0 shadow-2xl border-l border-slate-800">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#C8A96B] flex items-center justify-center text-slate-950 font-bold shadow-md group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">إدارة المنصة</span>
                <span className="text-[10px] text-[#C8A96B] font-mono tracking-widest block uppercase">
                  SuperAdmin OS
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-semibold bg-slate-800/80 text-white border border-slate-700/60"
            >
              <Users className="w-4 h-4 text-[#C8A96B]" />
              <span>إدارة العملاء والدعوات</span>
            </Link>

            <Link
              href="/dashboard/rsvp"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C8A96B]" />
              <span>سجل ردود الحضور (RSVP)</span>
            </Link>

            <Link
              href="/platform-admin/templates"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <Palette className="w-4 h-4 text-slate-400" />
              <span>القوالب الملكية (16)</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <Home className="w-4 h-4 text-slate-400" />
              <span>مساحة عمل العميل</span>
            </Link>
          </nav>
        </div>

        {/* Footer Admin Credentials Info & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="space-y-0.5">
              <span className="font-bold text-white block text-xs truncate max-w-[130px]">
                {session.name || session.email}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono block">
                ADMIN • موثق
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] bg-[#C8A96B]/20 text-[#C8A96B] font-mono font-bold">
              ROOT
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
            >
              <ExternalLink className="w-3 h-3 text-[#C8A96B]" />
              <span>الموقع العام</span>
            </Link>

            <a
              href="/auth/logout"
              className="p-2 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>لوحة التحكم والإدارة المركزية المستقلة (Dedicated Admin Portal)</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              URL: /admin
            </span>
          </div>
        </header>

        {/* Dynamic Admin Content */}
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
