'use client'

import React, { useState } from 'react'
import { Lock, Save, ShieldCheck, Check, Globe, Server } from 'lucide-react'

interface SettingsClientFormProps {
  user: {
    id: string
    email: string
    name: string | null
    role: string
  }
}

export function SettingsClientForm({ user }: SettingsClientFormProps) {
  const [name, setName] = useState(user.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ text: 'كلمة المرور الجديدة غير متطابقة', isError: true })
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage({ text: 'تم تحديث البيانات بنجاح!', isError: false })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ text: data.error || 'فشل التحديث.', isError: true })
      }
    } catch {
      setMessage({ text: 'حدث خطأ أثناء حفظ الإعدادات.', isError: true })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {message && (
        <div
          className={`p-3.5 rounded text-xs font-semibold ${
            message.isError
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Account Info Form */}
      <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-sm border border-[#EAE1D3] shadow-xs space-y-5">
        <div className="border-b border-[#EAE1D3] pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif-luxury font-bold text-[#332A25]">
              بيانات حساب المسؤول (Administrator)
            </h3>
            <p className="text-xs text-[#918579]">تعديل الاسم وكلمة مرور تسجيل الدخول</p>
          </div>
          <ShieldCheck className="w-6 h-6 text-[#C8A96B]" />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-[#332A25]">البريد الإلكتروني</label>
          <input
            type="email"
            disabled
            value={user.email}
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] bg-[#FAF7F0] text-xs text-[#918579] cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-[#332A25]">اسم العرض</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:border-[#C8A96B]"
          />
        </div>

        {/* Change Password Block */}
        <div className="pt-4 border-t border-[#EAE1D3] space-y-4">
          <span className="text-xs font-bold text-[#332A25] block">
            تغيير كلمة المرور (اتركه فارغاً إذا كنت لا ترغب بالتغيير)
          </span>

          <div>
            <label className="block text-xs font-semibold mb-1 text-[#332A25]">
              كلمة المرور الحالية
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:border-[#C8A96B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1 text-[#332A25]">
                تأكيد كلمة المرور الجديدة
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-sm border border-[#EAE1D3] text-sm focus:border-[#C8A96B]"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-sm text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
        </button>
      </form>
    </div>
  )
}
