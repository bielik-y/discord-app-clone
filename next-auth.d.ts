import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string,
    username: string
    imageUrl: string
    server?: string
  }
  interface Session {
    user: User
  }
}
