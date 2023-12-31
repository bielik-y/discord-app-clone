import { Hash } from 'lucide-react'
import { UserAvatar } from '@/components/user-avatar'
import { SocketIndicator } from '@/components/socket-indicator'

interface ChatHeaderProps {
  name: string
  type: 'channel' | 'conversation'
}

function ChatHeader({ name, type }: ChatHeaderProps) {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 pl-10 font-semibold dark:border-neutral-700 md:pl-3">
      {type === 'channel' && (
        <Hash className="dar:text-zinc-400 mr-2 h-5 w-5 text-zinc-500" />
      )}
      {type === 'conversation' && (
        <UserAvatar memberName="" className="mr-3 h-5 w-5 md:h-5 md:w-5" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto mr-12 flex items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}

export { ChatHeader }
