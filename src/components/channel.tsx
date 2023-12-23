import axios from 'axios'
import qs from 'query-string'
import { useCallback, useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Channel } from '@prisma/client'
import { ChatHeader } from '@/components/chat/chat-header'

interface ChannelProps {
  params: {
    serverId: string
    channelId: string
  }
}

function Channel({ params }: ChannelProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [channel, setChannel] = useState<Channel>()

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
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }, [params])

  useEffect(() => {
    getChannel()
  }, [getChannel])

  if (isLoading || !channel)
    return (
      <div className="h-screen w-full">
        <Spinner loading={isLoading} />
      </div>
    )

  return (
    <div className="flex h-full flex-col bg-white dark:bg-neutral-800">
      <ChatHeader
        serverId={params.serverId}
        name={channel?.name}
        type="channel"
      />
    </div>
  )
}

export { Channel }