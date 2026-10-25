import React from 'react'
import { CreationWizard } from '@/components/dashboard/CreationWizard'

export default function CreateInvitationPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#EAE1D3] pb-4">
        <h1 className="text-2xl font-serif-luxury font-bold text-[#332A25]">
          معالج إنشاء دعوة زفاف جديدة
        </h1>
        <p className="text-xs text-[#918579] mt-0.5">
          خطوات إرشادية ميسرة لبناء بطاقة دعوة متكاملة خلال دقائق
        </p>
      </div>

      <CreationWizard />
    </div>
  )
}
