import axios from 'axios'
import { Server, ServerShort } from '@/types/models'
import { create } from 'zustand'

interface ServerStore {
  servers: ServerShort[]
  current: Server | null
  updateServers: () => void
  updateCurrent: (serverId: string) => void
}

export const useServerStore = create<ServerStore>((set) => ({
  servers: [],
  current: null,
  updateServers: async () => {
    const { data } = await axios.get('/api/user/servers')
    if (data.servers.length) {
      set({ servers: data.servers })
    }
  },
  updateCurrent: async (serverId) => {
    const { data } = await axios.get(`/api/server/${serverId}`)
    if (data.server) set({ current: data.server })
  }
}))
