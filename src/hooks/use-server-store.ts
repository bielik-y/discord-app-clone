import axios from 'axios'
import { ServerShort } from '@/types/models'
import { create } from 'zustand'

interface ServerStore {
  activeServerId: string | null
  servers: ServerShort[]
  update: (activeId?: string) => void
  changeActive: (id: string) => void
}

export const useServerStore = create<ServerStore>((set) => ({
  servers: [],
  activeServerId: null,
  update: async (activeId) => {
    const { data } = await axios.get('/api/user/servers')
    if (data.servers.length) {
      if (activeId) set({ servers: data.servers, activeServerId: activeId })
      else set({ servers: data.servers, activeServerId: data.servers[0].id })
    }
  },
  changeActive: (id) => set({ activeServerId: id })
}))
