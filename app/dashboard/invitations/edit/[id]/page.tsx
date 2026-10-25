import React from 'react'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { LiveVisualBuilder } from '@/components/editor/LiveVisualBuilder'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function VisualEditorPage({ params }: PageProps) {
  const { id } = await params

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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://invitations-website-rust.vercel.app'

  // Clean JSON serialization to ensure zero Next.js Server->Client prop serialization issues with Dates or DB objects
  const serializedInvitation = JSON.parse(JSON.stringify(invitation))

  return <LiveVisualBuilder initialInvitation={serializedInvitation} siteUrl={siteUrl} />
}
