import { Server } from '@/types/models'
import axios from 'axios'
import { create } from 'zustand'

interface ServerStore {
  activeServerId: string | null
  servers: Server[]
  update: (activeId?: string) => void
  changeActive: (id: string) => void
}

export const useServerStore = create<ServerStore>((set) => ({
  servers: [],
  activeServerId: null,
  update: async (activeId) => {
    const { data } = await axios.get('/api/server')
    if (activeId) set({ servers: data.servers, activeServerId: activeId })
    else set({ servers: data.servers, activeServerId: data.servers[0].id })
  },
  changeActive: (id) => set({ activeServerId: id })
}))
