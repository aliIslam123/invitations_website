import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-safe slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Format a date with locale support.
 */
export function formatDate(
  date: Date | string | null | undefined,
  locale: string = 'ar-SA',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Calculate time remaining until a target date.
 */
export interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
  isPast: boolean
}

export function getTimeRemaining(targetDate: Date | string): TimeRemaining {
  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate
  const now = new Date()
  const total = target.getTime() - now.getTime()

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isPast: true }
  }

  const seconds = Math.floor((total / 1000) % 60)
  const minutes = Math.floor((total / 1000 / 60) % 60)
  const hours = Math.floor((total / 1000 / 60 / 60) % 24)
  const days = Math.floor(total / 1000 / 60 / 60 / 24)

  return { days, hours, minutes, seconds, total, isPast: false }
}

/**
 * Build a Google Maps destination URL from a share link, coordinates, or address.
 */
export function buildMapsUrl(params: {
  mapsUrl?: string | null
  latitude?: number | null
  longitude?: number | null
  address?: string | null
  venueName?: string | null
}): string {
  const { mapsUrl, latitude, longitude, address, venueName } = params

  if (mapsUrl) return mapsUrl

  if (latitude && longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  }

  const query = [venueName, address].filter(Boolean).join(', ')
  if (query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
  }

  return 'https://maps.google.com'
}

/**
 * Build a WhatsApp share URL.
 */
export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * Replace placeholder in WhatsApp message template.
 */
export function formatWhatsAppMessage(
  template: string | null | undefined,
  invitationUrl: string
): string {
  const defaultMessage = `يسعدنا دعوتكم لمشاركتنا فرحتنا ❤️\n\nنتشرف بوجودكم معنا في يومنا المميز.\n\nتفاصيل الدعوة والمكان من هنا:\n${invitationUrl}`
  if (!template) return defaultMessage
  return template.replace('[INVITATION_URL]', invitationUrl)
}

/**
 * Truncate a string to a given length.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Check if a file type is an allowed image type.
 */
export function isAllowedImageType(mimeType: string, filename?: string): boolean {
  if (mimeType && (mimeType.startsWith('image/') || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/svg+xml'
  ].includes(mimeType))) {
    return true
  }
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop()
    return ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif', 'svg'].includes(ext || '')
  }
  return false
}

/**
 * Check if a file type is an allowed audio type.
 */
export function isAllowedAudioType(mimeType: string, filename?: string): boolean {
  if (mimeType && (mimeType.startsWith('audio/') || [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/aac',
    'audio/mp4',
    'audio/x-m4a',
    'audio/m4a',
    'audio/x-wav',
    'audio/webm',
    'audio/flac',
    'audio/x-mp3',
    'audio/vnd.wav',
    'audio/basic',
    'audio/mid',
    'audio/x-aiff'
  ].includes(mimeType))) {
    return true
  }
  if (filename) {
    const ext = filename.toLowerCase().split('.').pop()
    return ['mp3', 'wav', 'm4a', 'ogg', 'aac', 'flac', 'webm', 'wma', 'mp4'].includes(ext || '')
  }
  return false
}

/**
 * Format file size in human-readable format.
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate the public invitation URL.
 * Always resolves to the active online domain in production, never localhost.
 */
export function getInvitationUrl(slug: string, siteUrl?: string): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/wedding/${slug}`
  }

  let base = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || ''
  if (!base || base.includes('localhost')) {
    if (process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')) {
      base = process.env.NEXT_PUBLIC_SITE_URL
    } else {
      base = 'https://invitations-website-rust.vercel.app'
    }
  }

  base = base.replace(/\/+$/, '')
  return `${base}/wedding/${slug}`
}

/**
 * Sanitize a string for safe HTML rendering (basic).
 * For production, use a dedicated sanitizer like DOMPurify.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}
