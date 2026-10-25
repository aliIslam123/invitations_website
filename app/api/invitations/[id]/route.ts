import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const invitation = await prisma.weddingInvitation.findUnique({
      where: { id },
      include: {
        couple: true,
        events: { orderBy: { displayOrder: 'asc' } },
        gallery: { orderBy: { displayOrder: 'asc' } },
        timeline: { orderBy: { displayOrder: 'asc' } },
        sections: { orderBy: { displayOrder: 'asc' } },
        rsvpResponses: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!invitation) {
      return NextResponse.json({ error: 'الدعوة غير موجودة' }, { status: 404 })
    }

    return NextResponse.json(invitation)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params
    await prisma.weddingInvitation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const {
      title,
      slug,
      status,
      language,
      direction,
      themeId,
      themeCustom,
      animationPreset,
      coverEnabled,
      coverType,
      coverImage,
      coverMonogram,
      musicEnabled,
      musicUrl,
      musicTitle,
      musicPosition,
      rsvpEnabled,
      rsvpDeadline,
      rsvpMaxGuests,
      rsvpAllowPlusOne,
      rsvpRequireContact,
      rsvpConfirmMsg,
      rsvpDeclineMsg,
      seoTitle,
      seoDescription,
      seoImage,
      whatsappMessage,
      couple,
      events,
      gallery,
      timeline,
      sections,
    } = body

    // Update main invitation
    const updated = await prisma.weddingInvitation.update({
      where: { id },
      data: {
        title,
        slug,
        status,
        language,
        direction,
        themeId,
        themeCustom: typeof themeCustom === 'string' ? themeCustom : (themeCustom ? JSON.stringify(themeCustom) : null),
        animationPreset,
        coverEnabled,
        coverType,
        coverImage,
        coverMonogram,
        musicEnabled,
        musicUrl,
        musicTitle,
        musicPosition,
        rsvpEnabled,
        rsvpDeadline: rsvpDeadline && !isNaN(new Date(rsvpDeadline).getTime()) ? new Date(rsvpDeadline) : null,
        rsvpMaxGuests: rsvpMaxGuests && !isNaN(parseInt(rsvpMaxGuests)) ? parseInt(rsvpMaxGuests) : null,
        rsvpAllowPlusOne,
        rsvpRequireContact,
        rsvpConfirmMsg,
        rsvpDeclineMsg,
        seoTitle,
        seoDescription,
        seoImage,
        whatsappMessage,
      },
    })

    // Upsert Couple info
    if (couple) {
      await prisma.coupleInformation.upsert({
        where: { invitationId: id },
        create: {
          invitationId: id,
          brideFirstName: couple.brideFirstName || '',
          brideLastName: couple.brideLastName || '',
          brideFullName: couple.brideFullName || '',
          brideFather: couple.brideFather || null,
          brideMother: couple.brideMother || null,
          brideBio: couple.brideBio || null,
          bridePhoto: couple.bridePhoto || null,

          groomFirstName: couple.groomFirstName || '',
          groomLastName: couple.groomLastName || '',
          groomFullName: couple.groomFullName || '',
          groomFather: couple.groomFather || null,
          groomMother: couple.groomMother || null,
          groomBio: couple.groomBio || null,
          groomPhoto: couple.groomPhoto || null,

          couplePhoto: couple.couplePhoto || null,
          monogram: couple.monogram || null,
          weddingDate: couple.weddingDate && !isNaN(new Date(couple.weddingDate).getTime()) ? new Date(couple.weddingDate) : null,
          weddingTime: couple.weddingTime || null,
          timezone: couple.timezone || 'Asia/Riyadh',

          messageHeading: couple.messageHeading || null,
          messageBody: couple.messageBody || null,
          heroLayout: couple.heroLayout || 'cinematic',
          heroImage: couple.heroImage || null,
          heroImageMobile: couple.heroImageMobile || null,

          invitationText: couple.invitationText || null,
          invitationSubtext: couple.invitationSubtext || null,
          familyNamesEnabled: Boolean(couple.familyNamesEnabled),
          familyNamesContent: couple.familyNamesContent || null,
          dressCodeEnabled: Boolean(couple.dressCodeEnabled),
          dressCodeContent: couple.dressCodeContent || null,
          giftInfoEnabled: Boolean(couple.giftInfoEnabled),
          giftInfoContent: couple.giftInfoContent || null,
          contactEnabled: Boolean(couple.contactEnabled),
          contactPhone: couple.contactPhone || null,
          contactWhatsapp: couple.contactWhatsapp || null,
          wishesEnabled: Boolean(couple.wishesEnabled),
          postEventEnabled: Boolean(couple.postEventEnabled),
          postEventMessage: couple.postEventMessage || null,
        },
        update: {
          brideFirstName: couple.brideFirstName || '',
          brideLastName: couple.brideLastName || '',
          brideFullName: couple.brideFullName || '',
          brideFather: couple.brideFather || null,
          brideMother: couple.brideMother || null,
          brideBio: couple.brideBio || null,
          bridePhoto: couple.bridePhoto || null,

          groomFirstName: couple.groomFirstName || '',
          groomLastName: couple.groomLastName || '',
          groomFullName: couple.groomFullName || '',
          groomFather: couple.groomFather || null,
          groomMother: couple.groomMother || null,
          groomBio: couple.groomBio || null,
          groomPhoto: couple.groomPhoto || null,

          couplePhoto: couple.couplePhoto || null,
          monogram: couple.monogram || null,
          weddingDate: couple.weddingDate && !isNaN(new Date(couple.weddingDate).getTime()) ? new Date(couple.weddingDate) : null,
          weddingTime: couple.weddingTime || null,
          timezone: couple.timezone || 'Asia/Riyadh',

          messageHeading: couple.messageHeading || null,
          messageBody: couple.messageBody || null,
          heroLayout: couple.heroLayout || 'cinematic',
          heroImage: couple.heroImage || null,
          heroImageMobile: couple.heroImageMobile || null,

          invitationText: couple.invitationText || null,
          invitationSubtext: couple.invitationSubtext || null,
          familyNamesEnabled: Boolean(couple.familyNamesEnabled),
          familyNamesContent: couple.familyNamesContent || null,
          dressCodeEnabled: Boolean(couple.dressCodeEnabled),
          dressCodeContent: couple.dressCodeContent || null,
          giftInfoEnabled: Boolean(couple.giftInfoEnabled),
          giftInfoContent: couple.giftInfoContent || null,
          contactEnabled: Boolean(couple.contactEnabled),
          contactPhone: couple.contactPhone || null,
          contactWhatsapp: couple.contactWhatsapp || null,
          wishesEnabled: Boolean(couple.wishesEnabled),
          postEventEnabled: Boolean(couple.postEventEnabled),
          postEventMessage: couple.postEventMessage || null,
        },
      })
    }

    // Replace events if provided
    if (Array.isArray(events)) {
      await prisma.weddingEvent.deleteMany({ where: { invitationId: id } })
      for (const [idx, ev] of events.entries()) {
        await prisma.weddingEvent.create({
          data: {
            invitationId: id,
            title: ev.title || 'فعالية بدون عنوان',
            date: ev.date && !isNaN(new Date(ev.date).getTime()) ? new Date(ev.date) : new Date(),
            startTime: ev.startTime || null,
            endTime: ev.endTime || null,
            venueName: ev.venueName || null,
            address: ev.address || null,
            mapsUrl: ev.mapsUrl || null,
            latitude: typeof ev.latitude === 'number' && !isNaN(ev.latitude) ? ev.latitude : (ev.latitude && !isNaN(parseFloat(ev.latitude)) ? parseFloat(ev.latitude) : null),
            longitude: typeof ev.longitude === 'number' && !isNaN(ev.longitude) ? ev.longitude : (ev.longitude && !isNaN(parseFloat(ev.longitude)) ? parseFloat(ev.longitude) : null),
            venueImage: ev.venueImage || null,
            description: ev.description || null,
            dressCode: ev.dressCode || null,
            notes: (() => {
              const flags = []
              if (ev.showLocationCard === false) flags.push('hideLocation')
              if (ev.showDressCode === false) flags.push('hideDressCode')
              const baseNotes = (ev.notes || '').split(',').filter((f: string) => f && f !== 'hideLocation' && f !== 'hideDressCode')
              const combined = [...flags, ...baseNotes]
              return combined.length > 0 ? combined.join(',') : null
            })(),
            displayOrder: idx,
            isVisible: ev.isVisible ?? true,
          },
        })
      }
    }

    // Replace gallery if provided
    if (Array.isArray(gallery)) {
      await prisma.galleryImage.deleteMany({ where: { invitationId: id } })
      for (const [idx, img] of gallery.entries()) {
        if (img && (img.url || img.imageUrl)) {
          await prisma.galleryImage.create({
            data: {
              invitationId: id,
              url: img.url || img.imageUrl,
              thumbnailUrl: img.thumbnailUrl || null,
              caption: img.caption || null,
              altText: img.altText || null,
              displayOrder: idx,
              isVisible: img.isVisible ?? true,
            },
          })
        }
      }
    }

    // Replace timeline if provided
    if (Array.isArray(timeline)) {
      await prisma.timelineItem.deleteMany({ where: { invitationId: id } })
      for (const [idx, tm] of timeline.entries()) {
        if (tm && tm.title) {
          await prisma.timelineItem.create({
            data: {
              invitationId: id,
              title: tm.title,
              time: tm.time || null,
              description: tm.description || null,
              icon: tm.icon || null,
              displayOrder: idx,
              isVisible: tm.isVisible ?? true,
            },
          })
        }
      }
    }

    // Replace sections if provided
    if (Array.isArray(sections)) {
      await prisma.invitationSection.deleteMany({ where: { invitationId: id } })
      for (const [idx, sec] of sections.entries()) {
        await prisma.invitationSection.create({
          data: {
            invitationId: id,
            sectionKey: sec.sectionKey,
            displayOrder: idx,
            isVisible: sec.isVisible ?? true,
            layout: sec.layout || null,
            settings: sec.settings ? JSON.stringify(sec.settings) : null,
          },
        })
      }
    }

    // Fetch complete updated invitation with all nested relations
    const fullUpdated = await prisma.weddingInvitation.findUnique({
      where: { id },
      include: {
        couple: true,
        events: { orderBy: { displayOrder: 'asc' } },
        gallery: { orderBy: { displayOrder: 'asc' } },
        timeline: { orderBy: { displayOrder: 'asc' } },
        sections: { orderBy: { displayOrder: 'asc' } },
        rsvpResponses: { orderBy: { createdAt: 'desc' } },
      },
    })

    // Instant cache revalidation across the platform
    try {
      if (fullUpdated) {
        revalidatePath(`/wedding/${fullUpdated.slug}`, 'page')
        revalidatePath(`/dashboard/invitations/edit/${id}`, 'page')
      }
      if (slug && slug !== fullUpdated?.slug) {
        revalidatePath(`/wedding/${slug}`, 'page')
      }
      revalidatePath('/dashboard/invitations', 'page')
      revalidatePath('/dashboard', 'page')
      revalidatePath('/', 'layout')
    } catch (e) {
      console.warn('Revalidation notice:', e)
    }

    return NextResponse.json({ success: true, invitation: fullUpdated })
  } catch (err: any) {
    console.error('Error saving invitation:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
