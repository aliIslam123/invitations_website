import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { InvitationsClientList } from '@/components/dashboard/InvitationsClientList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InvitationsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/auth/sign-in?returnTo=/dashboard/invitations')
  }

  let serializedInvitations: any[] = []
  try {
    const whereClause = session.role === 'ADMIN' ? {} : { userId: session.userId }

    const invitations = await prisma.weddingInvitation.findMany({
      where: whereClause,
      orderBy: { updatedAt: 'desc' },
      include: {
        couple: true,
        _count: {
          select: {
            rsvpResponses: true,
            events: true,
          },
        },
      },
    })
    serializedInvitations = JSON.parse(JSON.stringify(invitations))
  } catch (err) {
    console.error('Error fetching invitations:', err)
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://invitations-website-rust.vercel.app'

  return <InvitationsClientList initialInvitations={serializedInvitations} siteUrl={siteUrl} />
}
