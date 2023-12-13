import { UseFormReturn } from 'react-hook-form'
import { ServerSchema } from '@/lib/validations'
import { FileUpload } from '@/components/file-upload'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

interface CreateServerFormProps {
  form: UseFormReturn<ServerSchema>
  onSubmit: (values: ServerSchema) => void
}

function CreateServerForm({ form, onSubmit }: CreateServerFormProps) {
  return (
    <Form {...form}>
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
