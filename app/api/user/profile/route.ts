import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })
    }

    const { name, currentPassword, newPassword } = await req.json()

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 })
    }

    const dataToUpdate: any = { name }

    // If changing password, verify old password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'يرجى إدخال كلمة المرور الحالية لتأكيد التغيير' },
          { status: 400 }
        )
      }

      if (user.passwordHash) {
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash)
        if (!isValid) {
          return NextResponse.json(
            { error: 'كلمة المرور الحالية غير صحيحة' },
            { status: 400 }
          )
        }
      }

      dataToUpdate.passwordHash = await bcrypt.hash(newPassword, 12)
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: dataToUpdate,
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
