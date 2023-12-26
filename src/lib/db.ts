import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

// Prevent from frequent prisma client initialization to provide fast reload in dev mode
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db