'use client'

import React, { useActionState } from 'react'
import { loginAction } from './actions'
import { Sparkles, Lock, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center p-4 selection:bg-[#C8A96B] selection:text-white"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      {/* Background radial accent */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #EAE1D3 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-md bg-white p-8 md:p-10 rounded-sm border border-[#EAE1D3] shadow-xl">
        {/* Brand Monogram */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full border-2 border-[#C8A96B] flex items-center justify-center mb-4 shadow-sm bg-[#FAF7F0]">
            <Sparkles className="w-7 h-7 text-[#C8A96B]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-serif-luxury font-bold text-[#332A25] tracking-wide">
            لوحة الإدارة الفاخرة
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#918579] mt-1.5">
            Luxury Wedding Invitation Platform
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div className="mb-6 p-3 text-xs rounded-sm bg-red-50 text-red-700 border border-red-200">
            {state.error}
          </div>
        )}

        {/* Login Form */}
        <form action={formAction} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#332A25] mb-2">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                defaultValue="admin@luxurywedding.com"
                placeholder="admin@example.com"
                className="w-full pl-4 pr-10 py-3 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B] bg-[#FAF7F0]/40 transition-colors"
              />
              <Mail className="w-4 h-4 text-[#918579] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-[#332A25] mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                defaultValue="AdminPassword2024!"
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-3 rounded-sm border border-[#EAE1D3] text-sm focus:outline-none focus:border-[#C8A96B] bg-[#FAF7F0]/40 transition-colors"
              />
              <Lock className="w-4 h-4 text-[#918579] absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Quick Demo Credentials Reminder */}
          <div className="p-3 bg-[#FAF7F0] rounded-sm border border-[#EAE1D3] text-[11px] text-[#918579] leading-relaxed">
            <span className="font-semibold text-[#332A25]">بيانات الدخول التجريبية:</span>
            <div className="mt-0.5 font-mono text-[10px]">
              admin@luxurywedding.com / AdminPassword2024!
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 rounded-sm font-semibold text-sm tracking-wider uppercase text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <span>{isPending ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>
    </div>
  )
}
