// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export const middleware = withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth')
    const token = req.nextauth.token

    // CRITICAL: Skip redirect logic for API auth routes (callback, signin, etc.)
    // NextAuth MUST process these without middleware interference
    if (isApiAuth) {
      return undefined // Let NextAuth handle it
    }

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Redirect unauthenticated users to login from protected pages
    if (!isAuthPage && !token) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        const isApiAuth = req.nextUrl.pathname.startsWith('/api/auth')

        // Allow ALL /api/auth routes without token check
        // (callback, signin, signout, session, providers, csrf, etc.)
        if (isApiAuth) {
          return true
        }

        // Allow access to auth pages for unauthenticated users
        if (isAuthPage) {
          return true
        }

        // Require token for protected pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
