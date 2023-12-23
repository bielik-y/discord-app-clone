import React from 'react'
import { cn } from '@/lib/utils'
import { Channel, Server } from '@/types'
import { ChannelType, Role } from '@prisma/client'
import { useModal } from '@/hooks/use-modal-store'
import { useServerStore } from '@/hooks/use-server-store'
import { Hash, Mic, Trash, Video, Lock } from 'lucide-react'
import { ActionTooltip } from '@/components/action-tooltip'

interface ServerChannelProps {
  channel: Channel
  server: Server
  role?: Role
}

const channelIconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video
}

function ServerChannel({ channel, server, role }: ServerChannelProps) {
  const { currentChannel, setChannel } = useServerStore()
  const { onOpen } = useModal()

  const Icon = channelIconMap[channel.type]

  function handleClick() {
    setChannel(channel.id)
  }

  // Resolve onClick conflict between redirect and delete button
  function handleAction(e: React.MouseEvent) {
    e.stopPropagation()
    onOpen('deleteChannel', channel)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md p-2 transition hover:bg-neutral-700/10 dark:hover:bg-zinc-700/50',
        currentChannel === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <Icon className="h-5 w-4 flex-shrink-0 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300',
          currentChannel === channel.id &&
            'text-black dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== Role.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip label="delete" align="center" side="right">
            <Trash
              onClick={(e) => handleAction(e)}
              className="hidden h-4 w-4 text-zinc-500 transition hover:text-zinc-600 group-hover:block dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  )
}

export { ServerChannel }
