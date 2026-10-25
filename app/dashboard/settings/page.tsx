import React from 'react'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { SettingsClientForm } from '@/components/dashboard/SettingsClientForm'

export default async function SettingsPage() {
  const session = await getSession()

  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  if (!user) {
    return <div>المستخدم غير موجود</div>
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#EAE1D3] pb-4">
        <h2 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
          الإعدادات والأمان
        </h2>
        <p className="text-xs text-[#918579] mt-0.5">
          إدارة الملف الشخصي، تغيير كلمة المرور، وإعدادات النظام
        </p>
      </div>

      <SettingsClientForm user={user} />
    </div>
  )
}
