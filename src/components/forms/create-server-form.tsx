import axios from 'axios'
import { useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { serverSchema, ServerSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingOverlay } from '@/components/loading-overlay'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { useServerStore } from '@/hooks/use-server-store'

interface CreateServerFormProps {
  form: UseFormReturn<ServerSchema>
  onSubmit: (values: ServerSchema) => void
}

function CreateServerForm({ form, onSubmit }: CreateServerFormProps) {
  // const router = useRouter()
  // const { update } = useServerStore()
  // const [isLoading, setIsLoading] = useState(false)

  // const form = useForm({
  //   resolver: zodResolver(serverSchema),
  //   defaultValues: {
  //     name: '',
  //     imageUrl: ''
  //   }
  // })

  // async function onSubmit(values: ServerSchema) {
  //   setIsLoading(true)
  //   try {
  //     const { data } = await axios.post('/api/server', values)
  //     await update()
  //     router.replace(`/servers/${data.serverId}`)
  //     form.reset()
  //     closeModal()
  //   } catch (err: any) {
  //     if (err.response) {
  //       console.log(err.response)
  //     } else if (err.request) {
  //       console.log(err.request)
  //     } else {
  //       console.log(err.message)
  //     }
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <Form {...form}>
      {/* <LoadingOverlay loading={isLoading} /> */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create your server</FormLabel>
              <FormControl>
                <Input placeholder="Example: Cool Server" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-center text-center">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <FileUpload value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Create
        </Button>
      </form>
    </Form>
  )
}

export { CreateServerForm }
