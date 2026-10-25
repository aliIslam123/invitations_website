'use client'

import { useEffect } from 'react'
import { Sparkles, RefreshCw, Home } from 'lucide-react'

export default function RootError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error('Root error boundary caught:', error)
  }, [error])

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'حدث خطأ أثناء معالجة الصفحة.'

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF7F0] text-[#332A25] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg border border-[#EAE1D3] shadow-xl p-8 text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#C8A96B] mx-auto flex items-center justify-center text-[#C8A96B]">
          <Sparkles className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-serif-luxury font-bold text-[#332A25]">
            تعذر تحميل المحتوى
          </h2>
          <p className="text-xs text-[#918579] leading-relaxed">
            حدث خطأ عارض أثناء عرض هذه الصفحة. يمكنك الضغط على زر إعادة المحاولة لاستئناف عملك.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50/70 border border-red-200/60 rounded text-[11px] text-red-800 text-right font-mono overflow-auto max-h-28">
            {errorMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (typeof retry === 'function') retry()
              else window.location.reload()
            }}
            className="px-5 py-2.5 rounded text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة المحاولة</span>
          </button>

          <a
            href="/api/setup"
            className="px-4 py-2.5 rounded text-xs font-semibold text-[#332A25] bg-[#FAF7F0] hover:bg-[#EAE1D3] transition-colors border border-[#C8A96B]/50 flex items-center gap-2 cursor-pointer"
          >
            <span>تفعيل قاعدة البيانات (Setup)</span>
          </a>

          <button
            type="button"
            onClick={() => {
              window.location.href = '/dashboard'
            }}
            className="px-4 py-2.5 rounded text-xs font-semibold text-[#73675C] hover:text-[#332A25] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>لوحة التحكم</span>
          </button>
        </div>
      </div>
    </div>
  )
}
