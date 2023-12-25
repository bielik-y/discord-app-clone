import { Member } from '@prisma/client'
import { format } from 'date-fns'
import { ChatWelcome } from '@/components/chat/chat-welcome'
import { useChatQuery } from '@/hooks/use-chat-query'
import { Loader2, ServerCrash } from 'lucide-react'
import { Fragment } from 'react'
import { MessageWithMemberWithProfile } from '@/types'
import { ChatItem } from '@/components/chat/chat-item'

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

interface ChatMessagesProps {
  name: string
  member: Member
  chatId: string
  serverId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

function ChatMessages({
  name,
  member,
  chatId,
  serverId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}`
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      serverId,
      queryKey,
      apiUrl,
      paramKey,
      paramValue
    })

  if (status === 'pending') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 animate-pulse text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Oops, something went wrong
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((page, i) => (
          <Fragment key={i}>
            {page.data.messages.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                content={message.content}
                member={message.member}
                currentMember={member}
                fileUrl={message.fileUrl}
                isDeleted={message.deleted}
                isUpdated={message.updatedAt !== message.createdAt}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

export { ChatMessages }
