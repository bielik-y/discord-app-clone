import { Channel } from '@/types/models'
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

interface ModalData {
  channel: Channel
}

interface ModalStore {
  data: ModalData | null
  type: ModalType | null
  isOpen: boolean
  onOpen: (type: ModalType, channel?: Channel) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: null,
  isOpen: false,
  onOpen: (type, channel) => {
    if (channel) set({ isOpen: true, data: { channel: channel }, type })
    else set({ isOpen: true, type })
  },
  onClose: () => set({ type: null, isOpen: false })
}))
