import { getServerDataById } from '@/lib/db'
import { getServerSessionUser } from '@/lib/auth'
import { NextApiRequest, NextApiResponse } from 'next'

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

    const { serverId } = req.query
    if (typeof serverId !== 'string') throw new Error('Invalid query type')

    try {
      const server = await getServerDataById(serverId, user.id)
      if (!server) {
        res.status(422).json({ message: 'Server data not available' })
        return
      } else
        res.status(200).json({
          server: server
        })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
