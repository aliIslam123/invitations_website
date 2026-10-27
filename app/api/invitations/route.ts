import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = session.role === 'ADMIN' ? {} : { userId: session.userId }
    if (status) {
      where.status = status
    }

    const invitations = await prisma.weddingInvitation.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        couple: true,
        _count: {
          select: { rsvpResponses: true, events: true },
        },
      },
    })

    return NextResponse.json(invitations)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const body = await req.json()
    const {
      title,
      slug,
      status,
      language,
      direction,
      themeId,
      animationPreset,
      coverEnabled,
      coverType,
      coverImage,
      coverMonogram,
      musicEnabled,
      musicUrl,
      musicTitle,
      rsvpEnabled,
      rsvpDeadline,
      rsvpMaxGuests,
      rsvpAllowPlusOne,
      seoTitle,
      seoDescription,
      whatsappMessage,
      couple,
      events,
      sections,
    } = body

    // Ensure slug is unique
    let finalSlug = slug
    const existing = await prisma.weddingInvitation.findUnique({
      where: { slug: finalSlug },
    })

    if (existing) {
      finalSlug = `${slug}-${Date.now().toString().slice(-4)}`
    }

    const invitation = await prisma.weddingInvitation.create({
      data: {
        userId: session.userId,
        slug: finalSlug,
        status: status || 'DRAFT',
        title: title || 'دعوة زفاف جديدة',
        language: language || 'ar',
        direction: direction || 'rtl',
        themeId: themeId || 'royal-champagne',
        animationPreset: animationPreset || 'elegant',
        coverEnabled: coverEnabled ?? true,
        coverType: coverType || 'cinematic',
        coverImage: coverImage || null,
        coverMonogram: coverMonogram || null,
        musicEnabled: Boolean(musicEnabled),
        musicUrl: musicUrl || null,
        musicTitle: musicTitle || null,
        rsvpEnabled: Boolean(rsvpEnabled),
        rsvpDeadline: rsvpDeadline ? new Date(rsvpDeadline) : null,
        rsvpMaxGuests: rsvpMaxGuests ? parseInt(rsvpMaxGuests) : 4,
        rsvpAllowPlusOne: rsvpAllowPlusOne ?? true,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        whatsappMessage: whatsappMessage || null,

        // Create couple info
        couple: couple
          ? {
              create: {
                brideFirstName: couple.brideFirstName || '',
                brideLastName: couple.brideLastName || '',
                brideFullName: couple.brideFullName || '',
                groomFirstName: couple.groomFirstName || '',
                groomLastName: couple.groomLastName || '',
                groomFullName: couple.groomFullName || '',
                weddingDate: couple.weddingDate ? new Date(couple.weddingDate) : null,
                weddingTime: couple.weddingTime || null,
                timezone: couple.timezone || 'Asia/Riyadh',
                heroLayout: couple.heroLayout || 'cinematic',
                heroImage: couple.heroImage || null,
                messageHeading: couple.messageHeading || null,
                messageBody: couple.messageBody || null,
                invitationText: couple.invitationText || null,
              },
            }
          : undefined,

        // Create initial events
        events: Array.isArray(events)
          ? {
              create: events.map((ev, idx) => ({
                title: ev.title || 'حفل الزفاف',
                date: ev.date ? new Date(ev.date) : new Date(),
                startTime: ev.startTime || null,
                venueName: ev.venueName || null,
                address: ev.address || null,
                mapsUrl: ev.mapsUrl || null,
                displayOrder: idx,
                isVisible: true,
              })),
            }
          : undefined,

        // Create default sections
        sections: Array.isArray(sections)
          ? {
              create: sections.map((sec, idx) => ({
                sectionKey: sec.sectionKey,
                displayOrder: idx,
                isVisible: sec.isVisible ?? true,
              })),
            }
          : undefined,
      },
    })

    return NextResponse.json({ success: true, id: invitation.id, slug: invitation.slug })
  } catch (err: any) {
    console.error('Error creating invitation:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
