import axios from 'axios'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { useServerStore } from '@/hooks/use-server-store'
import { toast } from 'sonner'
import { ErrorToast } from '@/components/error-toast'
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

function DeleteServerModal() {
  const router = useRouter()
  const { isOpen, onClose, type } = useModal()
  const { server, updateUserServers } = useServerStore()
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'deleteServer'

  async function handleSubmit() {
    try {
      setIsLoading(true)
      await axios.delete(`/api/server/${server?.id}`)
      await updateUserServers()
      router.replace('/')
      onClose()
    } catch (err) {
      toast(<ErrorToast error={err} />)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-center text-2xl">
            Delete Server
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to do this?<br/>
            <span className="font-semibold text-indigo">{server?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <LoadingOverlay loading={isLoading} />
        <DialogFooter className="px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSubmit}>
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { DeleteServerModal }
