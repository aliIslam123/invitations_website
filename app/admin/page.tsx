import React from 'react'
import { prisma } from '@/lib/db'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'لوحة التحكم المركزية | Admin Command Portal',
  description: 'إدارة حسابات العملاء والدعوات والتحكم الشامل في المنصة',
}

export default async function AdminMainPage() {
  const [users, totalInvitations, totalPublished, totalRsvps] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        invitations: {
          orderBy: { updatedAt: 'desc' },
          include: {
            couple: true,
            _count: {
              select: { rsvpResponses: true, events: true },
            },
          },
        },
      },
    }),
    prisma.weddingInvitation.count(),
    prisma.weddingInvitation.count({ where: { status: 'PUBLISHED' } }),
    prisma.rSVPResponse.count(),
  ])

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://invitations-website-rust.vercel.app'

  const serializedUsers = JSON.parse(JSON.stringify(users))

  return (
    <AdminDashboardClient
      initialUsers={serializedUsers}
      totalInvitations={totalInvitations}
      totalPublished={totalPublished}
      totalRsvps={totalRsvps}
      siteUrl={siteUrl}
    />
  )
}
