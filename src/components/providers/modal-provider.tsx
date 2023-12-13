import { CreateServerModal } from '@/components/modals/create-server-modal'
import { useState, useEffect } from 'react'
import { InviteModal } from '@/components/modals/invite-modal'
import { EditServerModal } from '@/components/modals/edit-server-modal'

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
    <EditServerModal />
    <InviteModal />
  </>
  )
}

export { ModalProvider }