import React from 'react'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { RSVPClientManager } from '@/components/dashboard/RSVPClientManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function RSVPPage({
  searchParams,
}: {
  searchParams: Promise<{ invitationId?: string }>
}) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/sign-in?returnTo=/dashboard/rsvp')
  }

  const { invitationId } = await searchParams

  const whereClause: any = {}
  if (session.role !== 'ADMIN') {
    whereClause.invitation = { userId: session.userId }
  }
  if (invitationId) {
    whereClause.invitationId = invitationId
  }

  const responses = await prisma.rSVPResponse.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      invitation: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
    },
  })

  return <RSVPClientManager initialResponses={JSON.parse(JSON.stringify(responses))} />
}
