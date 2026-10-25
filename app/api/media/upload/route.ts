import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { saveMediaFile } from '@/lib/storage'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    // 1. Verify administrator auth
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'غير مصرح لك بالوصول' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const invitationId = formData.get('invitationId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'لم يتم تحديد أي ملف للرفع' }, { status: 400 })
    }

    // 2. Save media file securely
    const upload = await saveMediaFile(file, invitationId || undefined)

    // 3. Record in database
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: upload.filename,
        originalName: file.name,
        mimeType: upload.mimeType,
        fileSize: upload.fileSize,
        url: upload.url,
        storageKey: upload.storageKey,
        mediaType: upload.mediaType,
        invitationId: invitationId || null,
      },
    })

    return NextResponse.json({
      success: true,
      url: upload.url,
      asset,
    })
  } catch (err: any) {
    console.error('Media upload error:', err)
    return NextResponse.json(
      { error: err.message || 'حدث خطأ أثناء رفع الملف' },
      { status: 500 }
    )
  }
}
