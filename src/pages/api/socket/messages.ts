import { getServerSessionUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NextApiResponseServerIO } from '@/types'
import { NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method === 'POST') {
    const user = await getServerSessionUser(req, res)
    if (!user) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const { serverId, channelId } = req.query
    const { content, fileUrl } = req.body

    if (typeof serverId !== 'string' || typeof channelId !== 'string') {
      res.status(400).json({ message: 'Invalid request params' })
      return
    }

    if (!content) {
      res.status(400).json({ message: 'Content is missing' })
      return
    }

    try {
      const server = await db.server.findFirst({
        where: {
          id: serverId,
          members: {
            some: {
              userId: user.id
            }
          }
        },
        include: {
          members: true
        }
      })

      if (!server) {
        res.status(404).json({ message: 'Server not found' })
        return
      }

      const channel = await db.channel.findFirst({
        where: {
          id: channelId,
          serverId: serverId
        }
      })

      if (!channel) {
        res.status(404).json({ message: 'Channel not found' })
        return
      }

      const member = server.members.find((member) => member.userId === user.id)

      if (!member) {
        res.status(404).json({ message: 'Member not found' })
        return
      }

      const message = await db.message.create({
        data: {
          content,
          fileUrl,
          channelId: channelId,
          memberId: member.id
        },
        include: {
          member: {
            include: {
              user: true
            }
          }
        }
      })

      const channelKey = `chat:${channelId}:messages`
      res.socket?.server?.io?.emit(channelKey, message)

      res.status(201).json(message)
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
