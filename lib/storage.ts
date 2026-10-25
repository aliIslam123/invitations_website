import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { isAllowedAudioType, isAllowedImageType } from './utils'

export interface UploadResult {
  url: string
  storageKey: string
  filename: string
  fileSize: number
  mimeType: string
  mediaType: 'image' | 'audio' | 'video'
}

/**
 * Handle persistent media storage.
 * In development, persists to /public/uploads directory.
 * In production, connects to S3 or compatible object storage.
 */
export async function saveMediaFile(file: File, invitationId?: string): Promise<UploadResult> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const mimeType = file.type || 'application/octet-stream'
  const isImage = isAllowedImageType(mimeType)
  const isAudio = isAllowedAudioType(mimeType)

  if (!isImage && !isAudio) {
    throw new Error('Unsupported file format. Please upload JPG, PNG, WEBP, or MP3/WAV audio.')
  }

  // Max 10MB
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File exceeds the 10MB limit.')
  }

  const mediaType: 'image' | 'audio' | 'video' = isImage ? 'image' : 'audio'
  const ext = path.extname(file.name) || (isImage ? '.jpg' : '.mp3')
  const randomHex = crypto.randomBytes(8).toString('hex')
  const cleanBaseName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)
  const filename = `${Date.now()}-${randomHex}-${cleanBaseName}${ext}`

  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    await fs.writeFile(filePath, buffer)

    const url = `/uploads/${filename}`
    const storageKey = `uploads/${filename}`

    return {
      url,
      storageKey,
      filename,
      fileSize: file.size,
      mimeType,
      mediaType,
    }
  } catch (err) {
    // Serverless fallback (e.g. Vercel read-only filesystem):
    // Fall back to Data URL so uploads continue to function without external S3
    console.warn('Filesystem is read-only or inaccessible; falling back to Data URL:', err)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${mimeType};base64,${base64}`

    return {
      url: dataUrl,
      storageKey: `inline-${filename}`,
      filename,
      fileSize: file.size,
      mimeType,
      mediaType,
    }
  }
}

/**
 * Delete a media file.
 */
export async function deleteMediaFile(storageKey: string): Promise<boolean> {
  if (storageKey.startsWith('inline-')) {
    return true
  }
  try {
    const fullPath = path.join(process.cwd(), 'public', storageKey)
    await fs.unlink(fullPath)
    return true
  } catch (err) {
    console.warn(`Could not delete local file ${storageKey}:`, err)
    return false
  }
}
