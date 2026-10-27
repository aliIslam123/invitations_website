import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.weddingInvitation.findUnique({
      where: { id },
      select: { id: true, userId: true, status: true },
    })

    if (!existing) {
      return NextResponse.json({ error: 'الدعوة غير موجودة' }, { status: 404 })
    }

    if (existing.userId !== session.userId && session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بتعديل حالة هذه الدعوة' }, { status: 403 })
    }

    if (existing.status === 'SUSPENDED' && session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'تم إيقاف هذه الدعوة من قِبل إدارة المنصة. يرجى التواصل مع الإدارة لإعادة تفعيلها.' },
        { status: 403 }
      )
    }

    const { status } = await req.json()

    if (!['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 })
    }

    const updated = await prisma.weddingInvitation.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, invitation: updated })
  } catch (err: any) {
    console.error('Error updating status:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
