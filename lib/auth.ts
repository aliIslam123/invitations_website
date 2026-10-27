import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.AUTH_SECRET || 'luxury-wedding-platform-secret-key-2024-antigravity'
const key = new TextEncoder().encode(SECRET_KEY)
const COOKIE_NAME = 'luxury_wedding_session'

export interface SessionPayload {
  userId: string
  email: string
  role: string
  name?: string
  expiresAt: number
}

/**
 * Sign a JWT token for a given user.
 */
export async function signToken(payload: { userId: string; email: string; role: string; name?: string }): Promise<string> {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  return await new SignJWT({ ...payload, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

/**
 * Verify a JWT session token.
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Create a session and set HTTP-only cookie.
 */
export async function createSession(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true, name: true },
  })

  if (!user) return false

  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name || '',
  })

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })

  return true
}

/**
 * Get current authenticated user session from cookie.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  return await verifyToken(token)
}

/**
 * Destroy the current session.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Verify administrator authorization.
 * Returns the session or throws an error.
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    throw new Error('UNAUTHORIZED')
  }
  return session
}

/**
 * Authenticate credentials with support for fixed Admin credentials (admin / admin123).
 */
export async function authenticateCredentials(identifier: string, password: string) {
  const cleanId = identifier.trim().toLowerCase()

  // 1. Fixed Admin Support: "admin" or "admin@wedding.com" or "admin@luxurywedding.com" with "admin123" or "AdminPassword2024!"
  const isAdminIdentifier =
    cleanId === 'admin' ||
    cleanId === 'admin@wedding.com' ||
    cleanId === 'admin@luxurywedding.com'

  const isAdminPassword =
    password === 'admin123' ||
    password === 'AdminPassword2024!' ||
    password === 'admin'

  if (isAdminIdentifier && isAdminPassword) {
    const adminEmail = 'admin@wedding.com'
    let admin = await prisma.user.findFirst({
      where: {
        OR: [
          { email: adminEmail },
          { email: 'admin@luxurywedding.com' },
          { role: 'ADMIN' },
        ],
      },
    })

    if (!admin) {
      const passwordHash = await bcrypt.hash('admin123', 10)
      admin = await prisma.user.create({
        data: {
          email: adminEmail,
          name: 'مدير المنصة • SuperAdmin',
          passwordHash,
          role: 'ADMIN',
        },
      })
    } else if (admin.role !== 'ADMIN') {
      admin = await prisma.user.update({
        where: { id: admin.id },
        data: { role: 'ADMIN' },
      })
    }

    return admin
  }

  // 2. Standard Database Authentication by Email
  const user = await prisma.user.findUnique({
    where: { email: cleanId },
  })

  if (!user || !user.passwordHash) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)
  if (!isValid) {
    return null
  }

  return user
}
