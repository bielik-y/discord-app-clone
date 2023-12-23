import axios from 'axios'
import { create } from 'zustand'
import { Channel, Server, ServerShort } from '@/types'

interface ServerStore {
  userServers: ServerShort[]
  server: Server | null
  currentChannel: string | null
  currentMember: string | null
  updateUserServers: () => void
  updateServer: (server: Server) => void
  setServer: (serverId: string) => void
  setChannel: (channelId: string) => void
  setMember: (memberId: string) => void
  resetServer: () => void
}

export const useServerStore = create<ServerStore>((set) => ({
  userServers: [],
  server: null,
  currentChannel: null,
  currentMember: null,
  updateUserServers: async () => {
    const { data } = await axios.get('/api/user/servers')
    if (data.servers.length) {
      set({ userServers: data.servers })
    }
  },
  updateServer: async (server) => {
    set({ server: server })
  },
  setServer: async (serverId) => {
    const { data } = await axios.get(`/api/server/${serverId}`)
    if (data.server)
      set({ server: data.server, currentChannel: data.server.channels[0].id })
  },
  resetServer: () => {
    set({
      server: null,
      userServers: [],
      currentChannel: null,
      currentMember: null
    })
  },
  setChannel: (channelId) => {
    set({ currentChannel: channelId, currentMember: null })
  },
  setMember: (memberId) => {
    set({ currentMember: memberId, currentChannel: null })
  }
}))
