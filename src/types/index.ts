import {
  Server as ServerDB,
  Member as MemberDB,
  User as UserDB,
  Channel as ChannelDB
} from '@prisma/client'

export type ServerWithMembersWithUsersWithChannels = ServerDB & {
  members: (MemberDB & { user: UserDB })[]
  channels: ChannelDB[]
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
