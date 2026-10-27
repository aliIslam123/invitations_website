import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import {
  Shield,
  LayoutDashboard,
  Users,
  Mail,
  Palette,
  Settings,
  ArrowRight,
  Sparkles,
  ExternalLink,
  LogOut,
  Home,
} from 'lucide-react'

export default async function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/sign-in?returnTo=/platform-admin')
  }

  // Strict server-side authorization check for ADMIN role
  if (session.role !== 'ADMIN') {
    redirect('/dashboard?error=admin_required')
  }

  const navLinks = [
    { href: '/platform-admin', label: 'لوحة التحكم المركزية', icon: LayoutDashboard },
    { href: '/platform-admin/templates', label: 'إدارة القوالب (16)', icon: Palette },
    { href: '/platform-admin/customers', label: 'حسابات العملاء', icon: Users },
    { href: '/platform-admin/invitations', label: 'كافة الدعوات', icon: Mail },
    { href: '/platform-admin/settings', label: 'إعدادات المنصة', icon: Settings },
  ]

  return (
    <div dir="rtl" className="min-h-screen flex flex-col md:flex-row bg-[#F8F9FA] text-[#1E293B]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#0F172A] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#C8A96B] flex items-center justify-center text-slate-900 shadow-md">
                <Shield className="w-5 h-5 font-bold" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-white tracking-wide">
                  إدارة منصة فرحة العمر
                </h1>
                <span className="text-[10px] text-[#C8A96B] font-mono tracking-wider">
                  Platform Admin OS
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded text-xs md:text-sm font-medium transition-colors hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Icon className="w-4 h-4 text-[#C8A96B] shrink-0" />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Admin Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="truncate max-w-[130px] text-slate-400 font-mono text-[11px]">
              {session.email}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold font-mono">
              SUPERADMIN
            </span>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
            >
              <Home className="w-3 h-3 text-[#C8A96B]" />
              <span>مساحة العميل</span>
            </Link>

            <a
              href="/auth/logout"
              className="p-1.5 rounded bg-red-950/50 hover:bg-red-900/60 text-red-300 transition-colors"
              title="خروج"
            >
              <LogOut className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>نظام التشغيل وإدارة العمليات الموحد (Platform Production)</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>الموقع العام</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
