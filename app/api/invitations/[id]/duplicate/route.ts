import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params

    const source = await prisma.weddingInvitation.findUnique({
      where: { id },
      include: {
        couple: true,
        events: true,
        gallery: true,
        timeline: true,
        sections: true,
      },
    })

    if (!source) {
      return NextResponse.json({ error: 'الدعوة غير موجودة' }, { status: 404 })
    }

    // Generate unique slug
    const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`

    const newInvitation = await prisma.weddingInvitation.create({
      data: {
        userId: session.userId,
        slug: newSlug,
        status: 'DRAFT',
        title: `${source.title} (نسخة)`,
        language: source.language,
        direction: source.direction,
        coverEnabled: source.coverEnabled,
        coverType: source.coverType,
        coverImage: source.coverImage,
        coverOverlayColor: source.coverOverlayColor,
        coverOverlayOpacity: source.coverOverlayOpacity,
        coverMonogram: source.coverMonogram,
        themeId: source.themeId,
        themeCustom: source.themeCustom,
        animationPreset: source.animationPreset,
        seoTitle: source.seoTitle,
        seoDescription: source.seoDescription,
        seoImage: source.seoImage,
        whatsappMessage: source.whatsappMessage,
        musicEnabled: source.musicEnabled,
        musicUrl: source.musicUrl,
        musicTitle: source.musicTitle,
        musicAutoplay: source.musicAutoplay,
        musicPosition: source.musicPosition,
        rsvpEnabled: source.rsvpEnabled,
        rsvpDeadline: source.rsvpDeadline,
        rsvpMaxGuests: source.rsvpMaxGuests,
        rsvpAllowPlusOne: source.rsvpAllowPlusOne,
        rsvpRequireContact: source.rsvpRequireContact,
        rsvpConfirmMsg: source.rsvpConfirmMsg,
        rsvpDeclineMsg: source.rsvpDeclineMsg,

        // Duplicate couple
        couple: source.couple
          ? {
              create: {
                brideFirstName: source.couple.brideFirstName,
                brideLastName: source.couple.brideLastName,
                brideFullName: source.couple.brideFullName,
                brideFather: source.couple.brideFather,
                brideMother: source.couple.brideMother,
                brideFamily: source.couple.brideFamily,
                brideBio: source.couple.brideBio,
                bridePhoto: source.couple.bridePhoto,

                groomFirstName: source.couple.groomFirstName,
                groomLastName: source.couple.groomLastName,
                groomFullName: source.couple.groomFullName,
                groomFather: source.couple.groomFather,
                groomMother: source.couple.groomMother,
                groomFamily: source.couple.groomFamily,
                groomBio: source.couple.groomBio,
                groomPhoto: source.couple.groomPhoto,

                couplePhoto: source.couple.couplePhoto,
                monogram: source.couple.monogram,
                weddingDate: source.couple.weddingDate,
                weddingTime: source.couple.weddingTime,
                timezone: source.couple.timezone,

                messageHeading: source.couple.messageHeading,
                messageBody: source.couple.messageBody,
                heroLayout: source.couple.heroLayout,
                heroImage: source.couple.heroImage,
                heroImageMobile: source.couple.heroImageMobile,

                invitationText: source.couple.invitationText,
                invitationSubtext: source.couple.invitationSubtext,
                familyNamesEnabled: source.couple.familyNamesEnabled,
                familyNamesContent: source.couple.familyNamesContent,
                dressCodeEnabled: source.couple.dressCodeEnabled,
                dressCodeContent: source.couple.dressCodeContent,
                giftInfoEnabled: source.couple.giftInfoEnabled,
                giftInfoContent: source.couple.giftInfoContent,
                contactEnabled: source.couple.contactEnabled,
                contactPhone: source.couple.contactPhone,
                contactWhatsapp: source.couple.contactWhatsapp,
                wishesEnabled: source.couple.wishesEnabled,
                postEventEnabled: source.couple.postEventEnabled,
                postEventMessage: source.couple.postEventMessage,
              },
            }
          : undefined,

        // Duplicate events
        events: {
          create: source.events.map((e) => ({
            title: e.title,
            date: e.date,
            startTime: e.startTime,
            endTime: e.endTime,
            timezone: e.timezone,
            venueName: e.venueName,
            address: e.address,
            mapsUrl: e.mapsUrl,
            latitude: e.latitude,
            longitude: e.longitude,
            venueImage: e.venueImage,
            description: e.description,
            dressCode: e.dressCode,
            notes: e.notes,
            displayOrder: e.displayOrder,
            isVisible: e.isVisible,
          })),
        },

        // Duplicate gallery
        gallery: {
          create: source.gallery.map((g) => ({
            url: g.url,
            thumbnailUrl: g.thumbnailUrl,
            caption: g.caption,
            altText: g.altText,
            displayOrder: g.displayOrder,
            isVisible: g.isVisible,
          })),
        },

        // Duplicate timeline
        timeline: {
          create: source.timeline.map((t) => ({
            time: t.time,
            title: t.title,
            description: t.description,
            icon: t.icon,
            displayOrder: t.displayOrder,
            isVisible: t.isVisible,
          })),
        },

        // Duplicate sections
        sections: {
          create: source.sections.map((s) => ({
            sectionKey: s.sectionKey,
            displayOrder: s.displayOrder,
            isVisible: s.isVisible,
            layout: s.layout,
            settings: s.settings,
          })),
        },
      },
    })

    return NextResponse.json({ success: true, invitation: newInvitation })
  } catch (err: any) {
    console.error('Error duplicating invitation:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
