import React from 'react'
import Link from 'next/link'
import { getAllThemes } from '@/lib/themes'
import { Palette, Sparkles, Check, ExternalLink, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminTemplatesPage() {
  const templates = getAllThemes()

  return (
    <div className="space-y-8 max-w-7xl mx-auto" dir="rtl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            إدارة مكتبة القوالب الملكية (16 قالباً)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            مراجعة كافة القوالب المعتمدة في النظام، ألوانها، وتنسيقات خطوطها
          </p>
        </div>

        <Link
          href="/templates"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <span>معاينة مكتبة العملاء</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((theme) => {
          const { colors, fonts, sampleData } = theme
          return (
            <div
              key={theme.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Palette banner */}
              <div
                className="h-28 p-4 flex flex-col justify-between border-b"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ backgroundColor: colors.primary, color: '#FFF' }}
                  >
                    {theme.category}
                  </span>
                  <span className="text-[10px] font-mono opacity-70">
                    {theme.id}
                  </span>
                </div>

                <div className="text-center font-bold text-sm" style={{ fontFamily: fonts.arabic }}>
                  {sampleData.groomName} & {sampleData.brideName}
                </div>

                <div className="flex h-1 rounded overflow-hidden">
                  <div className="flex-1" style={{ backgroundColor: colors.primary }} />
                  <div className="flex-1" style={{ backgroundColor: colors.accent }} />
                  <div className="flex-1" style={{ backgroundColor: colors.gold }} />
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {theme.nameAr}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {theme.name}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                    {theme.descriptionAr}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>نشط ومتاح للعملاء</span>
                  </span>

                  <Link
                    href={`/templates/${theme.id}`}
                    target="_blank"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    معاينة
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
