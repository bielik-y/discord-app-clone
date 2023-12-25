import { db } from '@/lib/db'
import { Role } from '@prisma/client'
import { NextApiRequest } from 'next'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiResponseServerIO } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    res.status(405).json({ message: 'Request method not supported' })
    return
  }

  const user = await getServerSessionUser(req, res)
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const { messageId, serverId, channelId } = req.query
  const { content } = req.body

  if (
    typeof messageId !== 'string' ||
    typeof serverId !== 'string' ||
    typeof channelId !== 'string'
  ) {
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

    let message = await db.message.findFirst({
      where: {
        id: messageId,
        channelId: channelId
      },
      include: {
        member: {
          include: {
            user: true
          }
        }
      }
    })

    if (!message || message.deleted) {
      res.status(404).json({ message: 'Message not found' })
      return
    }

    const isMessageOwner = message.memberId === member.id
    const isAdmin = member.role === Role.ADMIN
    const isModerator = member.role === Role.MODERATOR

    const canModify = isMessageOwner || isAdmin || isModerator

    if (!canModify) {
      res.status(401).json({ message: 'No rights to do this action' })
      return
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        res.status(401).json({ message: 'No rights to do this action' })
        return
      }
      message = await db.message.update({
        where: {
          id: messageId
        },
        data: {
          content: content
        },
        include: {
          member: {
            include: {
              user: true
            }
          }
        }
      })
    }

    // Soft delete so general info about deleted message remains in db
    if (req.method === 'DELETE') {
      message = await db.message.update({
        where: {
          id: messageId
        },
        data: {
          fileUrl: null,
          content: 'This message is deleted.',
          deleted: true
        },
        include: {
          member: {
            include: {
              user: true
            }
          }
        }
      })
    }

    const updateKey = `chat:${channelId}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, message)

    res.status(200).json({ message })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
    return
  }
}
