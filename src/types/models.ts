export interface ServerShort {
  id: string
  name: string
  imageUrl: string
}

export interface Server extends ServerShort {
  inviteCode: string
  channels: Channel[]
  members: Member[]
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
}
