import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 heures en secondes
    updateAge: 60 * 60, // 1 heure en secondes
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 heures en secondes
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        token.role = (user as { role?: string }).role || 'USER'
        token.expiresAt = Date.now() + (24 * 60 * 60 * 1000) // 24 heures en millisecondes
      }
      return token
    },
    async session({ session, token }) {
      if (token && token.sub) {
        session.user.id = token.sub
        session.user.role = (token as { role?: string }).role as string
        const expiresAt = (token as { expiresAt?: number }).expiresAt
        session.expires = expiresAt 
          ? new Date(expiresAt).toISOString()
          : new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString()
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Permettre les redirections externes pour les URLs de déconnexion
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin'
  },
  events: {
    async signOut({ token }) {
      // Log de déconnexion pour audit
      console.log(`User ${token?.sub} signed out at ${new Date().toISOString()}`)
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
export { authOptions }
