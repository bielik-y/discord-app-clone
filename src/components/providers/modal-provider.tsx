import { useState, useEffect } from 'react'
import { CreateServerModal } from '@/components/modals/create-server-modal'
import { EditServerModal } from '@/components/modals/edit-server-modal'
import { MembersModal } from '@/components/modals/members-modal'
import { InviteModal } from '@/components/modals/invite-modal'
import { CreateChannelModal } from '@/components/modals/create-channel-modal'

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
  </>
  )
}

export { ModalProvider }