import { z } from 'zod'
import { ChannelType } from '@prisma/client'

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
  username: z.string().min(3, 'Name must contain at least 3 characters')
})

export type RegisterSchema = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().min(1, `Email shouldn't be empty`),
  password: z.string().min(1, `Password shouldn't be empty`)
})

export type LoginSchema = z.infer<typeof loginSchema>

export const serverSchema = z.object({
  name: z
    .string()
    .min(1, 'Server name is required')
    .max(40, 'Name should be less than 40 characters'),
  imageUrl: z.string().min(1, 'Server image is required')
})

export type ServerSchema = z.infer<typeof serverSchema>

export const channelSchema = z.object({
  name: z
    .string()
    .min(1, 'Channel name is required')
    .max(40, 'Name should be less than 40 characters')
    .refine((name) => name !== 'general', `Channel name cannot be 'general'`),
  type: z.nativeEnum(ChannelType)
})

export type ChannelSchema = {
  name: string,
  type: string
}
