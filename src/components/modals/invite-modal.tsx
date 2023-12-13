import { useModal } from '@/hooks/use-modal-store'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '@/hooks/use-origin'
import { useState } from 'react'
import axios from 'axios'
import { LoadingOverlay } from '../loading-overlay'

function InviteModal() {
  const {
    isOpen,
    onOpen,
    onClose,
    type,
    data: { server }
  } = useModal()
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const origin = useOrigin()

  const isModalOpen = isOpen && type === 'invite'

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  function handleCopy() {
    navigator.clipboard.writeText(inviteUrl)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }

  async function handleRegenerate() {
    try {
      setIsLoading(true)
      const { data } = await axios.patch(
        `/api/server/${server?.id}/invite-code`
      )
      onOpen('invite', { server: data.server })
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
            Invite friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pb-2">
          <Label className="text-xs font-bold uppercase text-indigo-dark dark:text-indigo-light">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              value={inviteUrl}
              readOnly
              className="border-b-2 border-neutral-200 bg-zinc-700/10 px-3 font-semibold focus-visible:ring-0 focus-visible:ring-offset-0  dark:border-neutral-800 dark:bg-zinc-700/50"
            />
            <Button size="icon" className="bg-background" onClick={handleCopy}>
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <Button
          variant="link"
          size="sm"
          className="text-xs text-zinc-500"
          onClick={handleRegenerate}
        >
          Generate new link
          <RefreshCw className="ml-2 h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export { InviteModal }
