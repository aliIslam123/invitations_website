import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params

    const existing = await prisma.weddingInvitation.findUnique({
      where: { id },
      select: { id: true, slug: true },
    })

    if (!existing) {
      return NextResponse.json({ error: 'الدعوة غير موجودة' }, { status: 404 })
    }

    // Absolute protection for Mohamed & Asmaa
    if (existing.slug === 'mohamed-and-asmaa') {
      return NextResponse.json({ error: 'لا يمكن حذف الدعوة النموذجية لمحمد وأسماء' }, { status: 400 })
    }

    await prisma.weddingInvitation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
