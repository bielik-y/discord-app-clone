import { db } from '@/lib/db'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { Message } from '@prisma/client'

const MESSAGES_BATCH = 12

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const user = await getServerSessionUser(req, res)
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { cursor, channelId, serverId } = req.query

    if (
      !channelId ||
      typeof channelId !== 'string' ||
      !serverId ||
      typeof serverId !== 'string'
    ) {
      res.status(400).json({ message: 'Invalid request params' })
      return
    }

    try {
      const member = await db.member.findFirst({
        where: {
          serverId: serverId,
          userId: user.id
        }
      })

      // If user is not member of the server
      if (!member) {
        res.status(400).redirect('/')
        return
      }

      let messages: Message[] = []
      if (cursor) {
        messages = await db.message.findMany({
          take: MESSAGES_BATCH,
          skip: 1,
          cursor: {
            id: cursor as string
          },
          where: {
            channelId
          },
          include: {
            member: {
              include: {
                user: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      } else {
        messages = await db.message.findMany({
          take: MESSAGES_BATCH,
          where: {
            channelId
          },
          include: {
            member: {
              include: {
                user: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
      }

      let nextCursor = null
      if (messages.length === MESSAGES_BATCH)
        nextCursor = messages[MESSAGES_BATCH - 1].id

      res.status(200).json({
        messages,
        nextCursor
      })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
