import axios from 'axios'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { ServerSchema, serverSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoadingOverlay } from '@/components/loading-overlay'
import { CreateServerForm } from '@/components/forms/create-server-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

function InitialModal() {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: '',
      imageUrl: ''
    }
  })

  // Prevent hydration error caused by modal
  useEffect(() => {
    setIsMounted(true)
  }, [])

  async function handleSubmit(values: ServerSchema) {
    setIsLoading(true)
    try {
      const { data } = await axios.post('/api/user/servers', values)
      router.replace(`/servers/${data.serverId}`)
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
        <LoadingOverlay loading={isLoading} />
        <CreateServerForm
          buttonText='Create'
          onSubmit={(values) => handleSubmit(values)}
          form={form}
        />
      </DialogContent>
    </Dialog>
  )
}

export { InitialModal }
