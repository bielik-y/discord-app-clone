import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useModal } from '@/hooks/use-modal-store'
import { serverSchema, ServerSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerStore } from '@/hooks/use-server-store'
import { toast } from 'sonner'
import { ErrorToast } from '@/components/error-toast'
import { LoadingOverlay } from '@/components/loading-overlay'
import { CreateServerForm } from '@/components/forms/create-server-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

function CreateServerModal() {
  const { isOpen, onClose, type } = useModal()

  const isModalOpen = isOpen && type === 'createServer'

  const router = useRouter()
  const { updateUserServers } = useServerStore()
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: '',
      imageUrl: ''
    }
  })

  async function handleSubmit(values: ServerSchema) {
    setIsLoading(true)
    try {
      const { data } = await axios.post('/api/user/servers', values)
      await updateUserServers()
      router.replace(`/servers/${data.serverId}`)
      form.reset()
      onClose()
    } catch (err: any) {
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
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and an cool image. You
            can always change this data later
          </DialogDescription>
        </DialogHeader>
        <LoadingOverlay loading={isLoading} />
        <CreateServerForm buttonText='Create' onSubmit={(values)=>handleSubmit(values)} form={form} />
      </DialogContent>
    </Dialog>
  )
}

export { CreateServerModal }
