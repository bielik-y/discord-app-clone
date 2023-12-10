import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

// prevent from frequent prisma client initialization to provide fast reload in dev mode
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

export async function getServerById(serverId: string) {
  const server = db.server.findUnique({
    where: {
      id: serverId
    }
  })
  return server
}
