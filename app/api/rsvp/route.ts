import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { rsvpSubmissionSchema } from '@/lib/validations'

// In-memory rate limiting map (IP -> timestamp array)
const rateLimitMap = new Map<string, number[]>()

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
    const now = Date.now()

    // Rate Limiting check (max 5 per minute per IP)
    const timestamps = rateLimitMap.get(ip) || []
    const recent = timestamps.filter((t) => now - t < 60 * 1000)

    if (recent.length >= 5) {
      return NextResponse.json(
        { error: 'لقد أرسلت عدة طلبات في وقت قصير، يرجى الانتظار قليلاً.' },
        { status: 429 }
      )
    }

    rateLimitMap.set(ip, [...recent, now])

    const body = await req.json()
    const parsed = rsvpSubmissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      )
    }

    const { invitationId, guestName, attendance = 'yes', guestCount = 1, phone, email, message, dietary } =
      parsed.data

    // Check invitation status
    const invitation = await prisma.weddingInvitation.findUnique({
      where: { id: invitationId },
      select: {
        id: true,
        rsvpEnabled: true,
      },
    })

    if (!invitation || !invitation.rsvpEnabled) {
      return NextResponse.json(
        { error: 'تأكيد الحضور غير متاح لهذه الدعوة حالياً.' },
        { status: 400 }
      )
    }

    // Save RSVP response
    const rsvp = await prisma.rSVPResponse.create({
      data: {
        invitationId,
        guestName,
        attendance: attendance || 'yes',
        guestCount: guestCount || 1,
        phone,
        email,
        message,
        dietary,
        ipAddress: ip,
      },
    })

    return NextResponse.json({
      success: true,
      id: rsvp.id,
      message: 'تم تسجيل ردكم بنجاح!',
    })
  } catch (err: any) {
    console.error('RSVP submission error:', err)
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء معالجة طلبك.' },
      { status: 500 }
    )
  }
}
