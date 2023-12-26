import { db } from '@/lib/db'
import { excludeNonClientData } from '@/lib/server'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    res.status(405).json({ message: 'Request method not supported' })
    return
  }

  const user = await getServerSessionUser(req, res)
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const { memberId, serverId } = req.query

  if (
    !memberId ||
    !serverId ||
    typeof memberId !== 'string' ||
    typeof serverId !== 'string'
  ) {
    res.status(400).json({ message: 'Invalid or missing request params' })
    return
  }

  if (req.method === 'PATCH') {
    const { role } = req.body

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
