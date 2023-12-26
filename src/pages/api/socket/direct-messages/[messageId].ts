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

  const { messageId, conversationId } = req.query
  const { content } = req.body

  if (
    typeof messageId !== 'string' ||
    typeof conversationId !== 'string'
  ) {
    res.status(400).json({ message: 'Invalid request params' })
    return
  }

  if (!content && req.method !== 'DELETE') {
    res.status(400).json({ message: 'Content is missing' })
    return
  }

  try {
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          {
            memberOne: {
              userId: user.id
            }
          },
          {
            memberTwo: {
              userId: user.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            user: true
          }
        },
        memberTwo: {
          include: {
            user: true
          }
        }
      }
    })

    if (!conversation) {
      res.status(404).json({ message: 'Conversation not found' })
      return
    }

    const member =
      conversation.memberOne.userId === user.id
        ? conversation.memberOne
        : conversation.memberTwo

    if (!member) {
      res.status(404).json({ message: 'Member not found' })
      return
    }

    ///

    let message = await db.directMessage.findFirst({
      where: {
        id: messageId,
        conversationId: conversationId
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
      message = await db.directMessage.update({
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
      message = await db.directMessage.update({
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

    const updateKey = `chat:${conversationId}:messages:update`
    res?.socket?.server?.io?.emit(updateKey, message)

    res.status(200).json({ message })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
    return
  }
}
