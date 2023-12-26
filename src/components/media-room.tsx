import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react'
import '@livekit/components-styles'
import { useSession } from 'next-auth/react'
import axios from 'axios'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
  const [token, setToken] = useState('')
  const { data: session } = useSession()

  const user = session ? session.user : null

  useEffect(() => {
    if (!user || !user.username) return
    ;(async () => {
      try {
        const { data } = await axios.get(
          `/api/get-participant-token?room=${chatId}&username=${user.username}`
        )
        setToken(data.token)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [chatId, user])

  if (token === '') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }

  return (
  <LiveKitRoom
    token={token}
    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
    connect={true}
    video={video}
    audio={audio}
    data-lk-theme="default"
    className='overflow-hidden'
    >
      <VideoConference />
  </LiveKitRoom>)
}

export { MediaRoom }
