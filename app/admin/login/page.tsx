import React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { loginWithCredentialsAction } from '@/app/auth/actions'
import { Shield, Lock, User, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'تسجيل دخول مدير المنصة | SuperAdmin Login',
  description: 'بوابة الدخول المخصصة لإدارة منصة فرحة العمر',
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await getSession()
  if (session && session.role === 'ADMIN') {
    redirect('/admin')
  }

  const { error } = await searchParams

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between bg-[#0B0F19] text-slate-100 selection:bg-[#C8A96B] selection:text-slate-900"
    >
      {/* Top Header */}
      <header className="p-6 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#C8A96B] flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-white">فرحة العمر • Admin OS</span>
            <span className="text-[10px] text-slate-400 block font-mono">Executive Command Portal</span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>الموقع الرئيسي</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-[#131B2E] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#C8A96B]/15 border border-[#C8A96B]/40 mx-auto flex items-center justify-center text-[#C8A96B] shadow-inner mb-3">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
              بوابة إدارة النظام والمنصة
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
              لوحة التحكم المركزية لإدارة حسابات العملاء، ومراقبة الدعوات، والإشراف الكامل.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300">
              {error === 'unauthorized'
                ? 'الحساب الحالي ليس لديه صلاحيات مدير (ADMIN). يرجى الدخول بحساب المدير.'
                : 'اسم المستخدم أو كلمة المرور غير صحيحة.'}
            </div>
          )}

          {/* Fixed Credentials Info Card */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 text-[#C8A96B] font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>بيانات حساب المدير الافتراضي الثابت في النظام:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-1">
              <div>
                <span className="text-slate-500 block">المستخدم:</span>
                <span className="text-emerald-400 font-bold">admin</span>
              </div>
              <div>
                <span className="text-slate-500 block">كلمة المرور:</span>
                <span className="text-emerald-400 font-bold">admin123</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form action={loginWithCredentialsAction.bind(null, null)} className="space-y-4">
            <input type="hidden" name="returnTo" value="/admin" />

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                اسم المستخدم أو البريد الإلكتروني للمدير
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="email"
                  defaultValue="admin"
                  required
                  placeholder="admin أو admin@wedding.com"
                  className="w-full pr-10 pl-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#C8A96B] focus:outline-hidden text-xs text-white font-mono placeholder-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  defaultValue="admin123"
                  required
                  placeholder="كلمة المرور (admin123)"
                  className="w-full pr-10 pl-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-[#C8A96B] focus:outline-hidden text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#C8A96B] hover:bg-[#b08e50] text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>دخول لوحة الإدارة (Enter Admin Portal)</span>
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 border-t border-slate-800">
        منصة فرحة العمر • نظام التحكم المركزي والإشراف المباشر
      </footer>
    </div>
  )
}
