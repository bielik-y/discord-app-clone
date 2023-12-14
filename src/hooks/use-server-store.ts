import axios from 'axios'
import { create } from 'zustand'
import { Server, ServerShort } from '@/types/models'

interface ServerStore {
  userServers: ServerShort[]
  server: Server | null
  updateUserServers: () => void
  updateServer: (server: Server) => void
  setServer: (serverId: string) => void
}

export const useServerStore = create<ServerStore>((set) => ({
  userServers: [],
  server: null,
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
    if (data.server) set({ server: data.server })
  }
}))
