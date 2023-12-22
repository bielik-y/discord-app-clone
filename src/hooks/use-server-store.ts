import axios from 'axios'
import { create } from 'zustand'
import { Channel, Server, ServerShort } from '@/types/models'

interface ServerStore {
  userServers: ServerShort[]
  server: Server | null
  currentChannel: string | null
  updateUserServers: () => void
  updateServer: (server: Server) => void
  setServer: (serverId: string) => void
  resetServer: () => void

  setChannel: (channelId: string) => void
}

export const useServerStore = create<ServerStore>((set) => ({
  userServers: [],
  server: null,
  currentChannel: null,
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
    if (data.server) set({ server: data.server, currentChannel: data.server.channels[0].id })
  },
  resetServer: () => {
    set({ server: null, userServers: [], currentChannel: null })
  },
  setChannel: (channelId) => {set({ currentChannel: channelId })}
}))
