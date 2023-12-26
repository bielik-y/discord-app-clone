import axios from 'axios'
import qs from 'query-string'
import { useState } from 'react'
import { useModal } from '@/hooks/use-modal-store'
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

function DeleteMessageModal() {
  const { isOpen, onClose, type, data } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'deleteMessage'

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: data.apiUrl || '',
        query: data.query
      })
      await axios.delete(url)
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
            Delete Message
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to do this?<br/>
            It <span className="font-semibold text-indigo">{data?.channel?.name}</span> will be permanently deleted for all users.
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

export { DeleteMessageModal }
