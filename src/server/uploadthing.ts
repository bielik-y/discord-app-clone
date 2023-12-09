import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession, User } from 'next-auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next-legacy'

const f = createUploadthing()

export const customFileRouter = {
  serverImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async ({ req, res }) => {
      const session = await getServerSession(req, res, authOptions)
      if (!session) throw new Error('Unauthorized')
      else return { userId: (session.user as User).id }
    })
    .onUploadComplete(() => {})
} satisfies FileRouter

export type CustomFileRouter = typeof customFileRouter
