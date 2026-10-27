import React from 'react'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { InvitationManageView } from '@/components/dashboard/InvitationManageView'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ManageInvitationPage({ params }: PageProps) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/sign-in?returnTo=/dashboard/invitations')
  }

  const { id } = await params

  const invitation = await prisma.weddingInvitation.findUnique({
    where: { id },
    include: {
      couple: true,
      events: { orderBy: { displayOrder: 'asc' } },
      rsvpResponses: { orderBy: { createdAt: 'desc' } },
      sections: { orderBy: { displayOrder: 'asc' } },
    },
  })

  if (!invitation) {
    notFound()
  }

  // Authorization enforcement: User must own the invitation, or be an ADMIN
  if (invitation.userId !== session.userId && session.role !== 'ADMIN') {
    notFound()
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://invitations-website-rust.vercel.app'

  const serialized = JSON.parse(JSON.stringify(invitation))

  return <InvitationManageView invitation={serialized} siteUrl={siteUrl} />
}
