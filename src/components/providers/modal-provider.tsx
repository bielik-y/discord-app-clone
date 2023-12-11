import { CreateServerModal } from '@/components/modals/create-server-modal'
import { useState, useEffect } from 'react'

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
  </>
  )
}

export { ModalProvider }