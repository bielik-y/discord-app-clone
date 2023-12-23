import { db } from '@/lib/db'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'
import { getOrCreateConversation } from '@/lib/conversation'

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

    const { serverId, memberId } = req.query
    if (typeof serverId !== 'string' || typeof memberId !== 'string') {
      res.status(400).json({ message: 'Invalid request params' })
      return
    }

    try {
      const currentMember = await db.member.findFirst({
        where: {
          serverId: serverId,
          userId: user.id
        },
        include: {
          user: true
        }
      })

      if (!currentMember) {
        res.status(400).redirect('/')
        return
      }

      const conversation = await getOrCreateConversation(
        currentMember.id,
        memberId
      )

      if (!conversation) {
        res.status(400).redirect(`/servers/${serverId}`)
        return
      }

      const { memberOne, memberTwo } = conversation
      const otherMember = memberOne.userId === user.id ? memberTwo : memberOne

      res.status(200).json({
        otherMember: otherMember
      })
      
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
