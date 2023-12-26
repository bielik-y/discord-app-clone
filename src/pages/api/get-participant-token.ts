import { AccessToken } from 'livekit-server-sdk'
import { NextApiResponse, NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { room, username } = req.query

    if (!room) {
      res.status(400).json({ message: 'Missing "room" query parameter' })
      return
    } else if (!username) {
      res.status(400).json({ message: 'Missing "username" query parameter' })
      return
    }

    const apiKey = process.env.LIVEKIT_API_KEY
    const apiSecret = process.env.LIVEKIT_API_SECRET
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

    if (!apiKey || !apiSecret || !wsUrl) {
      res.status(500).json({ message: 'Server misconfigured' })
      return
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: username as string
    })

    at.addGrant({
      room: room as string,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true
    })

    res.status(200).json({ token: at.toJwt() })
  }
}
