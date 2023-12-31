import axios from 'axios'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { ChatInputSchema, chatInputSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ErrorToast } from '@/components/error-toast'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useModal } from '@/hooks/use-modal-store'
import { EmojiPicker } from '@/components/emoji-picker'

interface ChatInputProps {
  name: string
  apiUrl: string
  query: Record<string, any>
  type: 'conversation' | 'channel'
}

function ChatInput({ name, apiUrl, query, type }: ChatInputProps) {
  const { onOpen } = useModal()
  const form = useForm<ChatInputSchema>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      content: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(value: ChatInputSchema) {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      await axios.post(url, value)
    } catch(err) {
      toast(<ErrorToast error={err} />)
    }
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-5">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", {apiUrl, query})}
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-400 transition hover:bg-zinc-500 dark:bg-zinc-500 dark:hover:bg-zinc-400"
                  >
                    <Plus className="h-4 w-4 text-white dark:text-neutral-800" />
                  </button>
                  <Input
                    {...field}
                    autoComplete="off"
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === 'conversation' ? 'user ' + name : '#' + name
                    }`}
                    className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-neutral-700/50 dark:text-zinc-200"
                  />
                  <div className="absolute right-8 top-7">
                    <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)}/>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export { ChatInput }
