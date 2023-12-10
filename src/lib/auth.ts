import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { hash, compare } from 'bcryptjs'
import { User, getServerSession } from 'next-auth'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { IncomingMessage, ServerResponse } from 'http'

export async function hashPassword(password: string) {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export async function getServerSessionUser(
  req:
    | NextApiRequest
    | (IncomingMessage & {
        cookies: Partial<{
          [key: string]: string
        }>
      }),
  res: NextApiResponse | ServerResponse<IncomingMessage>
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session || !session.user) return null
  else return session.user as User
}
