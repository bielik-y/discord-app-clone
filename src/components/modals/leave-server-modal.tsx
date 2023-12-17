import axios from 'axios'
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

function LeaveServerModal() {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()
  const { server, updateUserServers } = useServerStore()
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'leaveServer'

  async function handleSubmit() {
    try {
      setIsLoading(true)
      await axios.patch(`/api/server/${server?.id}/leave`)
      await updateUserServers()
      onClose()
      router.replace('/')
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <LoadingOverlay loading={isLoading} />
      <DialogContent>
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-center text-2xl">
            Leave Server
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to leave{' '}
            <span className="font-semibold text-indigo">{server?.name}</span> ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSubmit}>
              Leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { LeaveServerModal }
