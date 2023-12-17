import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { useServerStore } from '@/hooks/use-server-store'
import { Button } from '@/components/ui/button'
import { LoadingOverlay } from '@/components/loading-overlay'
import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { signOut, useSession } from 'next-auth/react'

function LogoutModal() {
  const { data: session } = useSession()
  const { isOpen, onClose, type } = useModal()
  const { resetServers } = useServerStore()
  
  const isModalOpen = isOpen && type === 'logout'

  async function handleSubmit() {
    try {
      signOut()
      resetServers()
      onClose()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-center text-2xl">
            Log Out
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?<br/>
            Current account is <span className="font-semibold text-indigo">{session?.user.email}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Log out
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { LogoutModal }
