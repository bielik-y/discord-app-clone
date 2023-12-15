import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useModal } from '@/hooks/use-modal-store'
import { serverSchema, ServerSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServerStore } from '@/hooks/use-server-store'
import { LoadingOverlay } from '@/components/loading-overlay'
import { CreateServerForm } from '@/components/forms/create-server-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

function EditServerModal() {
  const {
    isOpen,
    onClose,
    type,
  } = useModal()
  
  const { server, updateUserServers, updateServer } = useServerStore()
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'editServer'

  const form = useForm({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: '',
      imageUrl: ''
    }
  })

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name)
      form.setValue('imageUrl', server.imageUrl)
    }
  }, [server, form])

  function handleClose() {
    if (server) {
      form.setValue('name', server.name)
      form.setValue('imageUrl', server.imageUrl)
    }
    onClose()
  }

  async function handleSubmit(values: ServerSchema) {
    setIsLoading(true)
    try {
      if (server) {
        const { data } = await axios.patch(`/api/server/${server.id}`, values)
        updateUserServers()
        updateServer(data.server)
        onClose()
      }
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
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a personality with a name and an cool image. You
            can always change this data later
          </DialogDescription>
        </DialogHeader>
        <LoadingOverlay loading={isLoading} />
        <CreateServerForm
          buttonText="Save"
          onSubmit={(values) => handleSubmit(values)}
          form={form}
        />
      </DialogContent>
    </Dialog>
  )
}

export { EditServerModal }
