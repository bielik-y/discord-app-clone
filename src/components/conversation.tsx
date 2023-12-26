import axios from 'axios'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { Conversation, Member, User } from '@prisma/client'
import { toast } from 'sonner'
import { ErrorToast } from '@/components/error-toast'
import { Spinner } from '@/components/ui/spinner'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatMessages } from '@/components/chat/chat-messages'
import { ChatInput } from '@/components/chat/chat-input'

interface ConversationProps {
  params: {
    serverId: string
    memberId: string
  }
}

function Conversation({ params }: ConversationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const [member, setMember] = useState<Member & { user: User }>()
  const [currentMember, setCurrentMember] = useState<Member & { user: User }>()
  const [conversation, setConversation] = useState<Conversation>()

  const getMember = useCallback(async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: '/api/server/member',
        query: {
          serverId: params.serverId,
          memberId: params.memberId
        }
      })
      const { data } = await axios.get(url)
      setMember(data.otherMember)
      setCurrentMember(data.currentMember)
      setConversation(data.conversation)
    } catch (err) {
      toast(<ErrorToast error={err} />)
    } finally {
      setIsLoading(false)
    }
  }, [params])

  useEffect(() => {
    getMember()
  }, [getMember])

  if (isLoading || !member || !currentMember || !conversation)
    return (
      <div className="h-screen w-full">
        <Spinner loading={isLoading} />
      </div>
    )

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-neutral-800">
      <ChatHeader name={member?.user.username} type="conversation" />
      <ChatMessages
        member={currentMember}
        name={member.user.username}
        chatId={conversation.id}
        serverId={params.serverId}
        type="conversation"
        apiUrl="/api/server/direct-messages"
        paramKey="conversationId"
        paramValue={conversation.id}
        socketUrl="/api/socket/direct-messages"
        socketQuery={{
          conversationId: conversation.id
        }}
      />
      <ChatInput
        name={member.user.username}
        type="conversation"
        apiUrl="/api/socket/direct-messages"
        query={{
          conversationId: conversation.id
        }}
      />
    </div>
  )
}

export { Conversation }
