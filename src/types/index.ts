import {
  Server as ServerDB,
  Member as MemberDB,
  User as UserDB,
  Channel as ChannelDB,
  Message as MessageDB
} from '@prisma/client'
import { NextApiResponse } from 'next'
import { Server as NetServer, Socket } from 'net'
import { Server as SocketIOServer } from 'socket.io'

export type ServerWithMembersWithUsersWithChannels = ServerDB & {
  members: (MemberDB & { user: UserDB })[]
  channels: ChannelDB[]
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export type MessageWithMemberWithProfile = MessageDB & {
  member: MemberDB & {
    user: UserDB
  }
}

export interface ServerShort {
  id: string
  name: string
  imageUrl: string
}

export interface Server extends ServerShort {
  inviteCode: string
  channels: Channel[]
  members: Member[]
  userId: string
}

export interface Channel {
  id: string
  name: string
  type: 'TEXT' | 'AUDIO' | 'VIDEO'
  userId: string
}

export interface Member {
  id: string
  user: UserShort
  role: 'ADMIN' | 'MODERATOR' | 'GUEST'
}

export interface UserShort {
  id: string
  username: string
  email: string
}
