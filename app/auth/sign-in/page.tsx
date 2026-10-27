'use client'

import React, { useState, useTransition, use } from 'react'
import Link from 'next/link'
import { Sparkles, Shield, Heart, ArrowLeft, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import { loginWithCredentialsAction, registerWithCredentialsAction, demoCustomerLoginAction } from '../actions'

interface SignInPageProps {
  searchParams: Promise<{
    error?: string
    returnTo?: string
    notice?: string
  }>
}

export default function SignInPage(props: SignInPageProps) {
  const searchParams = use(props.searchParams)
  const returnTo = searchParams?.returnTo || '/dashboard'
  const errorParam = searchParams?.error

  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin')
  const [formError, setFormError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('returnTo', returnTo)

    startTransition(async () => {
      const res = activeTab === 'signin'
        ? await loginWithCredentialsAction(null, formData)
        : await registerWithCredentialsAction(null, formData)

      if (res?.error) {
        setFormError(res.error)
      }
    })
  }

  const handleDemoLogin = () => {
    setFormError(null)
    startTransition(async () => {
      await demoCustomerLoginAction(returnTo)
    })
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col justify-between bg-[#FAF7F0] text-[#332A25]">
      {/* Top Header */}
      <header className="py-6 px-6 md:px-12 flex items-center justify-between border-b border-[#EAE1D3] bg-white/70 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#FAF7F0] border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif-luxury font-bold text-lg text-[#332A25]">فرحة العمر</span>
            <span className="text-[9px] uppercase tracking-wider text-[#918579] block">Luxury Wedding Invitations</span>
          </div>
        </Link>

        <Link
          href="/templates"
          className="text-xs text-[#73675C] hover:text-[#C8A96B] flex items-center gap-1 font-medium transition-colors"
        >
          <span>استكشاف التصميمات</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-white border border-[#EAE1D3] rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F0] border border-[#C8A96B] mx-auto flex items-center justify-center text-[#C8A96B] shadow-xs mb-3">
              <Heart className="w-5 h-5 fill-current text-[#C8A96B]" />
            </div>
            <h1 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
              {activeTab === 'signin' ? 'تسجيل الدخول لمنصتك' : 'إنشاء حساب جديد مجاناً'}
            </h1>
            <p className="text-xs text-[#918579] leading-relaxed max-w-xs mx-auto">
              أنشئ وخصص بطاقات زفافك الرقمية الفاخرة وشاركها برابط مميز مع أحبائك
            </p>
          </div>

          {/* Error Notice */}
          {(errorParam || formError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                {formError ||
                  (errorParam === 'google_not_configured'
                    ? 'لم يتم تهيئة مفاتيح Google OAuth بعد في البيئة. يمكنك الدخول فوراً بالبريد أو الضغط على الدخول التجريبي أدناه.'
                    : errorParam === 'state_mismatch'
                    ? 'انتهت صلاحية جلسة التحقق، يرجى المحاولة مرة أخرى.'
                    : 'حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة ثانية.')}
              </div>
            </div>
          )}

          {/* Primary Action: Google OAuth Sign-in */}
          <div className="space-y-3">
            <a
              href={`/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`}
              className="w-full py-3 px-4 border border-[#EAE1D3] hover:border-[#C8A96B] bg-white hover:bg-[#FAF7F0] rounded-xl text-xs font-bold text-[#332A25] flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer group"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>المتابعة باستخدام حساب Google</span>
            </a>

            {/* Quick Demo Login Option */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isPending}
              className="w-full py-2.5 px-3 bg-[#C8A96B]/15 hover:bg-[#C8A96B]/25 text-[#A68648] border border-[#C8A96B]/30 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isPending ? 'جاري تسجيل الدخول...' : 'تسجيل دخول تجريبي فوري (1-Click Demo)'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#EAE1D3] w-full" />
            <span className="bg-white px-3 text-[11px] text-[#918579] shrink-0 font-medium">أو عبر البريد الإلكتروني</span>
          </div>

          {/* Tab selector */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF7F0] rounded-lg border border-[#EAE1D3] text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setFormError(null) }}
              className={`py-1.5 rounded transition-all cursor-pointer ${activeTab === 'signin' ? 'bg-white shadow-xs text-[#332A25]' : 'text-[#73675C]'}`}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setFormError(null) }}
              className={`py-1.5 rounded transition-all cursor-pointer ${activeTab === 'register' ? 'bg-white shadow-xs text-[#332A25]' : 'text-[#73675C]'}`}
            >
              حساب جديد
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-3.5">
            {activeTab === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                  الاسم الكريم
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#918579] absolute right-3 top-3 pointer-events-none" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="مثال: محمد أحمد"
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-lg border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]/40"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#918579] absolute right-3 top-3 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-lg border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]/40 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#332A25] mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#918579] absolute right-3 top-3 pointer-events-none" />
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pr-9 pl-3 py-2 text-xs rounded-lg border border-[#EAE1D3] focus:border-[#C8A96B] bg-[#FAF7F0]/40 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isPending
                ? 'جاري التحقق...'
                : activeTab === 'signin'
                ? 'دخول إلى الحساب'
                : 'إنشاء حساب جديد مجاناً'}
            </button>
          </form>

          {/* Privacy reassurance */}
          <div className="pt-2 border-t border-[#EAE1D3] flex items-center justify-center gap-1.5 text-[10px] text-[#918579]">
            <Shield className="w-3.5 h-3.5 text-[#C8A96B]" />
            <span>بياناتك ودعواتك في أمان تام وخاصة بك وحدك.</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-[#918579] flex flex-wrap items-center justify-center gap-3">
        <span>جميع الحقوق محفوظة © {new Date().getFullYear()} • منصة فرحة العمر</span>
        <span>•</span>
        <Link href="/admin/login" className="text-[#A68648] hover:text-[#C8A96B] font-semibold transition-colors flex items-center gap-1">
          <Shield className="w-3 h-3 text-[#C8A96B]" />
          <span>بوابة دخول الإدارة (Admin Portal)</span>
        </Link>
      </footer>
    </div>
  )
}
