import { Channel } from '@/types'
import { create } from 'zustand'

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'createChannel'
  | 'leaveServer'
  | 'deleteServer'
  | 'logout'
  | 'deleteChannel'
  | 'messageFile'
  | 'deleteMessage'

interface ModalData {
  channel?: Channel
  apiUrl?: string
  query?: Record<string, any>
}

interface ModalStore {
  data: ModalData
  type: ModalType | null
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data) => {
    if (data) set({ isOpen: true, data: data, type })
    else set({ isOpen: true, type })
  },
  onClose: () => set({ type: null, isOpen: false, data: {}})
}))
