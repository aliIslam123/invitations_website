import React from 'react'
import { prisma } from '@/lib/db'
import { RSVPClientManager } from '@/components/dashboard/RSVPClientManager'

export default async function RSVPPage({
  searchParams,
}: {
  searchParams: Promise<{ invitationId?: string }>
}) {
  const { invitationId } = await searchParams

  const whereClause = invitationId ? { invitationId } : {}

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

  return <RSVPClientManager initialResponses={responses as any} />
}
