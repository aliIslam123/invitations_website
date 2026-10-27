import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createSession } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  const storedState = req.cookies.get('oauth_state')?.value
  const returnTo = req.cookies.get('oauth_return_to')?.value || '/dashboard'

  // Clear oauth cookies helper
  const cleanCookies = (res: NextResponse) => {
    res.cookies.delete('oauth_state')
    res.cookies.delete('oauth_return_to')
    return res
  }

  if (error || !code) {
    console.error('Google OAuth error from provider:', error)
    const res = NextResponse.redirect(new URL(`/auth/sign-in?error=${encodeURIComponent(error || 'cancelled')}`, req.url))
    return cleanCookies(res)
  }

  if (!state || state !== storedState) {
    console.error('Google OAuth state mismatch CSRF warning')
    const res = NextResponse.redirect(new URL('/auth/sign-in?error=state_mismatch', req.url))
    return cleanCookies(res)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    const res = NextResponse.redirect(new URL('/auth/sign-in?error=google_not_configured', req.url))
    return cleanCookies(res)
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes('localhost')
      ? process.env.NEXT_PUBLIC_SITE_URL
      : req.nextUrl.origin || 'https://invitations-website-rust.vercel.app'

  const redirectUri = `${siteUrl.replace(/\/$/, '')}/api/auth/callback/google`

  try {
    // 1. Exchange code for access & id token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text()
      console.error('Failed to exchange Google OAuth code:', errText)
      const res = NextResponse.redirect(new URL('/auth/sign-in?error=token_exchange_failed', req.url))
      return cleanCookies(res)
    }

    const tokens = await tokenResponse.json()

    // 2. Fetch user profile from Google
    const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!profileResponse.ok) {
      console.error('Failed to fetch Google profile')
      const res = NextResponse.redirect(new URL('/auth/sign-in?error=profile_fetch_failed', req.url))
      return cleanCookies(res)
    }

    const profile = await profileResponse.json()
    const { sub: googleId, email, name, picture } = profile

    if (!email) {
      const res = NextResponse.redirect(new URL('/auth/sign-in?error=no_email_provided', req.url))
      return cleanCookies(res)
    }

    // 3. Find or create user & link account
    let user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          image: picture || null,
          role: 'USER',
          accounts: {
            create: {
              type: 'oauth',
              provider: 'google',
              providerAccountId: googleId,
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token || null,
              expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
              token_type: tokens.token_type || null,
              scope: tokens.scope || null,
              id_token: tokens.id_token || null,
            },
          },
        },
        include: { accounts: true },
      })
    } else {
      // Check if Google account already linked
      const hasGoogleAccount = user.accounts.some((acc) => acc.provider === 'google' && acc.providerAccountId === googleId)
      if (!hasGoogleAccount) {
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId: googleId,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token || null,
            expires_at: tokens.expires_in ? Math.floor(Date.now() / 1000) + tokens.expires_in : null,
            token_type: tokens.token_type || null,
            scope: tokens.scope || null,
            id_token: tokens.id_token || null,
          },
        })
      }
    }

    // 4. Establish user session
    await createSession(user.id)

    // Ensure safe redirect target
    const safeRedirect = returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/dashboard'
    const res = NextResponse.redirect(new URL(safeRedirect, req.url))
    return cleanCookies(res)
  } catch (err: any) {
    console.error('Google OAuth flow exception:', err)
    const res = NextResponse.redirect(new URL('/auth/sign-in?error=server_error', req.url))
    return cleanCookies(res)
  }
}
