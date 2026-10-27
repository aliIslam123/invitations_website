import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const state = crypto.randomBytes(32).toString('hex')
  const clientId = process.env.GOOGLE_CLIENT_ID

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : req.nextUrl.origin || 'https://invitations-website-rust.vercel.app'

  const redirectUri = `${siteUrl.replace(/\/$/, '')}/api/auth/callback/google`

  // If Google OAuth credentials are not yet configured in production environment
  if (!clientId || clientId === 'your-google-client-id') {
    const fallbackUrl = new URL('/auth/sign-in', req.url)
    fallbackUrl.searchParams.set('error', 'google_not_configured')
    fallbackUrl.searchParams.set('returnTo', returnTo)
    return NextResponse.redirect(fallbackUrl)
  }

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', clientId)
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('state', state)
  googleAuthUrl.searchParams.set('access_type', 'offline')
  googleAuthUrl.searchParams.set('prompt', 'consent')

  const response = NextResponse.redirect(googleAuthUrl)

  // Set state cookie for CSRF protection (valid 15 minutes)
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
