import { db } from '@/lib/db'
import { v4 as uuid } from 'uuid'
import { excludeNonClientData } from '@/lib/server'
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
    const { serverId } = req.query
    if (typeof serverId !== 'string') throw new Error('Invalid query type')

    try {
      const server = await db.server.update({
        where: {
          id: serverId,
          userId: user.id
        },
        data: {
          inviteCode: uuid()
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

      if (!server) {
        res.status(400).json({ message: 'Changing data is not available' })
        return
      } else
        res.status(200).json({
          server: excludeNonClientData(server)
        })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
