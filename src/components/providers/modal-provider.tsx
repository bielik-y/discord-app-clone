import { useState, useEffect } from 'react'
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { EditServerModal } from '@/components/modals/edit-server-modal'
import { MembersModal } from '@/components/modals/members-modal'
import { InviteModal } from '@/components/modals/invite-modal'
import { CreateChannelModal } from '@/components/modals/create-channel-modal'
import { LeaveServerModal } from '@/components/modals/leave-server-modal'
import { DeleteServerModal } from '@/components/modals/delete-server-modal'
import { LogoutModal } from '@/components/modals/logout-modal'
import { DeleteChannelModal } from '@/components/modals/delete-channel-modal'
import { MessageFileModal } from '@/components/modals/message-file-modal'
import { DeleteMessageModal } from '@/components/modals/delete-message'

function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration error caused by modal window
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null
  
  return (
  <>
    <CreateServerModal />
    <CreateChannelModal />
    <EditServerModal />
    <MembersModal />
    <InviteModal />
    <LeaveServerModal />
    <DeleteServerModal />
    <LogoutModal />
    <DeleteChannelModal />
    <MessageFileModal />
    <DeleteMessageModal />
  </>
  )
}

export { ModalProvider }