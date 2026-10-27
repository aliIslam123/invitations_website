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
      return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })
    }

    const { id } = await params
    const { status } = await req.json()

    if (status !== 'PUBLISHED' && status !== 'DRAFT') {
      return NextResponse.json({ error: 'حالة غير صالحة' }, { status: 400 })
    }

    const updated = await prisma.weddingInvitation.update({
      where: { id },
      data: { status },
      select: { id: true, slug: true, status: true },
    })

    revalidatePath(`/wedding/${updated.slug}`)
    revalidatePath('/admin')
    revalidatePath('/dashboard/invitations')

    return NextResponse.json({ success: true, invitation: updated })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
