'use client'

import { useEffect } from 'react'
import { Sparkles, RefreshCw, Home, AlertCircle } from 'lucide-react'

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error('Global application error caught:', error)
  }, [error])

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'حدث خطأ غير متوقع أثناء تحميل الصفحة.'

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#FAF7F0] text-[#332A25] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-lg border border-[#EAE1D3] shadow-xl p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F0] border-2 border-[#C8A96B] mx-auto flex items-center justify-center text-[#C8A96B]">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-[#332A25]">
              نعتذر، حدث خطأ غير متوقع
            </h1>
            <p className="text-xs text-[#918579] leading-relaxed">
              تم تسجيل الخطأ بأمان، يمكنك إعادة تحميل الصفحة للمتابعة دون فقدان بياناتك.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50/70 border border-red-200/60 rounded text-[11px] text-red-800 text-right font-mono overflow-auto max-h-32">
              <span className="font-bold block mb-1">تفاصيل الخطأ:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (typeof retry === 'function') {
                  retry()
                } else {
                  window.location.reload()
                }
              }}
              className="px-5 py-2.5 rounded text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة المحاولة</span>
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = '/dashboard'
              }}
              className="px-4 py-2.5 rounded text-xs font-semibold text-[#332A25] bg-[#FAF7F0] hover:bg-[#EAE1D3] transition-colors border border-[#EAE1D3] flex items-center gap-2 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>لوحة التحكم</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
