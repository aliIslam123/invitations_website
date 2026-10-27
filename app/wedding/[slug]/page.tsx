import React from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { InvitationRenderer } from '@/components/invitation/InvitationRenderer'
import { getInvitationUrl } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Generate dynamic SEO & Open Graph metadata.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
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

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
        ? process.env.NEXT_PUBLIC_SITE_URL
        : 'https://invitations-website-rust.vercel.app'
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
  } catch (err) {
    return {
      title: 'دعوة زفاف خاصة | Luxury Wedding',
      description: 'منصة دعوات الزفاف الرقمية الفاخرة',
    }
  }
}

/**
 * Public Invitation Page Component.
 */
export default async function PublicWeddingPage({ params }: PageProps) {
  const { slug } = await params

  let invitation = null
  let dbError: string | null = null

  try {
    invitation = await prisma.weddingInvitation.findUnique({
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
  } catch (err: any) {
    console.error('Error fetching invitation from database:', err)
    dbError = err?.message || 'Database connection error'
  }

  // If database tables are not initialized yet, offer 1-click auto-setup screen
  if (dbError) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#FAF7F0] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 bg-white rounded-lg border border-[#C8A96B] shadow-xl space-y-5">
          <div className="w-16 h-16 rounded-full mx-auto border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] bg-[#FAF7F0] text-2xl font-bold">
            ✨
          </div>
          <h2 className="text-xl font-serif-luxury font-bold text-[#332A25]">
            تفعيل قاعدة البيانات لأول مرة
          </h2>
          <p className="text-xs text-[#918579] leading-relaxed">
            تم نشر الموقع بنجاح، لكن قاعدة البيانات بحاجة إلى تفعيل أولي لإنشاء الجداول وحفظ الدعوات.
          </p>
          <a
            href="/api/setup"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-md w-full"
          >
            <span>اضغط هنا لتفعيل قاعدة البيانات (1-Click Setup) 🚀</span>
          </a>
        </div>
      </div>
    )
  }

  // Suspended invitation screen
  if (invitation && invitation.status === 'SUSPENDED') {
    return (
      <div dir="rtl" className="min-h-screen bg-[#1F1915] text-[#FAF7F0] flex items-center justify-center p-6 text-center font-sans-arabic">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#2A221C] border border-[#C8A96B]/30 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full mx-auto border border-red-500/30 bg-red-500/10 flex items-center justify-center text-2xl text-red-400">
            ⛔
          </div>
          <h2 className="text-xl font-bold font-serif-luxury text-white">
            الدعوة موقوفة مؤقتاً
          </h2>
          <p className="text-xs text-[#D1C7BD] leading-relaxed">
            تم إيقاف هذه الدعوة مؤقتاً من قِبل إدارة المنصة. إذا كنت صاحب الدعوة يرجى مراجعة لوحة الإدارة أو التواصل مع الدعم الفني.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#C8A96B] hover:bg-[#A68648] transition-colors shadow-md"
            >
              الذهاب إلى الصفحة الرئيسية
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Only published invitations are visible to the public
  if (!invitation || invitation.status !== 'PUBLISHED') {
    notFound()
  }

  return <InvitationRenderer invitation={invitation as any} />
}
