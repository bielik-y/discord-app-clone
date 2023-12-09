import { NextApiRequest, NextApiResponse } from 'next'
import { User, getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { v4 as uuid } from 'uuid'
import { db } from '@/lib/db'
import { Role } from '@prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)

    if (!session || !session.user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const data = req.body
    const userId = (session.user as User).id

    try {
      const server = await db.server.create({
        data: {
          name: data.name,
          imageUrl: data.imageUrl,
          userId: userId,
          inviteCode: uuid(),
          channels: {
            create: [{ name: 'general', userId: userId }]
          },
          members: {
            create: [{ userId: userId, role: Role.ADMIN }]
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
  }
}
