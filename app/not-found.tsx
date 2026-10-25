import React from 'react'
import Link from 'next/navigation'
import { HeartCrack, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{ backgroundColor: '#FAF7F0', color: '#332A25' }}
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-[#C8A96B] mb-6 bg-white shadow-sm">
        <HeartCrack className="w-10 h-10 text-[#C8A96B]" />
      </div>

      <h1 className="text-3xl md:text-4xl font-serif-luxury font-bold mb-3">
        الدعوة غير موجودة أو غير منشورة
      </h1>

      <p className="max-w-md text-sm md:text-base text-[#918579] mb-8 leading-relaxed">
        عذراً، لم نتمكن من العثور على صفحة الدعوة المطلوبة. قد يكون الرابط غير صحيح، أو تم إلغاء نشر الدعوة بواسطة المنظم.
      </p>

      <a
        href="/"
        className="px-6 py-3 rounded-sm text-sm font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-sm inline-flex items-center gap-2"
      >
        <span>العودة للرئيسية</span>
      </a>
    </div>
  )
}
