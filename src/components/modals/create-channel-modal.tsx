import axios from 'axios'
import qs from 'query-string'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { channelSchema, ChannelSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerStore } from '@/hooks/use-server-store'
import { LoadingOverlay } from '@/components/loading-overlay'
import { CreateChannelForm } from '@/components/forms/create-channel-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

function CreateChannelModal() {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'createChannel'

  const { server, updateServer, setChannel } = useServerStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: '',
      type: 'TEXT'
    }
  })

  function handleClose() {
    form.reset()
    onClose()
  }

  async function handleSubmit(values: ChannelSchema) {
    setIsLoading(true)
    try {
      const url = qs.stringifyUrl({
        url: "/api/server/channel",
        query: {
          serverId: server?.id
        }
      })
      const { data } = await axios.post(url, values)
      await updateServer(data.server)
      handleClose()
    } catch (err: any) {
      if (err.response) {
        console.log(err.response)
      } else if (err.request) {
        console.log(err.request)
      } else {
        console.log(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-center text-2xl">
            Create Channel
          </DialogTitle>
        </DialogHeader>
        <LoadingOverlay loading={isLoading} />
        <CreateChannelForm buttonText='Create' onSubmit={(values)=>handleSubmit(values)} form={form} />
      </DialogContent>
    </Dialog>
  )
}

export { CreateChannelModal }
