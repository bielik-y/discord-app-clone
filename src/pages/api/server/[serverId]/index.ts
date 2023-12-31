import { db } from '@/lib/db'
import { getServerSessionUser } from '@/lib/auth'
import { excludeNonClientData, getServerDataById } from '@/lib/server'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    req.method !== 'GET' &&
    req.method !== 'PATCH' &&
    req.method !== 'DELETE'
  ) {
    res.status(405).json({ message: 'Request method not supported' })
    return
  }

  const user = await getServerSessionUser(req, res)
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }

  const { serverId } = req.query
  if (!serverId || typeof serverId !== 'string') {
    res.status(400).json({ message: 'Invalid request params' })
    return
  }

  if (req.method === 'GET') {
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
  else if (req.method === 'PATCH') {
    const { name, imageUrl } = req.body
    try {
      const server = await db.server.update({
        where: {
          id: serverId,
          userId: user.id
        },
        data: {
          name: name,
          imageUrl: imageUrl
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
        res.status(400).json({ message: 'Server data not available' })
        return
      } else
        res.status(200).json({
          server: excludeNonClientData(server)
        })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  } else if (req.method === 'DELETE') {
    try {
      const server = await db.server.delete({
        where: {
          id: serverId,
          userId: user.id
        }
      })

      if (!server) {
        res.status(400).json({ message: 'Server data not available' })
        return
      } else
        res.status(200).json({ message: 'Server was successfully deleted' })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
