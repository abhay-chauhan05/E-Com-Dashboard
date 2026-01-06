// lib/auth.ts
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import { verifyPassword, hashPassword } from './password'

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Warning: Google OAuth credentials not set. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local')
}

export const authOptions: NextAuthOptions = {
  // We use JWT strategy, so we don't need PrismaAdapter
  // Credential logins will be handled via custom authorize callback
  // Google OAuth users will auto-create or link via signIn callback
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Invalid email or password')
        }

        const isPasswordValid = await verifyPassword(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  // Ensure cookie behaviour is explicit
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Debug: log account/profile to help debug Google OAuth issues
        if (account?.provider === 'google') {
          console.log('Google signIn callback. account:', JSON.stringify(account), 'profile:', JSON.stringify(profile))
        }

        // Auto-create Google users in the database
        if (account?.provider === 'google' && profile?.email) {
          try {
            const existingUser = await prisma.user.findUnique({
              where: { email: profile.email },
            })

            if (!existingUser) {
              // Create new user from Google profile
              await prisma.user.create({
                data: {
                  email: profile.email,
                  name: profile.name || 'User',
                  role: 'USER',
                  // Google users have no password
                  password: null,
                },
              })
            }
            return true
          } catch (error) {
            console.error('Error creating Google user:', error)
            return false
          }
        }

        // Allow credentials login
        return true
      } catch (err) {
        console.error('signIn callback error:', err, { account, profile })
        return false
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        // For Google logins, fetch user data to get role
        if (account?.provider === 'google') {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email || '' },
            })
            if (dbUser) {
              token.id = dbUser.id
              token.role = dbUser.role
            }
          } catch (error) {
            console.error('Error fetching user role:', error)
          }
        } else {
          token.role = (user as any).role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Prevent redirect loops
      try {
        if (typeof url === 'string' && url.startsWith('/')) return `${baseUrl}${url}`
        else if (typeof url === 'string' && new URL(url).origin === baseUrl) return url
      } catch (err) {
        console.error('redirect callback error:', err, { url, baseUrl })
      }
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
