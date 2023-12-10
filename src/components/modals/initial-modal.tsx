import { useEffect, useState } from 'react'
import { InitialForm } from '@/components/forms/initial-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

function InitialModal() {
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration error caused by modal window
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <Dialog open={isMounted}>
      <DialogContent hasCloseButton={false}>
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-center text-2xl">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and an cool image. You
            can always change this data later
          </DialogDescription>
        </DialogHeader>
        <InitialForm />
      </DialogContent>
    </Dialog>
  )
}

export { InitialModal }
