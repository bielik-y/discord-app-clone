import axios from 'axios'
import qs from 'query-string'
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

function DeleteChannelModal() {
  const router = useRouter()
  const { isOpen, onClose, type, data } = useModal()
  const { server, updateServer } = useServerStore()
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'deleteChannel'

  async function handleSubmit() {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: "/api/server/channel",
        query: {
          serverId: server?.id,
          channelId: data?.channel.id
        }
      })
      const res = await axios.delete(url)
      await updateServer(res.data.server)
      // router.replace('/')
      onClose()
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
            Delete Channel
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to do this?<br/>
            Channel <span className="font-semibold text-indigo">{data?.channel?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
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

export { DeleteChannelModal }
