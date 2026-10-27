import React from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { CreationWizard } from '@/components/dashboard/CreationWizard'

export const dynamic = 'force-dynamic'

export default async function CreateInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/sign-in?returnTo=/dashboard/invitations/create')
  }

  const { theme } = await searchParams

  return (
    <div className="space-y-6" dir="rtl">
      <div className="border-b border-[#EAE1D3] pb-4">
        <h1 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
          معالج إنشاء دعوة زفاف جديدة
        </h1>
        <p className="text-xs text-[#918579] mt-0.5">
          خطوات إرشادية ميسرة لبناء بطاقة دعوة متكاملة خلال دقائق
        </p>
      </div>

      <CreationWizard initialThemeId={theme} />
    </div>
  )
}
