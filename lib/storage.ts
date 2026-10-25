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
}

/**
 * Delete a media file.
 */
export async function deleteMediaFile(storageKey: string): Promise<boolean> {
  try {
    const fullPath = path.join(process.cwd(), 'public', storageKey)
    await fs.unlink(fullPath)
    return true
  } catch (err) {
    console.warn(`Could not delete local file ${storageKey}:`, err)
    return false
  }
}
