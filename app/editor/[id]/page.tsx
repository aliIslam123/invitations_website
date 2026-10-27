import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { LiveVisualBuilder } from '@/components/editor/LiveVisualBuilder'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditorPage({ params }: PageProps) {
  const session = await getSession()
  if (!session) {
    const { id } = await params
    redirect(`/auth/sign-in?returnTo=/editor/${id}`)
  }

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

  // Enforce server-side authorization: user must own the invitation or be ADMIN
  if (invitation.userId !== session.userId && session.role !== 'ADMIN') {
    redirect('/dashboard?error=unauthorized')
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://invitations-website-rust.vercel.app'

  const serializedInvitation = JSON.parse(JSON.stringify(invitation))

  return <LiveVisualBuilder initialInvitation={serializedInvitation} siteUrl={siteUrl} />
}
