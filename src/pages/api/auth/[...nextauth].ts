import { verifyPassword } from '@/lib/auth'
import { db } from '@/lib/db'
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

          return {
            id: user.id,
            email: user.email,
            username: user.username,
            isEmailVerified: user.isEmailVerified,
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
  callbacks: {
    // Add custom user field into JWT
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          username: user.username,
          isEmailVerified: user.isEmailVerified,
          imageUrl: user.imageUrl
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
          username: token.username,
          isEmailVerified: token.isEmailVerified,
          imageUrl: token.imageUrl
        }
      }
    }
  },
  pages: {
    signIn: '/auth'
  }
}

export default NextAuth(authOptions)
