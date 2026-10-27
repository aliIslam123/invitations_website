import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'غير مصرح لك بالقيام بهذا الإجراء' }, { status: 403 })
    }

    const { id } = await params
    const { status } = await req.json()

    if (status !== 'PUBLISHED' && status !== 'DRAFT' && status !== 'SUSPENDED') {
      return NextResponse.json({ error: 'حالة الدعوة غير صالحة' }, { status: 400 })
    }

    // Safety: ensure default flagship invitation is never disabled
    const current = await prisma.weddingInvitation.findUnique({
      where: { id },
      select: { slug: true },
    })

    if (!current) {
      return NextResponse.json({ error: 'الدعوة غير موجودة' }, { status: 404 })
    }

    if (current.slug === 'mohamed-and-asmaa' && status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'لا يمكن تعطيل أو إيقاف الدعوة النموذجية لمحمد وأسماء' },
        { status: 400 }
      )
    }

    const updated = await prisma.weddingInvitation.update({
      where: { id },
      data: { status },
      select: { id: true, slug: true, status: true },
    })

    revalidatePath(`/wedding/${updated.slug}`)
    revalidatePath('/admin')
    revalidatePath('/dashboard/invitations')
    revalidatePath('/dashboard')

    return NextResponse.json({ success: true, invitation: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
