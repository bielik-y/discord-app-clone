import axios from 'axios'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Channel, Member } from '@prisma/client'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessages } from '@/components/chat/chat-messages'
import { MediaRoom } from '@/components/media-room'

interface ChannelProps {
  params: {
    serverId: string
    channelId: string
  }
}

function Channel({ params }: ChannelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [channel, setChannel] = useState<Channel>()
  const [member, setMember] = useState<Member>()

  const getChannel = useCallback(async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: '/api/server/channel',
        query: {
          serverId: params.serverId,
          channelId: params.channelId
        }
      })
      const { data } = await axios.get(url)
      setChannel(data.channel)
      setMember(data.member)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [params])

  useEffect(() => {
    getChannel()
  }, [getChannel])

  if (isLoading || !channel || !member)
    return (
      <div className="h-screen w-full">
        <Spinner loading={isLoading} />
      </div>
    )

  return (
    <div className="flex h-screen flex-col bg-white dark:bg-neutral-800">
      <ChatHeader
        serverId={params.serverId}
        name={channel?.name}
        type="channel"
      />
      {channel.type === 'TEXT' && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            serverId={channel.serverId}
            type="channel"
            apiUrl="/api/server/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}
      {channel.type === 'AUDIO' && (
        <MediaRoom 
          chatId={channel.id}
          video={false}
          audio={true}
          />
      )}
      {channel.type === 'VIDEO' && (
        <MediaRoom 
          chatId={channel.id}
          video={true}
          audio={true}
          />
      )}
    </div>
  )
}

export { Channel }
