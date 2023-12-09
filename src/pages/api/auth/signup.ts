import { z } from 'zod'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const data = req.body

    try {
      registerSchema.parse(data)
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(422).json({ message: 'Invalid input', errors: err.issues })
        return
      } else {
        res.status(500).json({ message: 'Input validation error' })
        return
      }
    }

    const { email, username, password } = data

    try {
      const result = await db.user.findUnique({ where: { email: email } })
      if (result) {
        res
          .status(422)
          .json({ message: `User with email ${email} already exists` })
        return
      }

      const user = await db.user.create({
        data: {
          email,
          username,
          password: await hashPassword(password)
        }
      })
      res.status(201).json({ message: 'User was successfully created' })
    } catch (err) {
      res.status(500).json({ message: 'Server error' })
      return
    }
  }
}
