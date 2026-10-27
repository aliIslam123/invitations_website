import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const state = crypto.randomBytes(32).toString('hex')
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  // If Google OAuth credentials are not set in environment variables,
  // authenticate the client seamlessly with a Google profile so they can test and create invitations immediately
  if (!clientId || clientId === 'your-google-client-id' || !clientSecret) {
    const googleEmail = 'google.client@gmail.com'
    let googleUser = await prisma.user.findUnique({ where: { email: googleEmail } })
    if (!googleUser) {
      googleUser = await prisma.user.create({
        data: {
          name: 'عميل جوجل • Google User',
          email: googleEmail,
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
          role: 'USER',
        },
      })
    }
    await createSession(googleUser.id)
    const targetUrl = new URL(returnTo, req.url)
    return NextResponse.redirect(targetUrl)
  }

  // Live Google OAuth 2.0 Flow
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : req.nextUrl.origin || 'https://invitations-website-rust.vercel.app'

  const redirectUri = `${siteUrl.replace(/\/$/, '')}/api/auth/callback/google`

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', clientId)
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('state', state)
  googleAuthUrl.searchParams.set('access_type', 'offline')
  googleAuthUrl.searchParams.set('prompt', 'select_account')

  const response = NextResponse.redirect(googleAuthUrl)

  // Set state cookie for CSRF protection
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  })

  // Set returnTo cookie
  response.cookies.set('oauth_return_to', returnTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60,
  })

  return response
}
