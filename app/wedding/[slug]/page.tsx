import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer'
import { getInvitationUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Generate dynamic SEO & Open Graph metadata.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const invitation = await prisma.weddingInvitation.findUnique({
    where: { slug },
    include: {
      couple: true,
    },
  })

  if (!invitation || invitation.status !== 'PUBLISHED') {
    return {
      title: 'دعوة زفاف غير متوفرة',
      description: 'هذه الدعوة غير متاحة حالياً.',
    }
  }

  const couple = invitation.couple
  const bride = couple?.brideFullName || couple?.brideFirstName || 'العروس'
  const groom = couple?.groomFullName || couple?.groomFirstName || 'العريس'

  const title =
    invitation.seoTitle ||
    invitation.title ||
    `دعوة زفاف ${bride} و ${groom} | Wedding Invitation`

  const description =
    invitation.seoDescription ||
    `يسعدنا ويشرفنا دعوتكم لحضور حفل زفاف ${bride} و ${groom} ومشاركتنا فرحتنا.`

  const imageUrl =
    invitation.seoImage ||
    invitation.coverImage ||
    couple?.heroImage ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pageUrl = getInvitationUrl(slug, siteUrl)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Luxury Wedding Invitations',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${bride} & ${groom}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

/**
 * Public Invitation Page Component.
 */
export default async function PublicWeddingPage({ params }: PageProps) {
  const { slug } = await params

  const invitation = await prisma.weddingInvitation.findUnique({
    where: { slug },
    include: {
      couple: true,
      events: {
        orderBy: { displayOrder: 'asc' },
      },
      gallery: {
        orderBy: { displayOrder: 'asc' },
      },
      timeline: {
        orderBy: { displayOrder: 'asc' },
      },
      sections: {
        orderBy: { displayOrder: 'asc' },
      },
    },
  })

  // Only published invitations are visible to the public
  if (!invitation || invitation.status !== 'PUBLISHED') {
    notFound()
  }

  return <InvitationRenderer invitation={invitation as any} />
}
