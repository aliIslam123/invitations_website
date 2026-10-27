import React from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CreationWizard } from '@/components/dashboard/CreationWizard'
import { Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function NewInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/sign-in?returnTo=/dashboard/invitations/new')
  }

  const { theme } = await searchParams

  return (
    <div className="space-y-6" dir="rtl">
      <div className="border-b border-[#EAE1D3] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
            معالج إنشاء دعوة زفاف جديدة
          </h1>
          <p className="text-xs text-[#918579] mt-0.5">
            خطوات إرشادية ميسرة لبناء وتخصيص بطاقتكم الملكية بكل التفاصيل
          </p>
        </div>

        {theme && (
          <span className="text-xs bg-[#FAF7F0] border border-[#C8A96B]/40 px-3 py-1 rounded-full text-[#A68648] font-semibold">
            القالب المختار: {theme}
          </span>
        )}
      </div>

      <CreationWizard initialThemeId={theme} />
    </div>
  )
}
