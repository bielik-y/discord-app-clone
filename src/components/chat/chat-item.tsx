import axios from 'axios'
import Image from 'next/image'
import qs from 'query-string'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Member, Role, User } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/user-avatar'
import { ActionTooltip } from '@/components/action-tooltip'
import { Edit, ShieldAlert, ShieldCheck, Trash } from 'lucide-react'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { useModal } from '@/hooks/use-modal-store'
import { useServerStore } from '@/hooks/use-server-store'

const roleIconMap = {
  [Role.GUEST]: null,
  [Role.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-indigo" />,
  [Role.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />
}

const formSchema = z.object({
  content: z.string().min(1)
})

interface ChatItemProps {
  id: string
  content: string
  member: Member & { user: User }
  timestamp: string
  fileUrl: string | null
  isDeleted: boolean
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
  currentMember: Member
}

function ChatItem({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  isDeleted,
  isUpdated,
  socketUrl,
  socketQuery,
  currentMember
}: ChatItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const { setMember } = useServerStore()
  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  })

  const isLoading = form.formState.isSubmitting

  const isAdmin = currentMember.role === Role.ADMIN
  const isModerator = currentMember.role === Role.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMessage = !isDeleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !isDeleted && isOwner && !fileUrl

  useEffect(() => {
    form.reset({ content: content })
  }, [content, form])

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.key === 27) setIsEditing(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  async function onEditSubmit(values: z.infer<typeof formSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })
      await axios.patch(url, values)
      setIsEditing(false)
      form.reset()
    } catch (err) {
      console.log(err)
    }
  }

  function handleMemberClick() {
    if (member.id !== currentMember.id) setMember(member.id)
  }

  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar
            className="h-8 w-8 md:h-8 md:w-8"
            memberName={member.user.username}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={handleMemberClick}
                className="cursor-pointer text-sm font-semibold hover:underline"
              >
                {member.user.username}
              </p>
              <ActionTooltip label={member.role} align="center" side="right">
                {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-neutral-300 dark:bg-neutral-900/50"
            >
              <Image src={fileUrl} alt={content} fill />
            </a>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                isDeleted &&
                  'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
              )}
            >
              {content}
              {isUpdated && !isDeleted && (
                <span className="dark: mx-2 text-[10px] text-zinc-400 dark:text-zinc-500">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onEditSubmit)}
                className="flex w-full items-center gap-x-2 pt-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            autoComplete="off"
                            placeholder="Edited message"
                            className="border-0 border-none bg-zinc-200/90 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => setIsEditing(false)}
                  className="bg-neutral-500 hover:bg-neutral-600 dark:bg-neutral-600 dark:hover:bg-neutral-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[12px] text-zinc-500">
                Press Esc to cancel, Enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-900">
          {canEditMessage && (
            <ActionTooltip label="Edit" align="center" side="top">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete" align="center" side="top">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export { ChatItem }
