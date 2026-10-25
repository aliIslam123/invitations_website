'use client'

import { useEffect } from 'react'
import { Heart, RefreshCw } from 'lucide-react'

export default function WeddingInvitationError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => {
    console.error('Public wedding invitation error caught:', error)
  }, [error])

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 bg-white/90 backdrop-blur-md rounded-lg border border-[#C8A96B]/40 shadow-xl space-y-5">
        <div className="w-16 h-16 rounded-full mx-auto border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] bg-[#FAF7F0]">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <h2 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
          دعوة زفاف خاصة
        </h2>
        <p className="text-xs text-[#918579] leading-relaxed">
          نعتذر عن هذا التأخير البسيط، جاري استعادة تفاصيل بطاقة الدعوة...
        </p>
        <button
          type="button"
          onClick={() => {
            if (typeof retry === 'function') retry()
            else window.location.reload()
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تحديث الدعوة</span>
        </button>
      </div>
    </div>
  )
}
