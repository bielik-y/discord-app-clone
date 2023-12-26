import { v4 as uuid } from 'uuid'
import { db } from '@/lib/db'
import { Role } from '@prisma/client'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

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

    const data = req.body

    try {
      const server = await db.server.create({
        data: {
          name: data.name,
          imageUrl: data.imageUrl,
          userId: user.id,
          inviteCode: uuid(),
          channels: {
            create: [{ name: 'general', userId: user.id }]
          },
          members: {
            create: [{ userId: user.id, role: Role.ADMIN }]
          }
        }
      })

      res.status(201).json({
        serverId: server.id,
        message: 'Server was successfully created'
      })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  } else if (req.method === 'GET') {
    const user = await getServerSessionUser(req, res)
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    try {
      const servers = await db.server.findMany({
        where: {
          members: {
            some: {
              userId: user.id
            }
          }
        }
      })

      res.status(200).json({
        servers: servers.map((data) => ({
          id: data.id,
          name: data.name,
          imageUrl: data.imageUrl
        }))
      })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
