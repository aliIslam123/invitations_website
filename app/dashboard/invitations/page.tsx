import React from 'react'
import { prisma } from '@/lib/db'
import { InvitationsClientList } from '@/components/dashboard/InvitationsClientList'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InvitationsPage() {
  const invitations = await prisma.weddingInvitation.findMany({
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const serializedInvitations = JSON.parse(JSON.stringify(invitations))

  return <InvitationsClientList initialInvitations={serializedInvitations} siteUrl={siteUrl} />
}
