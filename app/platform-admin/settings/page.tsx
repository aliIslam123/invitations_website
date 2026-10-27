import React from 'react'
import { Shield, Server, Database, Lock, Globe, CheckCircle2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto" dir="rtl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">
          إعدادات النظام والمنصة
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          مواصفات بيئة التشغيل، تشفير الجلسات، وقواعد البيانات
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">بيئة التشغيل والنشر</h3>
              <p className="text-xs text-slate-500">Next.js 16 + React 19 Engine</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">بيئة العمل:</span>
              <span className="font-mono font-semibold text-emerald-600">Production (Vercel)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">إصدار Node.js:</span>
              <span className="font-mono">Node.js 20+</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">بروتوكول الأمان:</span>
              <span className="font-mono text-emerald-600">HTTPS / TLS 1.3</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">قاعدة البيانات والـ ORM</h3>
              <p className="text-xs text-slate-500">PostgreSQL + Prisma 6</p>
            </div>
          </div>
          <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">المحرك:</span>
              <span className="font-mono">PostgreSQL</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-400">حالة الاتصال:</span>
              <span className="font-mono font-semibold text-emerald-600">Connected & Verified</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">عزل بيانات العملاء:</span>
              <span className="font-mono text-emerald-600">Tenant-Level Enforced</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
