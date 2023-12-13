import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()

// Prevent from frequent prisma client initialization to provide fast reload in dev mode
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

export async function getServerById(serverId: string, userId: string) {
  const server = db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: userId
        }
      }
    }
  })
  return server
}

export async function getServerDataById(serverId: string, userId: string) {
  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          userId: userId
        }
      }
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      members: {
        include: {
          user: true
        },
        orderBy: {
          role: 'asc'
        }
      }
    }
  })
  if (server)
    return {
      id: server.id,
      name: server.name,
      imageUrl: server.imageUrl,
      inviteCode: server.inviteCode,
      channels: server.channels.map((channel) => ({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        userId: channel.userId
      })),
      members: server.members.map((member) => ({
        id: member.id,
        role: member.role,
        user: {
          id: member.user.id,
          username: member.user.username
        }
      }))
    }
}

export async function getFirstServer(userId: string) {
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: userId
        }
      }
    }
  })
  return server
}
