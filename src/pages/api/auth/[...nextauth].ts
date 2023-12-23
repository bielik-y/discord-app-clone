import { verifyPassword } from '@/lib/auth'
import { db } from '@/lib/db'
import { getFirstServer } from '@/lib/server'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        // Custom form is used but for typechecking empty objects should be defined
        email: {},
        password: {}
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        try {
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user) return null

          const isPasswordValid = await verifyPassword(
            credentials.password,
            user.password
          )
          if (!isPasswordValid) return null

          const server = await getFirstServer(user.id)

          // For user navigation: if server exists show server page otherwise setup page
          if (server)
            return {
              id: user.id,
              email: user.email,
              username: user.username,
              imageUrl: user.imageUrl,
              server: server.id
            } as any
          else
            return {
              id: user.id,
              email: user.email,
              username: user.username,
              imageUrl: user.imageUrl
            } as any
          // 'as any' resolves next-auth types bug https://github.com/nextauthjs/next-auth/issues/2701#issuecomment-1537189138
        } catch (err) {
          console.log(err)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    // Add custom user field into JWT
    async jwt({ token, user, trigger, session }) {
      // Update user session with new data
      if (trigger === 'update' && session.server) {
        token.server = session.server
      }
      if (user) {
        return {
          ...token,
          id: user.id,
          username: user.username,
          imageUrl: user.imageUrl,
          server: user.server
        }
      }
      return token
    },
    // Add custom user field into session from JWT data
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
          imageUrl: token.imageUrl,
          server: token.server
        }
      }
    }
  },
  pages: {
    signIn: '/auth'
  }
}

export default NextAuth(authOptions)
