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

    const { conversationId } = req.query
    const { content, fileUrl } = req.body

    if (typeof conversationId !== 'string') {
      res.status(400).json({ message: 'Invalid request params' })
      return
    }

    if (!content) {
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

      const message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          conversationId: conversationId,
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

      const conversationKey = `chat:${conversationId}:messages`
      res.socket?.server?.io?.emit(conversationKey, message)

      res.status(201).json(message)
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
