import { db, excludeNonClientData } from '@/lib/db'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { channelSchema } from '@/lib/validations'
import { z } from 'zod'
import { Role } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const user = await getServerSessionUser(req, res)
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { serverId } = req.query
    const data = req.body

    if (typeof serverId !== 'string') {
      res.status(400).json({ message: 'Invalid or missing request params' })
      return
    }

    try {
      await channelSchema.parse(data)
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(422).json({ message: 'Invalid input', errors: err.issues })
        return
      } else {
        res.status(500).json({ message: 'Input validation error' })
        return
      }
    }

    const { name, type } = data

    try {
      const server = await db.server.update({
        where: {
          id: serverId,
          members: {
            some: {
              userId: user.id,
              role: {
                in: [Role.ADMIN, Role.MODERATOR]
              }
            }
          }
        },
        data: {
          channels: {
            create: {
              userId: user.id,
              type: type,
              name: name
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
      res.status(200).json({ server: excludeNonClientData(server) })
      return
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  } else if (req.method === 'DELETE') {
    const user = await getServerSessionUser(req, res)
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { serverId, channelId } = req.query

    if (typeof serverId !== 'string' || typeof channelId !== 'string') {
      res.status(400).json({ message: 'Invalid or missing request params' })
      return
    }

    try {
      const server = await db.server.update({
        where: {
          id: serverId,
          members: {
            some: {
              userId: user.id,
              role: {
                in: [Role.ADMIN, Role.MODERATOR]
              }
            }
          }
        },
        data: {
          channels: {
            delete: {
              id: channelId,
              name: {
                not: 'general'
              }
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
      res.status(200).json({ server: excludeNonClientData(server) })
      return
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
