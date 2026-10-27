import React from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer'
import { ArrowRight, Edit3, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditorPreviewPage({ params }: PageProps) {
  const session = await getSession()
  const { id } = await params

  if (!session) {
    redirect(`/auth/sign-in?returnTo=/editor/${id}/preview`)
  }

  const invitation = await prisma.weddingInvitation.findUnique({
    where: { id },
    include: {
      couple: true,
      events: { orderBy: { displayOrder: 'asc' } },
      gallery: { orderBy: { displayOrder: 'asc' } },
      timeline: { orderBy: { displayOrder: 'asc' } },
      sections: { orderBy: { displayOrder: 'asc' } },
    },
  })

  if (!invitation) {
    notFound()
  }

  if (invitation.userId !== session.userId && session.role !== 'ADMIN') {
    redirect('/dashboard?error=unauthorized')
  }

  const serialized = JSON.parse(JSON.stringify(invitation))

  return (
    <div className="relative min-h-screen">
      {/* Top Floating Preview Bar */}
      <div
        dir="rtl"
        className="fixed top-4 inset-x-4 max-w-2xl mx-auto z-50 bg-[#332A25]/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl border border-white/20 flex items-center justify-between text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">معاينة تفاعلية حية للدعوة</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/editor/${id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A96B] hover:bg-[#A68648] text-white font-semibold transition-colors"
          >
            <Edit3 className="w-3 h-3" />
            <span>العودة للمحرر</span>
          </Link>
          <a
            href={`/wedding/${invitation.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="الرابط العام الحقيقي"
          >
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <InvitationRenderer invitation={serialized} />
    </div>
  )
}
