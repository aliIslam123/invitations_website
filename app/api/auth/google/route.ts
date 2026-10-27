import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const returnTo = searchParams.get('returnTo') || '/dashboard'

  const state = crypto.randomBytes(32).toString('hex')
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  // If Google OAuth credentials are not configured, redirect back to sign-in with clear guidance
  if (!clientId || clientId === 'your-google-client-id' || !clientSecret) {
    const targetUrl = new URL(`/auth/sign-in?error=google_not_configured&returnTo=${encodeURIComponent(returnTo)}`, req.url)
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
