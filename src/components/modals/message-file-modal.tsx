import axios from 'axios'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import { useModal } from '@/hooks/use-modal-store'
import { ChatFileSchema, chatFileSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendFileForm } from '@/components/forms/send-file-form'
import { LoadingOverlay } from '@/components/loading-overlay'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

function MessageFileModal() {
  const { isOpen, onClose, type, data } = useModal()
  
  const isModalOpen = isOpen && type === "messageFile"
  const { apiUrl, query } = data

  const form = useForm({
    resolver: zodResolver(chatFileSchema),
    defaultValues: {
      fileUrl: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  function handleClose() {
    onClose()
    form.reset()
  }

  async function handleSubmit(values: ChatFileSchema) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query
      })
      await axios.post(url, {...values, content: values.fileUrl})
      handleClose()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent hasCloseButton={false}>
        <DialogHeader className="px-8 pt-8">
          <DialogTitle className="text-center text-2xl">
            Attach an image
          </DialogTitle>
          <DialogDescription className="text-center">
            Send an image as a message
          </DialogDescription>
        </DialogHeader>
        <LoadingOverlay loading={isLoading} />
        <SendFileForm
          buttonText='Send'
          onSubmit={(values) => handleSubmit(values)}
          form={form}
        />
      </DialogContent>
    </Dialog>
  )
}

export { MessageFileModal }
