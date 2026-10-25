import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { Readable } from 'stream'

// MIME type map for supported uploads
const MIME_TYPES: Record<string, string> = {
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params
    const pathSegments = resolvedParams.path || []
    if (pathSegments.length === 0) {
      return new NextResponse('File not found', { status: 404 })
    }

    // Sanitize path to prevent directory traversal
    const safePath = pathSegments.join('/').replace(/\.\./g, '')
    const filePath = path.join(process.cwd(), 'public', 'uploads', safePath)

    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }

    const stat = fs.statSync(filePath)
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 400 })
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'
    const fileSize = stat.size

    // Handle HTTP Range requests (essential for HTML5 <audio> and <video> streaming)
    const range = req.headers.get('range')
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1

      const fileStream = fs.createReadStream(filePath, { start, end })
      const webStream = (Readable as any).toWeb ? (Readable as any).toWeb(fileStream) : fileStream

      return new NextResponse(webStream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    // Full file stream response
    const fileStream = fs.createReadStream(filePath)
    const webStream = (Readable as any).toWeb ? (Readable as any).toWeb(fileStream) : fileStream
    return new NextResponse(webStream as any, {
      status: 200,
      headers: {
        'Accept-Ranges': 'bytes',
        'Content-Length': fileSize.toString(),
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err: any) {
    console.error('Error serving upload:', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
