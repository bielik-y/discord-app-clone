import { UseFormReturn } from 'react-hook-form'
import { ChatFileSchema } from '@/lib/validations'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'

interface CreateServerFormProps {
  form: UseFormReturn<ChatFileSchema>
  buttonText: string
  onSubmit: (values: ChatFileSchema) => void
}

function SendFileForm({ form, onSubmit, buttonText }: CreateServerFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-center text-center">
          <FormField
            control={form.control}
            name="fileUrl"
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
          {buttonText}
        </Button>
      </form>
    </Form>
  )
}

export { SendFileForm }
