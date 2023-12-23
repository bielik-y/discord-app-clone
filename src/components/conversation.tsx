import axios from 'axios'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { Member } from '@/types/models'
import { Spinner } from '@/components/ui/spinner'
import { ChatHeader } from '@/components/chat/chat-header'

interface ConversationProps {
  params: {
    serverId: string
    memberId: string
  }
}

function Conversation({ params }: ConversationProps) {
  const [isLoading, setIsLoading] = useState(false)
 const [ member, setMember] = useState<Member>()

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
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [params])

  useEffect(() => {
    getMember()
  }, [getMember])

  if (isLoading || !member)
    return (
      <div className="h-screen w-full">
        <Spinner loading={isLoading} />
      </div>
    )

  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-800">
      <ChatHeader
        serverId={params.serverId}
        name={member?.user.username}
        type="conversation"
      />
    </div>
  )
}

export { Conversation }
