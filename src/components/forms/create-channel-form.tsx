import { UseFormReturn } from 'react-hook-form'
import { ChannelSchema } from '@/lib/validations'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ChannelType } from '@prisma/client'

interface CreateChannelFormProps {
  form: UseFormReturn<ChannelSchema>
  buttonText: string
  onSubmit: (values: ChannelSchema) => void
}

function CreateChannelForm({
  form,
  onSubmit,
  buttonText
}: CreateChannelFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs uppercase text-neutral-500">
                Channel name
              </FormLabel>
              <FormControl>
                <Input autoComplete="off" placeholder="Example: Cool Channel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Channel type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border  capitalize border-neutral-200 transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50 outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Select a channel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ChannelType).map(type => (
                    <SelectItem key={type} value={type} className='capitalize'>{type.toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full">
          {buttonText}
        </Button>
      </form>
    </Form>
  )
}

export { CreateChannelForm }
