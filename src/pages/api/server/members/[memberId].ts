import { db, excludeNonClientData, getServerDataById } from '@/lib/db'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'PATCH') {
    const user = await getServerSessionUser(req, res)
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { memberId, serverId } = req.query
    const { role } = req.body

    if (typeof memberId !== 'string' || typeof serverId !== 'string') {
      res.status(400).json({ message: 'Invalid or missing request params' })
      return
    }

    try {
      const server = await db.server.update({
        where: {
          id: serverId,
          userId: user.id
        },
        data: {
          members: {
            update: {
              where: {
                id: memberId,
                userId: {
                  not: user.id
                }
              },
              data: {
                role
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
  } else if ((req.method = 'DELETE')) {
    const user = await getServerSessionUser(req, res)
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { memberId, serverId } = req.query

    if (typeof memberId !== 'string' || typeof serverId !== 'string') {
      res.status(400).json({ message: 'Invalid or missing request params' })
      return
    }

    try {
      const server = await db.server.update({
        where: {
          id: serverId,
          userId: user.id
        },
        data: {
          members: {
            deleteMany: {
              id: memberId,
              userId: {
                not: user.id
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
