'use client'

import { useEffect } from 'react'
import { Sparkles, RefreshCw, LayoutDashboard } from 'lucide-react'

export default function DashboardError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error boundary caught:', error)
  }, [error])

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
      ? error
      : 'حدث خطأ غير متوقع داخل لوحة التحكم.'

  return (
    <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-lg border border-[#EAE1D3] shadow-md text-center space-y-6">
      <div className="w-14 h-14 rounded-full bg-[#FAF7F0] border border-[#C8A96B] mx-auto flex items-center justify-center text-[#C8A96B]">
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-lg font-bold text-[#332A25]">
          حدث خطأ أثناء تحميل لوحة التحكم
        </h3>
        <p className="text-xs text-[#918579] leading-relaxed">
          جميع بياناتك محفوظة في قاعدة البيانات بأمان. اضغط على إعادة المحاولة لإعادة تنشيط الصفحة.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50/80 border border-red-200/60 rounded text-[11px] text-red-800 text-right font-mono overflow-auto max-h-24">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => {
            if (typeof retry === 'function') retry()
            else window.location.reload()
          }}
          className="px-5 py-2 rounded text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>إعادة المحاولة</span>
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = '/dashboard/invitations'
          }}
          className="px-4 py-2 rounded text-xs font-semibold text-[#332A25] bg-[#FAF7F0] hover:bg-[#EAE1D3] transition-colors border border-[#EAE1D3] flex items-center gap-2 cursor-pointer"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>قائمة الدعوات</span>
        </button>
      </div>
    </div>
  )
}
