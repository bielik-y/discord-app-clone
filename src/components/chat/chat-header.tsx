import { Hash } from 'lucide-react'

interface ChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
}

function ChatHeader({ serverId, name, type }: ChatHeaderProps) {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 pl-10 font-semibold dark:border-neutral-700 md:pl-3">
      {type === 'channel' && (
        <Hash className="dar:text-zinc-400 mr-2 h-5 w-5 text-zinc-500" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>
    </div>
  )
}

export { ChatHeader }
